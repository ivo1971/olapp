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
  m_spLogger->info("CQuizManager [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizManager::HandleDisconnectQuiz(const std::string& id)
{
  m_spLogger->info("CQuizManager [%s][%u] ID [%s].", __FUNCTION__, __LINE__, id.c_str());
}

void CQuizManager::ThreadTest(void)
{
  m_spLogger->info("CQuizManager [%s][%u] in.", __FUNCTION__, __LINE__);
  try {
    ThreadWait(10);
  } catch(...) {
  }
  m_spLogger->info("CQuizManager [%s][%u] out.", __FUNCTION__, __LINE__);
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

