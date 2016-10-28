#ifndef __CQUIZMANAGER__H__
#define __CQUIZMANAGER__H__

#include <thread>
#include <time.h>

#include "seasocks/PrintfLogger.h"

#include "CWsQuizHandler.h"

class CQuizManager {
 public:
  CQuizManager(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler);
  ~CQuizManager(void) throw();

 private:
  void                              HandleMessageQuiz(const std::string mi, const nlohmann::json::const_iterator citJsData);
  void                              HandleDisconnectQuiz(const std::string id);

 private:
  void                              ThreadTest(void);
  void                              ThreadWait(const time_t waitSec);

 private:
  std::shared_ptr<CWsQuizHandler>   m_spWsQuizHandler;
  std::shared_ptr<seasocks::Logger> m_spLogger;
  boost::signals2::connection       m_WsQuizHandlerMessageConnection;
  boost::signals2::connection       m_WsQuizHandlerDisconnectConnection;
  bool                              m_TestThreadStop;
  std::thread                       m_TestThread;
};

#endif //__CQUIZMANAGER__H__

