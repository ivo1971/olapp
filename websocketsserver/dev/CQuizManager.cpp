#include <fstream>
#include <iostream>
#include <mutex>
#include <sstream>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

#include "json.hpp"

#include "CQuizManager.h"
#include "CQuizModeConfigureTeams.h"
#include "CQuizModeIgnore.h"
#include "CQuizModeQuestions.h"
#include "CQuizModeScoreboard.h"
#include "CQuizModeSimpleButton.h"
#include "CQuizModeSimpleButtonTest.h"
#include "CQuizModeSortImages.h"
#include "CQuizModeTeamfie.h"
#include "CQuizModeTest.h"
#include "CQuizModeWelcome.h"
#include "JsonHelpers.h"
#include "Typedefs.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizManager::CQuizManager(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const std::string& fileName, const std::string& httpDir)
  : m_spLogger(spLogger)
  , m_spWsQuizHandler(spWsQuizHandler)
  , m_spWsMasterHandler(spWsMasterHandler)
  , m_spWsBeamerHandler(spWsBeamerHandler)
  , m_WsQuizHandlerMessageConnection     (m_spWsQuizHandler->ConnectSignalMessage     (boost::bind(&CQuizManager::HandleMessageQuiz,      this, _1, _2, _3)))
  , m_WsQuizHandlerDisconnectConnection  (m_spWsQuizHandler->ConnectSignalDisconnect  (boost::bind(&CQuizManager::HandleDisconnectQuiz,   this, _1)))
  , m_WsMasterHandlerMessageConnection   (m_spWsMasterHandler->ConnectSignalMessage   (boost::bind(&CQuizManager::HandleMessageMaster,    this, _1, _2, _3)))
  , m_WsMasterHandlerDisconnectConnection(m_spWsMasterHandler->ConnectSignalDisconnect(boost::bind(&CQuizManager::HandleDisconnectMaster, this, _1)))
  , m_WsBeamerHandlerMessageConnection   (m_spWsBeamerHandler->ConnectSignalMessage   (boost::bind(&CQuizManager::HandleMessageBeamer,    this, _1, _2, _3)))
  , m_WsBeamerHandlerDisconnectConnection(m_spWsBeamerHandler->ConnectSignalDisconnect(boost::bind(&CQuizManager::HandleDisconnectBeamer, this, _1)))
  , m_Lock()
  , m_Users()
  , m_CurrentQuizMode(new CQuizModeIgnore(spLogger))
  , m_FileName(fileName)
  , m_TeamfieDir(fileName + std::string(".teamfies"))
  , m_HttpDir(httpDir)
  , m_HttpImagesDir(httpDir + std::string("/images/"))
  , m_DirtySimpleButtonConfig([this](){Save();})
  , m_DirtyTeamManager([this](){Save();SendTeamsToAll();})
  , m_spSimpleButtonConfig(new CQuizModeSimpleButton::CConfig(m_DirtySimpleButtonConfig))
  , m_spTeamManager(new CTeamManager(m_spLogger, m_DirtyTeamManager))
{
  //try to load the configuration from file
  Load();

  //make teamfie dir
  mkdir(m_TeamfieDir.c_str(), S_IRWXU);
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
      }
      SendTeam(id);
      SendTeamsToOne(m_spWsQuizHandler, id);
    } else if("load-img-base64" == mi) {
      HandleMiLoadImgBase64(m_spWsQuizHandler, id, citJsData);
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
      SendTeamsToOne(m_spWsMasterHandler, id);
      CQuizModeTeamfie::SendAllImages(m_spWsMasterHandler, m_TeamfieDir, m_spTeamManager); //TODO: send to 1 ID
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
    } else if("load-img-base64" == mi) {
      HandleMiLoadImgBase64(m_spWsMasterHandler, id, citJsData);
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
      SendTeamsToOne(m_spWsBeamerHandler, id);
      CQuizModeTeamfie::SendAllImages(m_spWsBeamerHandler, m_TeamfieDir, m_spTeamManager); //TODO: send to 1 ID
      m_CurrentQuizMode->ReConnect(id);
    } else if("load-img-base64" == mi) {
      HandleMiLoadImgBase64(m_spWsBeamerHandler, id, citJsData);
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

void CQuizManager::HandleMiLoadImgBase64(std::shared_ptr<CWsQuizHandler> spWsQuizHandler, const std::string& id, const nlohmann::json::const_iterator citJsData)
{
  //image path postfix
  static std::string base64 = std::string(".base64");

  //get image name from request
  const std::string imageName = GetElementString(citJsData, "imageName");
  const std::string imagePath = m_HttpImagesDir + imageName + base64;
  m_spLogger->info("CQuizManager [%s][%u] name [%s] --> [%s]", __FUNCTION__, __LINE__, imageName.c_str(), imagePath.c_str());

  //read from file
  std::string imageData;
  ifstream file;
  file.open(imagePath, ios::in);
  if(!file.is_open()) {
    m_spLogger->error("CQuizManager [%s][%u] could not open file [%s]: %m", __FUNCTION__, __LINE__, imagePath.c_str());
    //TODO: send an error response?
    return;
  }
  while(file) {
    std::string tmp;
    file >> tmp;
    imageData += tmp;
  }
  file.close();
  if(file.bad()) {
    m_spLogger->error("CQuizManager [%s][%u] could not read file [%s]: %m", __FUNCTION__, __LINE__, imagePath.c_str());
    //TODO: send an error response?
    return;
  }

  //compose response data
  json data;
  data["imageName"]  = imageName; 
  data["imageData"]  = imageData; 

  //send
  spWsQuizHandler->SendMessage(id, "load-img-base64", data);
}

void CQuizManager::SelectMode(const std::string& mode)
{
  m_spLogger->info("CQuizManager [%s][%u] switching to mode [%s].", __FUNCTION__, __LINE__, mode.c_str());

  //switch
  if("welcome" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeWelcome         (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler));
  } else if("test" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeTest            (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler));
  } else if("scoreboard" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeScoreboard      (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_spTeamManager));
  } else if("simple-button-demo" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeSimpleButtonTest(m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_Users));
  } else if("simple-button" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeSimpleButton    (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_spTeamManager, m_Users, m_spSimpleButtonConfig));
  } else if("sort-images" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeSortImages      (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_spTeamManager, m_Users, m_HttpDir, m_HttpImagesDir));
  } else if("questions" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeQuestions       (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_spTeamManager, m_Users));
  } else if("configure-teams" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeConfigureTeams  (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_spTeamManager, m_Users));
  } else if("teamfie" == mode) {
    m_CurrentQuizMode.reset(new CQuizModeTeamfie         (m_spLogger, m_spWsQuizHandler, m_spWsMasterHandler, m_spWsBeamerHandler, m_spTeamManager, m_Users, m_TeamfieDir));
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
  data["id"]   = citUser->second.TeamGet();
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

  //trace
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

  //from json to teams
  {
    const json::const_iterator citTeams = GetElement(data,      "teams");
    SPTeamManager spTeamManager(new CTeamManager(m_spLogger, m_DirtyTeamManager, *citTeams));
    m_spTeamManager = spTeamManager;
  }

  //from json to users
  m_Users.clear();
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
      m_spSimpleButtonConfig.reset(new CQuizModeSimpleButton::CConfig(*citSimpleButtonConfig, m_DirtySimpleButtonConfig));
  } catch(std::exception& ex) {
      m_spLogger->info("CQuizManager [%s][%u] loading simple-button config from [%s] failed: %s.", __FUNCTION__, __LINE__, m_FileName.c_str(), ex.what());
  }

  //TODO: consitency check:
  //- check that the teams of all users exist,
  //  clear the none-existing teams
}

