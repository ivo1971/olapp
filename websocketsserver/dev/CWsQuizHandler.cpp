#include "CWsQuizHandler.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CWsQuizHandler::CWsQuizHandler(shared_ptr<Logger> spLogger, std::shared_ptr<CTeamManager> spTeamManager) 
  : m_spLogger(spLogger)
  , m_spTeamManager(spTeamManager)
{
  m_spLogger->info("CWsQuizHandler handler constructed.");
}

CWsQuizHandler::~CWsQuizHandler(void) throw()
{
}

void CWsQuizHandler::onConnect(WebSocket* pConnection)
{
  m_spLogger->info("CWsQuizHandler onConnect.");
}

void CWsQuizHandler::onData(WebSocket* /* pConnection */, const uint8_t* pData, size_t length)
{
  m_spLogger->info("CWsQuizHandler onData binary.");
}

void CWsQuizHandler::onData(WebSocket* /* pConnection */, const char* pData)
{
  m_spLogger->info("CWsQuizHandler onData string: [%s].", pData);
  try {
    const json        jsonData = json::parse(pData);
    const std::string mi       = jsonData["mi"].get<string>();
    if(mi.compare("id")) {
      HandleMiId(jsonData["data"]);
    } else {
      m_spLogger->error("CWsQuizHandler onData string unhandled type [%s].", jsonData["mi"].get<string>().c_str());
    }
  } catch(std::exception& ex) {
    m_spLogger->error("CWsQuizHandler onData string exception: %s.", ex.what());
  } catch(...) {
    m_spLogger->error("CWsQuizHandler onData string exception: %s.", "unknown");
  }      
}

void CWsQuizHandler::onDisconnect(WebSocket* pConnection) 
{
  m_spLogger->info("CWsQuizHandler onDisconnect.");
}

void CWsQuizHandler::HandleMiId(const json& jsonData)
{
  m_spLogger->debug("CWsQuizHandler HandleMiId for id [%s] name [%s].", jsonData["id"].get<string>().c_str(), jsonData["user"].get<string>().c_str());
  m_spTeamManager->AddTeamMember(jsonData["id"].get<string>(), CTeamMember(jsonData["user"].get<string>()));
}
