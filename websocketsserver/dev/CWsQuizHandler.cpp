#include "CWsQuizHandler.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CWsQuizHandler::CWsQuizHandler(shared_ptr<Logger> logger) 
  : m_Logger(logger)
{
  m_Logger->info("CWsQuizHandler handler constructed.");
}

CWsQuizHandler::~CWsQuizHandler(void) throw()
{
}

void CWsQuizHandler::onConnect(WebSocket* pConnection)
{
  m_Logger->info("CWsQuizHandler onConnect.");
}

void CWsQuizHandler::onData(WebSocket* /* pConnection */, const uint8_t* pData, size_t length)
{
  m_Logger->info("CWsQuizHandler onData binary.");
}

void CWsQuizHandler::onData(WebSocket* /* pConnection */, const char* pData)
{
  m_Logger->info("CWsQuizHandler onData string.");
}

void CWsQuizHandler::onDisconnect(WebSocket* pConnection) 
{
  m_Logger->info("Echo handler onDisconnect.");
}
