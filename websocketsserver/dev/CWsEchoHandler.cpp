#include <chrono>

#include "CWsEchoHandler.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CWsEchoHandler::CWsEchoHandler(shared_ptr<Logger> logger) 
  : WebSocket::Handler()
  , m_Logger(logger)
  , m_Connections()
{
  m_Logger->info("CWsEchoHandler constructed.");
}

CWsEchoHandler::~CWsEchoHandler(void) throw()
{
} 

void CWsEchoHandler::onConnect(WebSocket* pConnection)
{
  m_Logger->info("CWsEchoHandler onConnect.");
  m_Connections.insert(pConnection);
}

void CWsEchoHandler::onData(WebSocket* /* pConnection */, const uint8_t* pData, size_t length)
{
  m_Logger->info("CWsEchoHandler onData binary.");
  for(auto pConnection : m_Connections) {
    pConnection->send(pData, length);
  }
}

void CWsEchoHandler::onData(WebSocket* /* pConnection */, const char* pData)
{
  //pConnection->send(data); // text
  m_Logger->info("CWsEchoHandler onData text [%s].", pData);

  auto const jsonData = json::parse(pData);
  m_Logger->info("CWsEchoHandler onData type [%s] - message [%s].", jsonData["type"].get<string>().c_str(), jsonData["message"].get<string>().c_str());

  for(auto pConnection : m_Connections) {
    pConnection->send(pData);
  }
}

void CWsEchoHandler::onDisconnect(WebSocket* pConnection)
{
  m_Logger->info("CWsEchoHandler onDisconnect.");
  m_Connections.erase(pConnection);
}

void CWsEchoHandler::TakeSomeInitiative(void) {
  m_Logger->info("CWsEchoHandler taking some initiative.");

  //compose message
  const chrono::time_point<chrono::system_clock> point = chrono::system_clock::now();
  const json msg = {
    {"type", "  serer"},
    {"message", chrono::system_clock::to_time_t(point)}
  };

  for(auto pConnection : m_Connections) {
    pConnection->send(msg.dump());
  }
}
