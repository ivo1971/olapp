#ifndef __CQUIZMODETEST__H__
#define __CQUIZMODETEST__H__

#include <mutex>

#include "IQuizMode.h"
#include "CQuizModeBase.h"

class CQuizModeTest : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeTest(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapUser& users);
      virtual                               ~CQuizModeTest(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);
};

#endif //__CQUIZMODESSIMPLEBUTTONTEST__H__
