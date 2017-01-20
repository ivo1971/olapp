#ifndef __CQUIZMODECONFIGURETEAMS__H__
#define __CQUIZMODECONFIGURETEAMS__H__

#include "IQuizMode.h"
#include "CQuizModeBase.h"

class CQuizModeConfigureTeams : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeConfigureTeams(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapTeam& teams, const MapUser& users);
      virtual                               ~CQuizModeConfigureTeams(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          TeamsChanged          (const MapTeam& teams);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);

   private:
      MapTeam                               m_Teams;
      MapUser                               m_Users;
};

#endif //__CQUIZMODECONFIGURETEAMS__H__
