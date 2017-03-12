#ifndef __CQUIZMODEQUESTIONS__H__
#define __CQUIZMODEQUESTIONS__H__

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CTeamManager.h"

class CQuizModeQuestions : public IQuizMode, public CQuizModeBase {
   public:
                                                     CQuizModeQuestions              (std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users, const std::string& httpDir, const std::string& httpImagesDir, const std::string& fileName);
      virtual                                        ~CQuizModeQuestions             (void) throw();

   public:
      virtual void                                   HandleMessageQuiz               (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                   HandleMessageMaster             (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                   HandleMessageBeamer             (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                   UsersChanged                    (const MapUser& users);
      virtual void                                   ReConnect                       (const std::string& id);

   private:
      void                                           HandleMessageMasterConfigure    (const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageMasterAction       (const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageMasterEvaluations  (const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageMasterSetPoints    (const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageMasterImageOnBeamer(const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageQuizAnswer         (const std::string& id, const nlohmann::json::const_iterator citJsData);
      void                                           SendAnswersAll                  (const bool toMaster = true, const bool toBeamer = true);
      void                                           Save                            (void);
      bool                                           Load                            (void);
      nlohmann::json                                 LoadImages                      (void) const;
      nlohmann::json                                 LoadImagesDir                   (const std::string& dirAbs, const std::string& dirRel, const std::string dirName) const;

   private:
      SPTeamManager                                  m_spTeamManager;
      MapUser                                        m_Users;
      const std::string                              m_HttpDir;
      const std::string                              m_HttpImagesDir;
      const std::string                              m_FileName;
      int                                            m_NbrOfQuestions;
      int                                            m_PointsPerQuestion;
      std::map<std::string,std::vector<std::string>> m_Questions;
      bool                                           m_Answering;
      nlohmann::json                                 m_Evaluations;
      const nlohmann::json                           m_ImagesAvailable;
      nlohmann::json                                 m_ImageOnBeamer;
};

#endif //__CQUIZMODEQUESTIONS__H__
