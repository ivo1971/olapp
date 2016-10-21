#include "CWsQuizMasterHandler.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CWsQuizMasterHandler::CWsQuizMasterHandler(shared_ptr<Logger> spLogger, std::shared_ptr<CTeamManager> spTeamManager) 
  : m_spLogger(spLogger)
  , m_spTeamManager(spTeamManager)
  , m_Connections()
  , m_TeamManagerConnection(m_spTeamManager->ConnectTeamMembersChanged(boost::bind(&CWsQuizMasterHandler::TeamMembersChanged, this)))
{
  m_spLogger->info("CWsQuizMasterHandler handler constructed.");
}

CWsQuizMasterHandler::~CWsQuizMasterHandler(void) throw()
{
  m_TeamManagerConnection.disconnect();
}

void CWsQuizMasterHandler::onConnect(WebSocket* pConnection)
{
  m_spLogger->info("CWsQuizMasterHandler onConnect.");
  m_Connections.insert(pConnection);
  try {
    SendSockUsers(pConnection);
  } catch(std::exception& ex) {
    m_spLogger->error("CWsQuizHandler onConnect string exception: %s.", ex.what());
  } catch(...) {
    m_spLogger->error("CWsQuizHandler onConnect string exception: %s.", "unknown");
  }      
}

void CWsQuizMasterHandler::onData(WebSocket* /* pConnection */, const uint8_t* pData, size_t length)
{
  m_spLogger->info("CWsQuizMasterHandler onData binary.");
}

void CWsQuizMasterHandler::onData(WebSocket* pConnection, const char* pData)
{
  m_spLogger->info("CWsQuizMasterHandler onData string.");
  try {
    const json        jsonData = json::parse(pData);
    const std::string mi       = GetElementString(jsonData, "mi");
    if(0 == mi.compare("getUsers")) {
      SendSockUsers(pConnection);
    } else if(0 == mi.compare("route")) {
      ForwardToAllUsers(mi, GetElement(jsonData, "data"));
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
  m_spLogger->info("Echo handler onDisconnect.");
  m_Connections.erase(pConnection);
}

void CWsQuizMasterHandler::SendSockUsers(WebSocket* pConnection) const
{
  m_spLogger->info("CWsQuizMasterHandler SendSockUsers.");
  const MapCTeamMember& mapTeamMember = m_spTeamManager->GetTeamMembers();
  json jsonData;
  jsonData["mi"]   = "users";
  for(MapCTeamMemberCIt cit = mapTeamMember.begin() ; mapTeamMember.end() != cit ; ++cit) {
    m_spLogger->info("CWsQuizMasterHandler SendSockUsers user [%s].", cit->second.GetName().c_str());
    json jsonDataUser = {
      {"name",      cit->second.GetName()                 },
      {"connected", cit->second.GetConnected() ? "1" : "0"}
    };
    jsonData["data"].push_back(jsonDataUser);
  }
  const std::string jsonDataDump = jsonData.dump();
  m_spLogger->info("CWsQuizMasterHandler SendSockUsers [%s].", jsonDataDump.c_str());
  pConnection->send(jsonDataDump);
}

void CWsQuizMasterHandler::ForwardToAllUsers(const std::string mi, const json::const_iterator citJsonData)
{
  m_spTeamManager->ForwardToAllUsers(mi, citJsonData);
}

void CWsQuizMasterHandler::TeamMembersChanged(void) const
{
  m_spLogger->info("CWsQuizMasterHandler TeamMemberAdded.");
  for(auto pConnection : m_Connections) {
    SendSockUsers(pConnection);
  }
}
