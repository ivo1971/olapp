#include <mutex>
#include <sstream>
#include <unistd.h>

#include "json.hpp"

#include "CSimpleButtonInfo.h"
#include "CQuizManager.h"
#include "JsonHelpers.h"
#include "Typedefs.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizManager::CQuizManager(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler)
  : m_spLogger(spLogger)
  , m_spWsQuizHandler(spWsQuizHandler)
  , m_WsQuizHandlerMessageConnection   (m_spWsQuizHandler->ConnectSignalMessage   (boost::bind(&CQuizManager::HandleMessageQuiz,    this, _1, _2, _3)))
  , m_WsQuizHandlerDisconnectConnection(m_spWsQuizHandler->ConnectSignalDisconnect(boost::bind(&CQuizManager::HandleDisconnectQuiz, this, _1)))
  , m_TestThreadStop(false)
  , m_TestThread(thread([=]{ThreadTest();}))
  , m_Lock()
  , m_Users()
{
}

CQuizManager::~CQuizManager(void) throw()
{
  //stop test thread
  m_TestThreadStop = true;
  m_TestThread.join();
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
	m_Users.insert(PairUser(id, CUser(name)));
      } else {
	userIt->second.NameSet(name);
      }
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
	m_Users.erase(userIt);
      }
  } catch(...) {
    m_Lock.unlock();
    throw;
  }
  m_Lock.unlock();
}

void CQuizManager::ThreadTest(void)
{
  m_spLogger->info("CQuizManager [%s][%u] in.", __FUNCTION__, __LINE__);
  bool good = false;
  while(!m_TestThreadStop) {
    ThreadTestOne(good);
    good = !good;
  }
  m_spLogger->info("CQuizManager [%s][%u] out.", __FUNCTION__, __LINE__);
}

