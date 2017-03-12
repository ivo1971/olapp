#ifndef __CQUIZMODEQUESTIONS__H__
#define __CQUIZMODEQUESTIONS__H__

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CTeamManager.h"

class CQuizModeQuestions : public IQuizMode, public CQuizModeBase {
   public:
                                                     CQuizModeQuestions            (std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users, const std::string& fileName);
      virtual                                        ~CQuizModeQuestions           (void) throw();

   public:
      virtual void                                   HandleMessageQuiz             (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                   HandleMessageMaster           (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                   HandleMessageBeamer           (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                   UsersChanged                  (const MapUser& users);
      virtual void                                   ReConnect                     (const std::string& id);

   private:
      void                                           HandleMessageMasterConfigure  (const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageMasterAction     (const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageMasterEvaluations(const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageMasterSetPoints  (const nlohmann::json::const_iterator citJsData);
      void                                           HandleMessageQuizAnswer       (const std::string& id, const nlohmann::json::const_iterator citJsData);
      void                                           SendAnswersAll                (const bool toMaster = true, const bool toBeamer = true);
      void                                           Save                          (void);
      bool                                           Load                          (void);
      void                                           ReConnectAll                  (void);
      void                                           ReConnectAll                  (std::shared_ptr<CWsQuizHandler> wsQuizHandler);

   private:
      SPTeamManager                                  m_spTeamManager;
      MapUser                                        m_Users;
      std::string                                    m_FileName;
      int                                            m_NbrOfQuestions;
      int                                            m_PointsPerQuestion;
      std::map<std::string,std::vector<std::string>> m_Questions;
      bool                                           m_Answering;
      nlohmann::json                                 m_Evaluations;
};

#endif //__CQUIZMODEQUESTIONS__H__
