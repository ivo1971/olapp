#ifndef __CQUIZMANAGER__H__
#define __CQUIZMANAGER__H__

#include <thread>
#include <time.h>

#include "seasocks/PrintfLogger.h"

#include "CUser.h"
#include "CWsQuizHandler.h"
#include "IQuizMode.h"

class CQuizManager {
  private:
  public:
                                          CQuizManager(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler);
                                          ~CQuizManager(void) throw();

  private:
    void                                  HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
    void                                  HandleDisconnectQuiz  (const std::string& id);
    void                                  HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
    void                                  HandleDisconnectMaster(const std::string& id);
    void                                  HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
    void                                  HandleDisconnectBeamer(const std::string& id);

  private:
    void                                  ThreadTest(void);
    void                                  ThreadTestOne(const bool good);
    std::string                           ThreadUser2Team(const std::string& user);
    void                                  ThreadWait(const time_t waitSec);

  private:
    std::shared_ptr<CWsQuizHandler>       m_spWsQuizHandler;
    std::shared_ptr<CWsQuizHandler>       m_spWsMasterHandler;
    std::shared_ptr<CWsQuizHandler>       m_spWsBeamerHandler;
    std::shared_ptr<seasocks::Logger>     m_spLogger;
    boost::signals2::connection           m_WsQuizHandlerMessageConnection;
    boost::signals2::connection           m_WsQuizHandlerDisconnectConnection;
    boost::signals2::connection           m_WsMasterHandlerMessageConnection;
    boost::signals2::connection           m_WsMasterHandlerDisconnectConnection;
    boost::signals2::connection           m_WsBeamerHandlerMessageConnection;
    boost::signals2::connection           m_WsBeamerHandlerDisconnectConnection;
    bool                                  m_TestThreadStop;
    std::thread                           m_TestThread;
    std::mutex                            m_Lock;
    MapUser                               m_Users;
    std::shared_ptr<IQuizMode>            m_CurrentQuizMode;
};

#endif //__CQUIZMANAGER__H__
