#ifndef __CQUIZMODESSIMPLEBUTTONTEST__H__
#define __CQUIZMODESSIMPLEBUTTONTEST__H__

#include <mutex>

#include "IQuizMode.h"

class CQuizModeSimpleButtonTest : public IQuizMode {
   public:
                                            CQuizModeSimpleButtonTest(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapUser& users);
      virtual                               ~CQuizModeSimpleButtonTest(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged          (const MapUser& users);

   private:
      void                                  ThreadTest            (void);
      void                                  ThreadTestOne         (const bool good);
      std::string                           ThreadUser2Team       (const std::string& user);
      void                                  ThreadWait            (const time_t waitSec);

   private:
      std::shared_ptr<CWsQuizHandler>       m_spWsQuizHandler;
      std::shared_ptr<CWsQuizHandler>       m_spWsMasterHandler;
      std::shared_ptr<CWsQuizHandler>       m_spWsBeamerHandler;
      std::shared_ptr<seasocks::Logger>     m_spLogger;
      bool                                  m_TestThreadStop;
      std::thread                           m_TestThread;
      std::mutex                            m_Lock;
      MapUser                               m_Users;
};

#endif //__CQUIZMODESSIMPLEBUTTONTEST__H__