void CQuizManager::SendTeamsToAll(void)
{
    m_spLogger->info("CQuizManager [%s][%u].", __FUNCTION__, __LINE__);
    SendMessageAll("team-list", m_spTeamManager->ToJson());
    for(auto user : m_Users) {
      SendTeam(user.first);
    }
}

void CQuizManager::SendTeamsToOne(std::shared_ptr<CWsQuizHandler> spWsHandler, const std::string& id)
{
    m_spLogger->info("CQuizManager [%s][%u].", __FUNCTION__, __LINE__);
    spWsHandler->SendMessage(id, "team-list", m_spTeamManager->ToJson());
}

void CQuizManager::SendMessageAll(const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
  m_spWsQuizHandler->SendMessage  (mi, citJsData);
  m_spWsMasterHandler->SendMessage(mi, citJsData);
  m_spWsBeamerHandler->SendMessage(mi, citJsData);
}

void CQuizManager::SendMessageAll(const std::string& mi, const nlohmann::json& data)
{
  m_spWsQuizHandler->SendMessage  (mi, data);
  m_spWsMasterHandler->SendMessage(mi, data);
  m_spWsBeamerHandler->SendMessage(mi, data);
}

void CQuizManager::SendMessageAll(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
  m_spWsQuizHandler->SendMessage  (id, mi, citJsData);
  m_spWsMasterHandler->SendMessage(id, mi, citJsData);
  m_spWsBeamerHandler->SendMessage(id, mi, citJsData);
}

void CQuizManager::SendMessageAll(const std::string& id, const std::string& mi, const nlohmann::json& data)
{
  m_spWsQuizHandler->SendMessage  (id, mi, data);
  m_spWsMasterHandler->SendMessage(id, mi, data);
  m_spWsBeamerHandler->SendMessage(id, mi, data);
}
