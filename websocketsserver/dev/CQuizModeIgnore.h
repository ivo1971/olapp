#ifndef __CQUIZMODEIGNORE__H__
#define __CQUIZMODEIGNORE__H__

#include "IQuizMode.h"

class CQuizModeIgnore : public IQuizMode {
   public:
                                            CQuizModeIgnore(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapTeam& teams, const MapUser& users);
      virtual                               ~CQuizModeIgnore(void) throw();

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          TeamsChanged          (const MapTeam& teams);
      virtual void                          UsersChanged          (const MapUser& users);
      virtual void                          ReConnect             (const std::string& id);

   private:
      std::shared_ptr<seasocks::Logger>     m_spLogger;
};

#endif //__CQUIZMODEIGNORE__H__
