#include <fstream>
#include <iostream>
#include <mutex>
#include <sstream>
#include <unistd.h>

#include "json.hpp"

#include "CQuizManager.h"
#include "CQuizModeConfigureTeams.h"
#include "CQuizModeIgnore.h"
#include "CQuizModeSimpleButton.h"
#include "CQuizModeSimpleButtonTest.h"
#include "CQuizModeTest.h"
#include "CQuizModeWelcome.h"
#include "JsonHelpers.h"
#include "Typedefs.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizManager::CQuizManager(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const std::string& fileName)
  : m_spWsQuizHandler(spWsQuizHandler)
  , m_spWsMasterHandler(spWsMasterHandler)
  , m_spWsBeamerHandler(spWsBeamerHandler)
  , m_spLogger(spLogger)
  , m_WsQuizHandlerMessageConnection     (m_spWsQuizHandler->ConnectSignalMessage     (boost::bind(&CQuizManager::HandleMessageQuiz,      this, _1, _2, _3)))
  , m_WsQuizHandlerDisconnectConnection  (m_spWsQuizHandler->ConnectSignalDisconnect  (boost::bind(&CQuizManager::HandleDisconnectQuiz,   this, _1)))
  , m_WsMasterHandlerMessageConnection   (m_spWsMasterHandler->ConnectSignalMessage   (boost::bind(&CQuizManager::HandleMessageMaster,    this, _1, _2, _3)))
  , m_WsMasterHandlerDisconnectConnection(m_spWsMasterHandler->ConnectSignalDisconnect(boost::bind(&CQuizManager::HandleDisconnectMaster, this, _1)))
  , m_WsBeamerHandlerMessageConnection   (m_spWsBeamerHandler->ConnectSignalMessage   (boost::bind(&CQuizManager::HandleMessageBeamer,    this, _1, _2, _3)))
  , m_WsBeamerHandlerDisconnectConnection(m_spWsBeamerHandler->ConnectSignalDisconnect(boost::bind(&CQuizManager::HandleDisconnectBeamer, this, _1)))
  , m_Users()
  , m_CurrentQuizMode(new CQuizModeIgnore(spLogger))
  , m_FileName(fileName)
  , m_RequestSave([this](){Save();})
  , m_spSimpleButtonConfig(new CQuizModeSimpleButton::CConfig(m_RequestSave))
  , m_spTeamManager(new CTeamManager(m_spLogger, m_RequestSave))
{
  Load();
}

CQuizManager::~CQuizManager(void) throw()
{
}

void CQuizManager::HandleMessageQuiz(const std::string& id, const std::string& mi, const json::const_iterator citJsData)
{
  m_Lock.lock();
  try {
    m_spLogger->info("CQuizManager [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("id" == mi) {
      //get info from message
      const std::string& name = GetElementString(citJsData, "name");

      //new or existing user?
      bool changed = false;
      MapUserIt userIt = m_Users.find(id);
      if(m_Users.end() == userIt) {
        m_Users.insert(PairUser(id, CUser(id, name, true)));
        changed = true;
      } else {
        if(name != userIt->second.NameGet()) {        
          userIt->second.NameSet(name);
          changed = true;
        }
        if(!userIt->second.ConnectedGet()) {
          userIt->second.ConnectedSet(true);
          changed = true;
        }
      }
      if(changed) {
        m_CurrentQuizMode->ReConnect(id);
        m_CurrentQuizMode->UsersChanged(m_Users);
        Save();
        SendTeam(id);
      }
    } else {
      //default: forward to current node
      m_CurrentQuizMode->HandleMessageQuiz(id, mi, citJsData);
    }
  } catch(...) {
    m_Lock.unlock();
    throw;
  }
  m_Lock.unlock();
}

void CQuizManager::HandleDisconnectQuiz(const std::string& id)
{
  m_Lock.lock();
  try {
      m_spLogger->info("CQuizManager [%s][%u] ID [%s].", __FUNCTION__, __LINE__, id.c_str());
      MapUserIt userIt = m_Users.find(id);
      if(m_Users.end() != userIt) {
        userIt->second.ConnectedSet(false);
        m_CurrentQuizMode->UsersChanged(m_Users);
        //no need to save
      }
  } catch(...) {
    m_Lock.unlock();
    throw;
  }
  m_Lock.unlock();
}

void CQuizManager::HandleMessageMaster(const std::string& id, const std::string& mi, const json::const_iterator citJsData)
{
  m_Lock.lock();
  try {
    m_spLogger->info("CQuizManager [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("id" == mi) {
      m_CurrentQuizMode->ReConnect(id);
    } else if("select-mode" == mi) {
      //get info from message
      const std::string& mode = GetElementString(citJsData, "mode");
      SelectMode(mode);
    } else if("user-select-team" == mi) {
      //get info from message
      const std::string& userId   = GetElementString(citJsData, "userId"  );
      const std::string& teamId   = GetElementString(citJsData, "teamId"  );

      //existing user?
      MapUserIt userIt = m_Users.find(userId);
      if(m_Users.end() != userIt) {
        userIt->second.TeamSet(teamId);
      }
      m_CurrentQuizMode->UsersChanged(m_Users);
      Save();
      SendTeam(userId);
    } else {
      //default: forward to current node
      m_CurrentQuizMode->HandleMessageMaster(id, mi, citJsData);
    }
  } catch(...) {
    m_Lock.unlock();
    throw;
  }
  m_Lock.unlock();
}