void CQuizManager::ThreadTestOne(const bool good)
{
  const unsigned int stepTimeSec = 2;

  try {
    //wait untill at least 1 client is connected
    //before starting the test
    {
      m_spLogger->info("CQuizManager [%s][%u] wait for connections.", __FUNCTION__, __LINE__);
      bool cont = false;
      do {
	ThreadWait(5);
	m_Lock.lock();
	cont = 0 == m_Users.size();
	m_Lock.unlock();
      } while(cont);
      m_spLogger->info("CQuizManager [%s][%u] found connections --> start test.", __FUNCTION__, __LINE__);
    }

    //compose a list of all user names
    ListString userNames;
    for(MapUserCIt citUser = m_Users.begin() ; m_Users.end() != citUser ; ++citUser) {
      userNames.push_back(citUser->second.NameGet());
    }
    userNames.push_back("test");
    m_spLogger->info("CQuizManager [%s][%u] found users:", __FUNCTION__, __LINE__);
    for(ListStringCIt citUser = userNames.begin() ; userNames.end() != citUser ; ++citUser) {
      m_spLogger->info("CQuizManager [%s][%u]   - [%s]", __FUNCTION__, __LINE__, citUser->c_str());
    }

    //show the welcome route
    {
      m_spLogger->info("CQuizManager [%s][%u] 'welcome' route.", __FUNCTION__, __LINE__);
      json data;
      data["to"] = "welcome";
      m_spWsQuizHandler->SendMessage("route", data);
      ThreadWait(stepTimeSec);
    }

    //configure the teams
    {
      for(MapUserCIt citUser = m_Users.begin() ; m_Users.end() != citUser ; ++citUser) {
	stringstream team;
	team << "Team " << citUser->second.NameGet();
	json data;
	data["name"] = team.str();
	m_spWsQuizHandler->SendMessage(citUser->first, "team", data);
      }
    }

    //show the simple-button route
    {
      m_spLogger->info("CQuizManager [%s][%u] 'simple-button' route.", __FUNCTION__, __LINE__);
      json data;
      data["to"] = "simple-button";
      m_spWsQuizHandler->SendMessage("route", data);
      ThreadWait(stepTimeSec);
    }

    //simulate button-press info
    {
      CSimpleButtonInfo simpleButtonInfo;

      //init the simple-button route
      {
	m_spLogger->info("CQuizManager [%s][%u] 'simple-button' init.", __FUNCTION__, __LINE__);
	m_spWsQuizHandler->SendMessage("simple-button", simpleButtonInfo.ToJson());
	ThreadWait(stepTimeSec);
      }
      
      //simple-button: add a team for each user
      {
	m_spLogger->info("CQuizManager [%s][%u] 'simple-button' add teams.", __FUNCTION__, __LINE__);
	for(ListString userNamesButton = userNames ; 0 != userNamesButton.size() ; userNamesButton.pop_front()) {
	  simpleButtonInfo.TeamAdd(ThreadUser2Team(userNamesButton.front()));
	  simpleButtonInfo.TeamMembersAdd(ThreadUser2Team(userNamesButton.front()), userNamesButton.front());
	  m_spWsQuizHandler->SendMessage("simple-button", simpleButtonInfo.ToJson());
	  ThreadWait(stepTimeSec);
	}
      }
      
      //simple-button: add second user for each team
      {
	m_spLogger->info("CQuizManager [%s][%u] 'simple-button' add second user.", __FUNCTION__, __LINE__);
	for(ListString userNamesButton = userNames ; 0 != userNamesButton.size() ; userNamesButton.pop_front()) {
	  simpleButtonInfo.TeamMembersAdd(ThreadUser2Team(userNamesButton.front()), "second");
	  m_spWsQuizHandler->SendMessage("simple-button", simpleButtonInfo.ToJson());
	  ThreadWait(stepTimeSec);
	}
      }
      
      //simple-button: deactivate teams
      {
	unsigned int nbrGood = good ? 1 : 0xFFFFFFFF;
	unsigned int nbr     = 0;
	m_spLogger->info("CQuizManager [%s][%u] 'simple-button' deactivate.", __FUNCTION__, __LINE__);
	for(ListString userNamesButton = userNames ; 0 != userNamesButton.size() ; userNamesButton.pop_front(), ++nbr) {
	  if(nbr < nbrGood) {
	    simpleButtonInfo.TeamDeactivate(ThreadUser2Team(userNamesButton.front()));
	    m_spWsQuizHandler->SendMessage("simple-button", simpleButtonInfo.ToJson());
	    ThreadWait(stepTimeSec);
	  } else {
	    m_spLogger->info("CQuizManager [%s][%u] 'simple-button' GOOD.", __FUNCTION__, __LINE__);
	    simpleButtonInfo.TeamGood(ThreadUser2Team(userNamesButton.front()));
	    m_spWsQuizHandler->SendMessage("simple-button", simpleButtonInfo.ToJson());
	    ThreadWait(stepTimeSec * 2);
	    break;
	  }
	}
      }
      
      //clear the simple-button route
      {
	m_spLogger->info("CQuizManager [%s][%u] 'simple-button' reset.", __FUNCTION__, __LINE__);
	simpleButtonInfo.Reset();
	m_spWsQuizHandler->SendMessage("simple-button", simpleButtonInfo.ToJson());
	ThreadWait(stepTimeSec);
      }
    }

    //prepare for a new question
    {
      {
	m_spLogger->info("CQuizManager [%s][%u] 'simple-button' prepare new.", __FUNCTION__, __LINE__);
	json data;
	m_spWsQuizHandler->SendMessage("simple-button", data);
	ThreadWait(stepTimeSec);
      }

      CSimpleButtonInfo simpleButtonInfo;

      //init the simple-button route
      {
	m_spLogger->info("CQuizManager [%s][%u] 'simple-button' init.", __FUNCTION__, __LINE__);
	m_spWsQuizHandler->SendMessage("simple-button", simpleButtonInfo.ToJson());
	ThreadWait(stepTimeSec);
      }
    }

    //clear the teams
    {
      json data;
      data["name"] = "";
      m_spWsQuizHandler->SendMessage("team", data);
    }

  } catch(exception& ex) {
    m_spLogger->info("CQuizManager [%s][%u] exception: %s.", __FUNCTION__, __LINE__, ex.what());
  } catch(...) {
    m_spLogger->info("CQuizManager [%s][%u] exception: %s.", __FUNCTION__, __LINE__, "unknown");
  }
}

std::string CQuizManager::ThreadUser2Team(const std::string& user)
{
  stringstream team;
  team << "Team " << user;
  return team.str();
}

void CQuizManager::ThreadWait(const time_t waitSec)
{
  const time_t start = std::time(0);
  while(!m_TestThreadStop) {
    //check expiry
    const time_t now = std::time(0);
    if(waitSec < (now -start)) {
      return;
    }

    //wait a bit
    usleep(1000 * 1000);
  }

  //stop request
  throw std::exception();
}

