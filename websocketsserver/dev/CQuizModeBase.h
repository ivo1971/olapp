#ifndef __CQUIZMODEBASE__H__
#define __CQUIZMODEBASE__H__

#include "json.hpp"
#include "seasocks/PrintfLogger.h"

#include "CWsQuizHandler.h"

class CQuizModeBase {
   public:
                                            CQuizModeBase(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const std::string& mode);
      virtual                               ~CQuizModeBase(void) throw();

   public:
      virtual void                          ReConnect(const std::string& id);

   protected:
      const std::string                     m_Mode;
      std::shared_ptr<seasocks::Logger>     m_spLogger;
      std::shared_ptr<CWsQuizHandler>       m_spWsQuizHandler;
      std::shared_ptr<CWsQuizHandler>       m_spWsMasterHandler;
      std::shared_ptr<CWsQuizHandler>       m_spWsBeamerHandler;
};

#endif //__CQUIZMODEBASE__H__
