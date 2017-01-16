#include "CQuizModeSimpleButtonTest.h"
#include "CSimpleButtonInfo.h"
#include "Typedefs.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeSimpleButtonTest::CQuizModeSimpleButtonTest(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapUser& users)
   : IQuizMode(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, users)
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "simple-button")
   , m_TestThreadStop(false)
   , m_TestThread(thread([=]{ThreadTest();}))
   , m_Users(users)
{
}

CQuizModeSimpleButtonTest::~CQuizModeSimpleButtonTest(void) throw()
{
   //stop test thread
   m_TestThreadStop = true;
   m_TestThread.join();
}

void CQuizModeSimpleButtonTest::HandleMessageQuiz(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeSimpleButtonTest [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSimpleButtonTest::HandleMessageMaster(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeSimpleButtonTest [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSimpleButtonTest::HandleMessageBeamer(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeSimpleButtonTest [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSimpleButtonTest::UsersChanged(const MapUser& users)
{
    m_spLogger->info("CQuizModeSimpleButtonTest [%s][%u].", __FUNCTION__, __LINE__);
    m_Lock.lock();
    m_Users = users;
    m_Lock.unlock();
}

void CQuizModeSimpleButtonTest::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id);
}

void CQuizModeSimpleButtonTest::ThreadTest(void)
{
  m_spLogger->info("CQuizManager [%s][%u] in.", __FUNCTION__, __LINE__);
  bool good = false;
  while(!m_TestThreadStop) {
    ThreadTestOne(good);
    good = !good;
  }
  m_spLogger->info("CQuizManager [%s][%u] out.", __FUNCTION__, __LINE__);
}

void CQuizModeSimpleButtonTest::ThreadTestOne(const bool good)
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
      SendMessage("route", data);
      ThreadWait(stepTimeSec);
    }

    //configure the teams
    {
      for(MapUserCIt citUser = m_Users.begin() ; m_Users.end() != citUser ; ++citUser) {
        stringstream team;
        team << "Team " << citUser->second.NameGet();
        json data;
        data["name"] = team.str();
        SendMessage(citUser->first, "team", data);
      }
    }

    //show the simple-button route
    {
      m_spLogger->info("CQuizManager [%s][%u] 'simple-button' route.", __FUNCTION__, __LINE__);
      json data;
      data["to"] = "simple-button";
      SendMessage("route", data);
      ThreadWait(stepTimeSec);
    }

    //simulate button-press info
    {
      CSimpleButtonInfo simpleButtonInfo;

      //arm
      {
        m_spLogger->info("CQuizManager [%s][%u] 'simple-button' arm.", __FUNCTION__, __LINE__);
        json data = simpleButtonInfo.Arm();
        SendMessage("simple-button", data);
        ThreadWait(stepTimeSec);
      }
      
      //simple-button: add a team for each user
      //(simulate button pushes)
      {
        m_spLogger->info("CQuizManager [%s][%u] 'simple-button' add teams.", __FUNCTION__, __LINE__);
        for(ListString userNamesButton = userNames ; 0 != userNamesButton.size() ; userNamesButton.pop_front()) {
          simpleButtonInfo.TeamAdd(ThreadUser2Team(userNamesButton.front()));
          simpleButtonInfo.TeamMembersAdd(ThreadUser2Team(userNamesButton.front()), userNamesButton.front());
          SendMessage("simple-button", simpleButtonInfo.ToJson());
          ThreadWait(stepTimeSec);
        }
      }
      
      //simple-button: add second user for each team
      //(simulate button pushes)
      {
        m_spLogger->info("CQuizManager [%s][%u] 'simple-button' add second user.", __FUNCTION__, __LINE__);
        for(ListString userNamesButton = userNames ; 0 != userNamesButton.size() ; userNamesButton.pop_front()) {
          simpleButtonInfo.TeamMembersAdd(ThreadUser2Team(userNamesButton.front()), "second");
          SendMessage("simple-button", simpleButtonInfo.ToJson());
          ThreadWait(stepTimeSec);
        }
      }

      //simple-button: simulate out-of-sequence message
      {
        m_spLogger->info("CQuizManager [%s][%u] 'simple-button' out-of-sequence.", __FUNCTION__, __LINE__);
        CSimpleButtonInfo simpleButtonInfoOutOfSequence;
        json data = simpleButtonInfoOutOfSequence.Arm();
        SendMessage("simple-button", data);
        ThreadWait(stepTimeSec);
      }
      
      //simple-button: deactivate teams
      {
        unsigned int nbrGood = good ? 1 : 0xFFFFFFFF;
        unsigned int nbr     = 0;
        m_spLogger->info("CQuizManager [%s][%u] 'simple-button' deactivate.", __FUNCTION__, __LINE__);
        for(ListString userNamesButton = userNames ; 0 != userNamesButton.size() ; userNamesButton.pop_front(), ++nbr) {
          if(nbr < nbrGood) {
            simpleButtonInfo.TeamDeactivate(ThreadUser2Team(userNamesButton.front()));
            SendMessage("simple-button", simpleButtonInfo.ToJson());
            ThreadWait(stepTimeSec);
          } else {
            m_spLogger->info("CQuizManager [%s][%u] 'simple-button' GOOD.", __FUNCTION__, __LINE__);
            simpleButtonInfo.TeamGood(ThreadUser2Team(userNamesButton.front()));
            SendMessage("simple-button", simpleButtonInfo.ToJson());
            ThreadWait(stepTimeSec * 2);
            break;
          }
        }
      }
      
      //clear the simple-button route
      //(prepare for a new question)
      {
        m_spLogger->info("CQuizManager [%s][%u] 'simple-button' reset.", __FUNCTION__, __LINE__);
        json data = simpleButtonInfo.Reset();
        SendMessage("simple-button", data);
        ThreadWait(stepTimeSec);
      }

      //arm again
      {
        m_spLogger->info("CQuizManager [%s][%u] 'simple-button' arm.", __FUNCTION__, __LINE__);
        json data = simpleButtonInfo.Arm();
        SendMessage("simple-button", data);
        ThreadWait(stepTimeSec);
      }
    }

    //clear the teams
    {
      json data;
      data["name"] = "";
      SendMessage("team", data);
    }

  } catch(exception& ex) {
    m_spLogger->info("CQuizManager [%s][%u] exception: %s.", __FUNCTION__, __LINE__, ex.what());
  } catch(...) {
    m_spLogger->info("CQuizManager [%s][%u] exception: %s.", __FUNCTION__, __LINE__, "unknown");
  }
}

std::string CQuizModeSimpleButtonTest::ThreadUser2Team(const std::string& user)
{
  stringstream team;
  team << "Team " << user;
  return team.str();
}

void CQuizModeSimpleButtonTest::ThreadWait(const time_t waitSec)
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

void CQuizModeSimpleButtonTest::SendMessage(const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
  m_spWsQuizHandler->SendMessage  (mi, citJsData);
  m_spWsMasterHandler->SendMessage(mi, citJsData);
  m_spWsBeamerHandler->SendMessage(mi, citJsData);
}

void CQuizModeSimpleButtonTest::SendMessage(const std::string& mi, const nlohmann::json& data)
{
  m_spWsQuizHandler->SendMessage  (mi, data);
  m_spWsMasterHandler->SendMessage(mi, data);
  m_spWsBeamerHandler->SendMessage(mi, data);
}

void CQuizModeSimpleButtonTest::SendMessage(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
  m_spWsQuizHandler->SendMessage  (id, mi, citJsData);
  m_spWsMasterHandler->SendMessage(id, mi, citJsData);
  m_spWsBeamerHandler->SendMessage(id, mi, citJsData);
}

void CQuizModeSimpleButtonTest::SendMessage(const std::string& id, const std::string& mi, const nlohmann::json& data)
{
  m_spWsQuizHandler->SendMessage  (id, mi, data);
  m_spWsMasterHandler->SendMessage(id, mi, data);
  m_spWsBeamerHandler->SendMessage(id, mi, data);
}
