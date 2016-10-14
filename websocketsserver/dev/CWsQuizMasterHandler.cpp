#include "CWsQuizMasterHandler.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CWsQuizMasterHandler::CWsQuizMasterHandler(shared_ptr<Logger> spLogger, std::shared_ptr<CTeamManager> spTeamManager) 
  : m_spLogger(spLogger)
  , m_spTeamManager(spTeamManager)
{
  m_spLogger->debug("CWsQuizMasterHandler handler constructed.");
}

CWsQuizMasterHandler::~CWsQuizMasterHandler(void) throw()
{
}

void CWsQuizMasterHandler::onConnect(WebSocket* pConnection)
{
  m_spLogger->debug("CWsQuizMasterHandler onConnect.");
  try {
    HandleMiGetUsers(pConnection);
  } catch(std::exception& ex) {
    m_spLogger->error("CWsQuizHandler onConnect string exception: %s.", ex.what());
  } catch(...) {
    m_spLogger->error("CWsQuizHandler onConnect string exception: %s.", "unknown");
  }      
}

void CWsQuizMasterHandler::onData(WebSocket* /* pConnection */, const uint8_t* pData, size_t length)
{
  m_spLogger->debug("CWsQuizMasterHandler onData binary.");
}

void CWsQuizMasterHandler::onData(WebSocket* pConnection, const char* pData)
{
  m_spLogger->debug("CWsQuizMasterHandler onData string.");
  try {
    const json        jsonData = json::parse(pData);
    const std::string mi       = GetElementString(jsonData, "mi");
    if(0 == mi.compare("getUsers")) {
      HandleMiGetUsers(pConnection);
    } else {
      m_spLogger->error("CWsQuizMasterHandler onData string unhandled type [%s].", mi.c_str());
    }
  } catch(std::exception& ex) {
    m_spLogger->error("CWsQuizHandler onData string exception: %s.", ex.what());
  } catch(...) {
    m_spLogger->error("CWsQuizHandler onData string exception: %s.", "unknown");
  }      
}

void CWsQuizMasterHandler::onDisconnect(WebSocket* pConnection) 
{
  m_spLogger->debug("Echo handler onDisconnect.");
}

void CWsQuizMasterHandler::HandleMiGetUsers(WebSocket* pConnection) const
{
  m_spLogger->info("CWsQuizMasterHandler HandleMiGetUsers.");
  const MapCTeamMember& mapTeamMember = m_spTeamManager->GetTeamMembers();
  json jsonData;
  jsonData["mi"]   = "users";
  for(MapCTeamMemberCIt cit = mapTeamMember.begin() ; mapTeamMember.end() != cit ; ++cit) {
    m_spLogger->info("CWsQuizMasterHandler HandleMiGetUsers user [%s].", cit->second.GetName().c_str());
    json jsonDataUser = {
      {"name", cit->second.GetName()}
    };
    jsonData["data"].push_back(jsonDataUser);
  }
  m_spLogger->info("CWsQuizMasterHandler HandleMiGetUsers [%s].", jsonData.dump().c_str());
  pConnection->send(jsonData.dump());
}
