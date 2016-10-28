#include "CWsQuizHandler.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CWsQuizHandler::CWsQuizHandler(shared_ptr<Logger> spLogger) 
  : m_spLogger(spLogger)
{
  m_spLogger->info("CWsQuizHandler handler constructed.");
}

CWsQuizHandler::~CWsQuizHandler(void) throw()
{
}

void CWsQuizHandler::onConnect(WebSocket* pConnection)
{
  m_spLogger->info("CWsQuizHandler [%s][%u].", __FUNCTION__, __LINE__);
}

void CWsQuizHandler::onDisconnect(WebSocket* pConnection) 
{
  m_spLogger->info("CWsQuizHandler [%s][%u].", __FUNCTION__, __LINE__);
}

void CWsQuizHandler::onData(WebSocket* /* pConnection */, const uint8_t* pData, size_t length)
{
  m_spLogger->info("CWsQuizHandler [%s][%u] binary.", __FUNCTION__, __LINE__);
}

void CWsQuizHandler::onData(WebSocket* pConnection, const char* pData)
{
  m_spLogger->info("CWsQuizHandler [%s][%u] string.", __FUNCTION__, __LINE__);
  try {
    const json           jsonData = json::parse(pData);
    const std::string    mi       = GetElementString(jsonData, "mi");
    if(0 == mi.compare("id")) {
      m_spLogger->info("CWsQuizHandler [%s][%u] string ID.", __FUNCTION__, __LINE__);
    } else {
      m_spLogger->error("CWsQuizHandler onData string unhandled type [%s].", mi.c_str());
    }
  } catch(std::exception& ex) {
    m_spLogger->info("CWsQuizHandler [%s][%u] string exception: %s.", __FUNCTION__, __LINE__, ex.what());
  } catch(...) {
    m_spLogger->info("CWsQuizHandler [%s][%u] string exception: %s.", __FUNCTION__, __LINE__, "unknown");
  } 
}

