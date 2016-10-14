#include "CWsQuizHandler.h"
#include "JsonHelpers.h"

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
    const json           jsonData = json::parse(pData);
    const std::string    mi       = GetElementString(jsonData, "mi");
    if(0 == mi.compare("id")) {
      m_spLogger->info("CWsQuizHandler onData call HandleMiId.");
      HandleMiId(GetElement(jsonData, "data"));
    } else {
      m_spLogger->error("CWsQuizHandler onData string unhandled type [%s].", mi.c_str());
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

void CWsQuizHandler::HandleMiId(const json::const_iterator citJsonData)
{
  const std::string id   = GetElementString(citJsonData, "id"  );
  const std::string name = GetElementString(citJsonData, "name");
  m_spLogger->info("CWsQuizHandler HandleMiId in for id [%s] name [%s].", id.c_str(), name.c_str());
  m_spTeamManager->AddTeamMember(id, CTeamMember(name));
  m_spLogger->info("CWsQuizHandler HandleMiId out for id [%s] name [%s].", id.c_str(), name.c_str());
}
