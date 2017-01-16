#ifndef __CQUIZMODEWELCOME__H__
#define __CQUIZMODEWELCOME__H__

#include <mutex>

#include "IQuizMode.h"
#include "CQuizModeBase.h"

class CQuizModeWelcome : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeWelcome(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapUser& users);
      virtual                               ~CQuizModeWelcome(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);
};

#endif //__CQUIZMODEWELCOME__H__