void CQuizManager::HandleDisconnectMaster(const std::string& id)
{
  m_Lock.lock();
  try {
    m_spLogger->info("CQuizManager [%s][%u] ID [%s].", __FUNCTION__, __LINE__, id.c_str());
  } catch(...) {
    m_Lock.unlock();
    throw;
  }
  m_Lock.unlock();
}

void CQuizManager::HandleMessageBeamer(const std::string& id, const std::string& mi, const json::const_iterator citJsData)
{
  m_Lock.lock();
  try {
    m_spLogger->info("CQuizManager [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("id" == mi) {
      m_CurrentQuizMode->ReConnect(id);
    } else {
      //default: forward to current node
      m_CurrentQuizMode->HandleMessageBeamer(id, mi, citJsData);
    }
  } catch(...) {
    m_Lock.unlock();
    throw;
  }
  m_Lock.unlock();
}

void CQuizManager::HandleDisconnectBeamer(const std::string& id)
{
  m_Lock.lock();
  try {
      m_spLogger->info("CQuizManager [%s][%u] ID [%s].", __FUNCTION__, __LINE__, id.c_str());
  } catch(...) {
    m_Lock.unlock();
    throw;
  }
  m_Lock.unlock();
}

void CQuizManager::SelectMode(const std::string& mode)
{
  m_spLogger->info("CQuizManager [%s][%u] switching to mode [%s].", __FUNCTION__, __LINE__, mode.c_str());

  //switch
  if("welcome" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeWelcome         (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler));
  } else if("test" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeTest            (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler));
  } else if("simple-button-demo" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeSimpleButtonTest(m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_Users));
  } else if("simple-button" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeSimpleButton    (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_spTeamManager, m_Users, m_spSimpleButtonConfig));
  } else if("configure-teams" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeConfigureTeams  (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_spTeamManager, m_Users));
  } else {
    m_spLogger->error("CQuizManager [%s][%u] unhandled mode [%s].", __FUNCTION__, __LINE__, mode.c_str());
  }
}

void CQuizManager::SendTeam(const std::string& userId)
{
  //find user
  MapUserCIt citUser = m_Users.find(userId);
  if(m_Users.end() == citUser) {
    //not found
    return;
  }

  //find team
  std::string teamName;
  if(!m_spTeamManager->FindTeamName(citUser->second.TeamGet(), teamName)) {
    //not found
    return;
  }

  //send
  json data;
  data["name"] = teamName;
  m_spWsQuizHandler->SendMessage(citUser->first, "team", data);
}

void CQuizManager::Save(void) const
{
  //generate json data
  json data;
  data["teams"]                = m_spTeamManager->ToJson();
  data["users"]                = MapUserToJson(m_Users);
  data["simple-button-config"] = m_spSimpleButtonConfig->ToJson(); 

  const std::string dataDump = data.dump();
  m_spLogger->info("CQuizManager [%s][%u] save [%s]: [%s].", __FUNCTION__, __LINE__, m_FileName.c_str(), dataDump.c_str());

  //save to file
  ofstream file;
  file.open(m_FileName, ios::out | ios::trunc);
  if(!file.is_open()) {
    m_spLogger->error("CQuizManager [%s][%u] could not open file [%s]: %m", __FUNCTION__, __LINE__, m_FileName.c_str());
  }
  file << dataDump;
  file.close();
}

void CQuizManager::Load(void)
{
  std::string dataDump;

  //read from file
  ifstream file;
  file.open(m_FileName, ios::in);
  if(!file.is_open()) {
    m_spLogger->error("CQuizManager [%s][%u] could not open file [%s]: %m", __FUNCTION__, __LINE__, m_FileName.c_str());
  }
  while(file) {
    std::string tmp;
    file >> tmp;
    dataDump += tmp;
  }
  file.close();
  m_spLogger->info("CQuizManager [%s][%u] load [%s]: [%s].", __FUNCTION__, __LINE__, m_FileName.c_str(), dataDump.c_str());

  //string to json
  const json data = json::parse(dataDump);  

  //cleanup
  m_Users.clear();

  //from json to teams
  {
    const json::const_iterator citTeams = GetElement(data,      "teams");
    SPTeamManager spTeamManager(new CTeamManager(m_spLogger, m_RequestSave, *citTeams));
    m_spTeamManager = spTeamManager;
  }

  //from json to users
  try {
    const json::const_iterator citUsers       = GetElement(data,      "users");
    const json::const_iterator citUsersInner  = GetElement(*citUsers, "users");
    const json                 jsonUsersInner (*citUsersInner); //contains an array of users
    m_spLogger->info("CQuizManager [%s][%u] test [%s].", __FUNCTION__, __LINE__, jsonUsersInner.dump().c_str());
    for(json::const_iterator citUser = jsonUsersInner.begin() ; jsonUsersInner.end() != citUser ; ++citUser) {
      m_spLogger->info("CQuizManager [%s][%u] test [%s].", __FUNCTION__, __LINE__, citUser->dump().c_str());
      CUser tmp(*citUser, m_Users);
    }
  } catch(std::exception& ex) {
      m_spLogger->info("CQuizManager [%s][%u] loading users from [%s] failed: %s.", __FUNCTION__, __LINE__, m_FileName.c_str(), ex.what());
  }

  //from json to simple-button-config
  try {
      const json::const_iterator citSimpleButtonConfig = GetElement(data,      "simple-button-config");
      m_spSimpleButtonConfig.reset(new CQuizModeSimpleButton::CConfig(*citSimpleButtonConfig, m_RequestSave));
  } catch(std::exception& ex) {
      m_spLogger->info("CQuizManager [%s][%u] loading simple-button config from [%s] failed: %s.", __FUNCTION__, __LINE__, m_FileName.c_str(), ex.what());
  }
}
