#ifndef __CQUIZMODETEAMFIE__H__
#define __CQUIZMODETEAMFIE__H__

#include <mutex>

#include "IQuizMode.h"
#include "CQuizModeBase.h"

class CQuizModeTeamfie : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeTeamfie(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler);
      virtual                               ~CQuizModeTeamfie(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);
};

#endif //__CQUIZMODETEAMFIE__H__
