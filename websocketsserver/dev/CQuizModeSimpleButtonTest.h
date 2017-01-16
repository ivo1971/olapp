#ifndef __CQUIZMODESSIMPLEBUTTONTEST__H__
#define __CQUIZMODESSIMPLEBUTTONTEST__H__

#include <mutex>

#include "IQuizMode.h"
#include "CQuizModeBase.h"

class CQuizModeSimpleButtonTest : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeSimpleButtonTest(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapUser& users);
      virtual                               ~CQuizModeSimpleButtonTest(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);

   private:
      void                                  ThreadTest            (void);
      void                                  ThreadTestOne         (const bool good);
      std::string                           ThreadUser2Team       (const std::string& user);
      void                                  ThreadWait            (const time_t waitSec);
      void                                  SendMessage           (                       const std::string& mi, const nlohmann::json::const_iterator citJsData);
      void                                  SendMessage           (                       const std::string& mi, const nlohmann::json&                data     );
      void                                  SendMessage           (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      void                                  SendMessage           (const std::string& id, const std::string& mi, const nlohmann::json&                data     );

   private:
      bool                                  m_TestThreadStop;
      std::thread                           m_TestThread;
      std::mutex                            m_Lock;
      MapUser                               m_Users;
};

#endif //__CQUIZMODESSIMPLEBUTTONTEST__H__
