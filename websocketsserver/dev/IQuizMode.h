#ifndef __IQUIZMODE__H__
#define __IQUIZMODE__H__

#include "json.hpp"
#include "seasocks/PrintfLogger.h"

#include "CUser.h"
#include "CWsQuizHandler.h"

class IQuizMode {
   public:
                                            IQuizMode(std::shared_ptr<seasocks::Logger> /* spLogger */, std::shared_ptr<CWsQuizHandler> /* spWsQuizHandler */, std::shared_ptr<CWsQuizHandler> /* spWsMasterHandler */, std::shared_ptr<CWsQuizHandler> /* spWsBeamerHandler */, const MapUser& /* users */) {};
      virtual                               ~IQuizMode(void) throw() {};

   public:
      virtual void                          HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData) = 0;
      virtual void                          HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData) = 0;
      virtual void                          HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData) = 0;
      virtual void                          UsersChanged          (const MapUser& users) = 0;
      virtual void                          ReConnect             (const std::string& id) = 0;
};

#endif //__IQUIZMODE__H__
