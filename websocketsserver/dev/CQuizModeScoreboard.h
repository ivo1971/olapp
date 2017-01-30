#ifndef __CQUIZMODESCOREBOARD__H__
#define __CQUIZMODESCOREBOARD__H__

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CTeamManager.h"

class CQuizModeScoreboard : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeScoreboard(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager);
      virtual                               ~CQuizModeScoreboard(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);

   private:
      SPTeamManager                         m_spTeamManager;
};

#endif //__CQUIZMODESCOREBOARD__H__
