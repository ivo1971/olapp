#ifndef __CQUIZMODESSIMPLEBUTTON__H__
#define __CQUIZMODESSIMPLEBUTTON__H__

#include <mutex>

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CSimpleButtonInfo.h"

class CQuizModeSimpleButton : public IQuizMode, public CQuizModeBase {
   public:
                                            CQuizModeSimpleButton(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapTeam& teams, const MapUser& users);
      virtual                               ~CQuizModeSimpleButton(void) throw();

   public:
      virtual void                          HandleMessageQuiz       (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          TeamsChanged            (const MapTeam& teams);
      virtual void                          UsersChanged            (const MapUser& users);
      virtual void                          ReConnect               (const std::string& id);

   private:
      void                                  HandleMessageQuizPush   (const std::string& id, const nlohmann::json::const_iterator citJsData);
      void                                  HandleMessageMasterEvent(const std::string& event, const nlohmann::json::const_iterator citJsData);
      void                                  UpdateFirstActive       (void);
      void                                  SendMessage             (                       const std::string& mi, const nlohmann::json::const_iterator citJsData);
      void                                  SendMessage             (                       const std::string& mi, const nlohmann::json&                data     );
      void                                  SendMessage             (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      void                                  SendMessage             (const std::string& id, const std::string& mi, const nlohmann::json&                data     );

   private:
      MapTeam                               m_Teams;
      MapTeam                               m_TeamsNew;
      MapUser                               m_Users;
      MapUser                               m_UsersNew;
      CSimpleButtonInfo                     m_SimpleButtonInfo;
};

#endif //__CQUIZMODESSIMPLEBUTTON__H__
