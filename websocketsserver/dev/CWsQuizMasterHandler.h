#ifndef __WSQUIZMASTERHANDLER__H__
#define __WSQUIZMASTERHANDLER__H__

#include <memory>

#include "boost/signals2.hpp"

#include "json.hpp"
#include "seasocks/PrintfLogger.h"
#include "seasocks/WebSocket.h"

#include "CTeamManager.h"

class CWsQuizMasterHandler: public seasocks::WebSocket::Handler {
 //constuction/destruction
 public:
                                     CWsQuizMasterHandler(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CTeamManager> spTeamManager);
                                     ~CWsQuizMasterHandler(void) throw();

 //constuction/destruction not implemented
 private:
                                     CWsQuizMasterHandler(const CWsQuizMasterHandler& ref);
  CWsQuizMasterHandler               operator=(const CWsQuizMasterHandler& ref) const;

 //websocket handlers
 private:
  virtual void                       onConnect   (seasocks::WebSocket* pConnection) override;
  virtual void                       onData      (seasocks::WebSocket* pConnection, const uint8_t* pData, size_t length) override;
  virtual void                       onData      (seasocks::WebSocket* pConnection, const char* pData) override;
  virtual void                       onDisconnect(seasocks::WebSocket* pConnection) override;

 //message handlers called from onData (depending on the message type)
 private:

 //functions that will broadcast a message to all connections
 private:

 //functions that will send a message to the provided connection
 private:
  void                               SendSockUsers(seasocks::WebSocket* pConnection) const;
  void                               ForwardToAllUsers(const std::string mi, const nlohmann::json::const_iterator citJsData);

  //signal handlers
 private:
  void                               TeamMembersChanged(void) const;

 //members
 private:
  std::shared_ptr<seasocks::Logger>  m_spLogger;
  std::shared_ptr<CTeamManager>      m_spTeamManager;
  std::set<seasocks::WebSocket*>     m_Connections;
  boost::signals2::connection        m_TeamManagerConnection;
};

#endif //#ifndef __WSQUIZMASTERHANDLER__H__
