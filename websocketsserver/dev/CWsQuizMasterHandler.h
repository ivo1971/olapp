#ifndef __WSQUIZMASTERHANDLER__H__
#define __WSQUIZMASTERHANDLER__H__

#include <memory>

#include "json.hpp"
#include "seasocks/PrintfLogger.h"
#include "seasocks/WebSocket.h"

#include "CTeamManager.h"

class CWsQuizMasterHandler: public seasocks::WebSocket::Handler {
 public:
                                     CWsQuizMasterHandler(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CTeamManager> spTeamManager);
                                     ~CWsQuizMasterHandler(void) throw();

 private:
                                     CWsQuizMasterHandler(const CWsQuizMasterHandler& ref);
  CWsQuizMasterHandler               operator=(const CWsQuizMasterHandler& ref) const;

 private:
  virtual void                       onConnect   (seasocks::WebSocket* pConnection) override;
  virtual void                       onData      (seasocks::WebSocket* pConnection, const uint8_t* pData, size_t length) override;
  virtual void                       onData      (seasocks::WebSocket* pConnection, const char* pData) override;
  virtual void                       onDisconnect(seasocks::WebSocket* pConnection) override;

 private:
  void                               HandleMiGetUsers(seasocks::WebSocket* pConnection) const;

 private:
  std::shared_ptr<seasocks::Logger>  m_spLogger;
  std::shared_ptr<CTeamManager>      m_spTeamManager;
};

#endif //#ifndef __WSQUIZMASTERHANDLER__H__
