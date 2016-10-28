#include <mutex>
#include <unistd.h>

#include "json.hpp"

#include "CQuizManager.h"

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
  , m_NbrConnected()
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
      ++m_NbrConnected;
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
    --m_NbrConnected;
  } catch(...) {
    m_Lock.unlock();
    throw;
  }
  m_Lock.unlock();
}

void CQuizManager::ThreadTest(void)
{
  m_spLogger->info("CQuizManager [%s][%u] in.", __FUNCTION__, __LINE__);
  while(!m_TestThreadStop) {
    ThreadTestOne();
  }
  m_spLogger->info("CQuizManager [%s][%u] out.", __FUNCTION__, __LINE__);
}

void CQuizManager::ThreadTestOne(void)
{
  try {
    //wait untill at least 1 client is connected
    //before starting the test
    {
      m_spLogger->info("CQuizManager [%s][%u] wait for connections.", __FUNCTION__, __LINE__);
      bool cont = false;
      do {
	ThreadWait(15);
	m_Lock.lock();
	cont = 0 == m_NbrConnected;
	m_Lock.unlock();
      } while(cont);
      m_spLogger->info("CQuizManager [%s][%u] found connections --> start test.", __FUNCTION__, __LINE__);
    }

    //show the welcome route
    {
      m_spLogger->info("CQuizManager [%s][%u] 'welcome' route.", __FUNCTION__, __LINE__);
      json data;
      data["to"] = "welcome";
      m_spWsQuizHandler->SendMessage("route", data);
      ThreadWait(5);
    }

    //show the smart-button route
    {
      m_spLogger->info("CQuizManager [%s][%u] 'smart-button' route.", __FUNCTION__, __LINE__);
      json data;
      data["to"] = "simple-button";
      m_spWsQuizHandler->SendMessage("route", data);
      ThreadWait(5);
    }
  } catch(exception& ex) {
    m_spLogger->info("CQuizManager [%s][%u] exception: %s.", __FUNCTION__, __LINE__, ex.what());
  } catch(...) {
    m_spLogger->info("CQuizManager [%s][%u] exception: %s.", __FUNCTION__, __LINE__, "unknown");
  }
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

