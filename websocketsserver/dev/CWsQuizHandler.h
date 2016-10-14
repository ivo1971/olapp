#ifndef __WSQUIZHANDLER__H__
#define __WSQUIZHANDLER__H__

#include <map>
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
  CWsQuizHandler                                       operator=(const CWsQuizHandler& ref) const;

 private:
  typedef std::pair<seasocks::WebSocket*, std::string> PairSocketId;
  typedef std::map <seasocks::WebSocket*, std::string> MapSocketId;
  typedef MapSocketId::iterator                        MapSocketIdIt;
  typedef MapSocketId::const_iterator                  MapSocketIdCIt;

 private:
  virtual void                                         onConnect   (seasocks::WebSocket* pConnection) override;
  virtual void                                         onDisconnect(seasocks::WebSocket* pConnection) override;
  virtual void                                         onData      (seasocks::WebSocket* pConnection, const uint8_t* pData, size_t length) override;
  virtual void                                         onData      (seasocks::WebSocket* pConnection, const char* pData) override;

 private:
  void                                                 HandleMiId  (seasocks::WebSocket* pConnection, const nlohmann::json::const_iterator citJsonData);

 private:
  std::shared_ptr<seasocks::Logger>                    m_spLogger;
  std::shared_ptr<CTeamManager>                        m_spTeamManager;
  MapSocketId                                          m_MapSocketIt;
};

#endif //#ifndef __WSQUIZHANDLER__H__
