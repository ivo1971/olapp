#ifndef __WSQUIZHANDLER__H__
#define __WSQUIZHANDLER__H__

#include <memory>

#include "json.hpp"
#include "seasocks/PrintfLogger.h"
#include "seasocks/WebSocket.h"

#include "CTeamManager.h"

class CWsQuizHandler: public seasocks::WebSocket::Handler {
 public:
                                     CWsQuizHandler(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CTeamManager> spTeamManager);
                                     ~CWsQuizHandler(void) throw();

 private:
                                     CWsQuizHandler(const CWsQuizHandler& ref);
  CWsQuizHandler                     operator=(const CWsQuizHandler& ref) const;

 private:
  virtual void                       onConnect   (seasocks::WebSocket* pConnection) override;
  virtual void                       onData      (seasocks::WebSocket* pConnection, const uint8_t* pData, size_t length) override;
  virtual void                       onData      (seasocks::WebSocket* pConnection, const char* pData) override;
  virtual void                       onDisconnect(seasocks::WebSocket* pConnection) override;

 private:
  void                               HandleMiId(const nlohmann::json::const_iterator citJsonData);

 private:
  std::shared_ptr<seasocks::Logger>  m_spLogger;
  std::shared_ptr<CTeamManager>      m_spTeamManager;
};

#endif //#ifndef __WSQUIZHANDLER__H__
