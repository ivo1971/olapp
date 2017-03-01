#ifndef __CQUIZMODESORTIMAGES__H__
#define __CQUIZMODESORTIMAGES__H__

#include <mutex>

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CTeamManager.h"

class CQuizModeSortImages : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeSortImages(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users, const std::string& httpDir, const std::string& httpImagesDir);
      virtual                               ~CQuizModeSortImages(void) throw();

   public:
      virtual void                          HandleMessageQuiz        (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster      (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer      (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged             (const MapUser& users);
      virtual void                          ReConnect                (const std::string& id);

    private:
      void                                  LoadImages               (void);
      void                                  HandleMessageQuizListTeam(const std::string& id, const nlohmann::json::const_iterator citJsData);

    private:
      MapUser                               m_Users;
      SPTeamManager                         m_spTeamManager;
      std::string                           m_HttpDir;
      std::string                           m_HttpImagesDir;
      std::vector<std::string>              m_Images;
      std::map<std::string, nlohmann::json> m_MapTeamImageLists;
};

#endif //__CQUIZMODESORTIMAGES__H__
