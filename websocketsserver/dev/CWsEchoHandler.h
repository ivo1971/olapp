#ifndef __CWSECHOHANDLER__H__
#define __CWSECHOHANDLER__H__

#include <memory>

#include "json.hpp"
#include "seasocks/PrintfLogger.h"
#include "seasocks/WebSocket.h"

class CWsEchoHandler: public seasocks::WebSocket::Handler {
 public:
                                    CWsEchoHandler(std::shared_ptr<seasocks::Logger> logger); 
                                    ~CWsEchoHandler(void) throw(); 
 
 public:
  void                              TakeSomeInitiative(void);

 private:
                                    CWsEchoHandler(const CWsEchoHandler& ref);
  CWsEchoHandler&                   operator=(const CWsEchoHandler& ref) const;

 private:
  virtual void                      onConnect   (seasocks::WebSocket* pConnection) override;
  virtual void                      onData      (seasocks::WebSocket* pConnection, const uint8_t* pData, size_t length) override;
  virtual void                      onData      (seasocks::WebSocket* pConnection, const char* pData) override;
  virtual void                      onDisconnect(seasocks::WebSocket* pConnection) override;

 private:
  std::shared_ptr<seasocks::Logger> m_Logger;
  std::set<seasocks::WebSocket*>    m_Connections;
};

#endif //__CWSECHOHANDLER__H__
