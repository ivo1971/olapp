#ifndef __WSQUIZHANDLER__H__
#define __WSQUIZHANDLER__H__

#include <map>
#include <memory>

#include "boost/signals2.hpp"
#include "json.hpp"
#include "seasocks/PrintfLogger.h"
#include "seasocks/WebSocket.h"

class CWsQuizHandler: public seasocks::WebSocket::Handler {
 public:
                                                       CWsQuizHandler(std::shared_ptr<seasocks::Logger> spLogger);
                                                       ~CWsQuizHandler(void) throw();

 public:
  typedef boost::signals2::signal<void(const std::string mi, const nlohmann::json::const_iterator citJsData)> SignalMessage;
  boost::signals2::connection                                                                                 ConnectSignalMessage(const SignalMessage::slot_type& subscriber);


 private:
                                                       CWsQuizHandler(const CWsQuizHandler& ref);
  CWsQuizHandler                                       operator=(const CWsQuizHandler& ref) const;

 private:
  virtual void                                         onConnect        (seasocks::WebSocket* pConnection) override;
  virtual void                                         onDisconnect     (seasocks::WebSocket* pConnection) override;
  virtual void                                         onData           (seasocks::WebSocket* pConnection, const uint8_t* pData, size_t length) override;
  virtual void                                         onData           (seasocks::WebSocket* pConnection, const char* pData) override;

 private:
  std::shared_ptr<seasocks::Logger>                    m_spLogger;
  SignalMessage                                        m_SignalMessage;
};

#endif //#ifndef __WSQUIZHANDLER__H__
