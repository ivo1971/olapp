#ifndef __CQUIZMODETEAMFIE__H__
#define __CQUIZMODETEAMFIE__H__

#include <mutex>

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CTeamManager.h"

class CQuizModeTeamfie : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeTeamfie(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users, const std::string& teamfieDir);
      virtual                               ~CQuizModeTeamfie(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);

   public:
      static void                           SendImage(std::shared_ptr<CWsQuizHandler> spWsQuizHandler, const std::string& teamfieDir, const std::string& teamId);
      static void                           SendAllImages(std::shared_ptr<CWsQuizHandler> spWsQuizHandler, const std::string& teamfieDir, const SPTeamManager spTeamManager);

   private:
      void                                  HandleMessageQuizTeamfie(const std::string& id, const nlohmann::json::const_iterator citJsData);
      static std::string                    GetFileName(const std::string& teamfieDir, const std::string& teamId);

   private:
      SPTeamManager                         m_spTeamManager;
      MapUser                               m_Users;
      std::string                           m_TeamfieDir;
};

#endif //__CQUIZMODETEAMFIE__H__
