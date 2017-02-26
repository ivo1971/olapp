#ifndef __CQUIZMODESORTIMAGES__H__
#define __CQUIZMODESORTIMAGES__H__

#include <mutex>

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CTeamManager.h"

class CQuizModeSortImages : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeSortImages(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager);
      virtual                               ~CQuizModeSortImages(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);

    private:
      SPTeamManager                         m_spTeamManager;
};

#endif //__CQUIZMODESORTIMAGES__H__
