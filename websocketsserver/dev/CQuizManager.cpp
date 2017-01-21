#include <fstream>
#include <iostream>
#include <mutex>
#include <sstream>
#include <unistd.h>

#include "json.hpp"

#include "CQuizManager.h"
#include "CQuizModeConfigureTeams.h"
#include "CQuizModeIgnore.h"
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
  , m_Teams()
  , m_Users()
  , m_CurrentQuizMode(new CQuizModeIgnore(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, m_Teams, m_Users))
  , m_FileName(fileName)
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
      MapUserIt userIt = m_Users.find(id);
      if(m_Users.end() == userIt) {
        m_Users.insert(PairUser(id, CUser(id, name, true)));
      } else {
        userIt->second.NameSet(name);
        userIt->second.ConnectedSet(true);
      }
      m_CurrentQuizMode->ReConnect(id);
      m_CurrentQuizMode->UsersChanged(m_Users);
      Save();
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
    } else if("team-add" == mi) {
      //get info from message
      const std::string& teamId   = GetElementString(citJsData, "teamId"  );
      const std::string& teamName = GetElementString(citJsData, "teamName");

      //new or existing team?
      MapTeamIt teamIt = m_Teams.find(teamId);
      if(m_Teams.end() == teamIt) {
        //new --> add it
        m_Teams.insert(PairTeam(teamId, CTeam(teamId, teamName)));
      } else {
        //existing --> error
        m_spLogger->error("CQuizManager [%s][%u] team with ID [%s] already exists.", __FUNCTION__, __LINE__, teamId.c_str());
        teamIt->second.NameSet(teamName);
      }
      m_CurrentQuizMode->TeamsChanged(m_Teams);
      Save();
    } else if("team-edit" == mi) {
      //get info from message
      const std::string& teamId   = GetElementString(citJsData, "teamId"  );
      const std::string& teamName = GetElementString(citJsData, "teamName");

      //new or existing team?
      MapTeamIt teamIt = m_Teams.find(teamId);
      if(m_Teams.end() == teamIt) {
        //new --> error
        m_spLogger->error("CQuizManager [%s][%u] team with ID [%s] does not yet exists.", __FUNCTION__, __LINE__, teamId.c_str());
      } else {
        //existing --> edit
        teamIt->second.NameSet(teamName);
      }
      m_CurrentQuizMode->TeamsChanged(m_Teams);
      Save();
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
    } else if("team-delete" == mi) {
      //get info from message
      const std::string& teamId   = GetElementString(citJsData, "teamId"  );

      //new or existing team?
      MapTeamIt teamIt = m_Teams.find(teamId);
      if(m_Teams.end() == teamIt) {
        //new --> error
        m_spLogger->error("CQuizManager [%s][%u] team with ID [%s] does not yet exists.", __FUNCTION__, __LINE__, teamId.c_str());
      } else {
        //existing --> edit
        m_Teams.erase(teamIt);
      }
      m_CurrentQuizMode->TeamsChanged(m_Teams);
      Save();
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
  if("welcome" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeWelcome         (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_Teams, m_Users));
  } else if("test" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeTest            (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_Teams, m_Users));
  } else if("simple-button-demo" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeSimpleButtonTest(m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_Teams, m_Users));
  } else if("configure-teams" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeConfigureTeams  (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_Teams, m_Users));
  } else {
    m_spLogger->error("CQuizManager [%s][%u] unhandled mode [%s].", __FUNCTION__, __LINE__, mode.c_str());
  }
}

void CQuizManager::Save(void) const
{
  //generate json data
  json data;
  data["teams"] = MapTeamToJson(m_Teams);
  data["users"] = MapUserToJson(m_Users);
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
  file >> dataDump;
  file.close();
  m_spLogger->info("CQuizManager [%s][%u] load [%s]: [%s].", __FUNCTION__, __LINE__, m_FileName.c_str(), dataDump.c_str());

  //string to json
  const json data = json::parse(dataDump);  

  //cleanup
  m_Teams.clear();
  m_Users.clear();

  //from json to teams
  try {
    const json::const_iterator citTeams       = GetElement(data,      "teams");
    const json::const_iterator citTeamsInner  = GetElement(*citTeams, "teams");
    const json                 jsonTeamsInner (*citTeamsInner); //contains an array of teams
    for(json::const_iterator citTeam = jsonTeamsInner.begin() ; jsonTeamsInner.end() != citTeam ; ++citTeam) {
      m_spLogger->info("CQuizManager [%s][%u] test [%s].", __FUNCTION__, __LINE__, citTeam->dump().c_str());
      CTeam tmp(*citTeam, m_Teams);
    }
  } catch(std::exception& ex) {
      m_spLogger->info("CQuizManager [%s][%u] loading users from [%s] failed: %s.", __FUNCTION__, __LINE__, m_FileName.c_str(), ex.what());
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
}
