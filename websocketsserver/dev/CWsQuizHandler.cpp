#include "CWsQuizHandler.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CWsQuizHandler::CWsQuizHandler(shared_ptr<Logger> spLogger, std::shared_ptr<CTeamManager> spTeamManager) 
  : m_spLogger(spLogger)
  , m_spTeamManager(spTeamManager)
  , m_spModeBase()
  , m_MapSocketId()
  , m_TeamManagerConnectionForwardToAllUsers(m_spTeamManager->ConnectForwardToAllUsers(boost::bind(&CWsQuizHandler::ForwardToAllUsers, this, _1, _2)))
{
  m_spLogger->info("CWsQuizHandler handler constructed.");
}

CWsQuizHandler::~CWsQuizHandler(void) throw()
{
  m_TeamManagerConnectionForwardToAllUsers.disconnect();
}

void CWsQuizHandler::SetModeHandler(std::shared_ptr<CModeBase> spModeBase)
{
  m_spModeBase = spModeBase;
}

void CWsQuizHandler::onConnect(WebSocket* pConnection)
{
  m_spLogger->info("CWsQuizHandler onConnect.");
}

void CWsQuizHandler::onDisconnect(WebSocket* pConnection) 
{
  m_spLogger->info("CWsQuizHandler onDisconnect.");

  //internal bookkeeping
  MapSocketIdCIt cit = m_MapSocketId.find(pConnection);
  if(m_MapSocketId.end() != cit) {
    m_spLogger->info("CWsQuizHandler onDisconnect found in map [%s].", cit->second.c_str());

    //inform team manager of this user's connection status change
    m_spTeamManager->TeamMemberDisconnected(cit->second);

    //delete socket from the map
    m_MapSocketId.erase(cit);
  }
}

void CWsQuizHandler::onData(WebSocket* /* pConnection */, const uint8_t* pData, size_t length)
{
  m_spLogger->info("CWsQuizHandler onData binary.");
}

void CWsQuizHandler::onData(WebSocket* pConnection, const char* pData)
{
  m_spLogger->info("CWsQuizHandler onData string: [%s].", pData);
  try {
    const json           jsonData = json::parse(pData);
    const std::string    mi       = GetElementString(jsonData, "mi");
    if(0 == mi.compare("id")) {
      m_spLogger->info("CWsQuizHandler onData call HandleMiId.");
      HandleMiId(pConnection, GetElement(jsonData, "data"));
    } else if(0 == mi.compare("mode")) {
      m_spLogger->info("CWsQuizHandler onData call HandleMiMode.");
      HandleMiMode(pConnection, GetElement(jsonData, "data"));
    } else if(m_spModeBase) {
      m_spModeBase->OnData(mi, GetElement(jsonData, "data"));
    } else {
      m_spLogger->error("CWsQuizHandler onData string unhandled type [%s].", mi.c_str());
    }
  } catch(std::exception& ex) {
    m_spLogger->error("CWsQuizHandler onData string exception: %s.", ex.what());
  } catch(...) {
    m_spLogger->error("CWsQuizHandler onData string exception: %s.", "unknown");
  } 
}

void CWsQuizHandler::HandleMiId(WebSocket* pConnection, const json::const_iterator citJsonData)
{
  //get info
  const std::string id   = GetElementString(citJsonData, "id"  );
  const std::string name = GetElementString(citJsonData, "name");

  //update team manager
  m_spLogger->info("CWsQuizHandler HandleMiId in for id [%s] name [%s].", id.c_str(), name.c_str());
  m_spTeamManager->TeamMemberAdd(id, CTeamMember(name));
  m_spLogger->info("CWsQuizHandler HandleMiId out for id [%s] name [%s].", id.c_str(), name.c_str());

  //internal bookkeeping
  m_MapSocketId.insert(PairSocketId(pConnection, id));
}

void CWsQuizHandler::HandleMiMode(WebSocket* pConnection, const json::const_iterator citJsonData)
{
  //get socket
  MapSocketIdCIt cit = m_MapSocketId.find(pConnection);
  if(m_MapSocketId.end() == cit) {
    return;
  }
  const std::string& id = cit->second.c_str();

  //get info
  const std::string mode = GetElementString(citJsonData, "mode");

  //update team manager
  m_spLogger->info("CWsQuizHandler HandleMiId in for id [%s] mode [%s].", id.c_str(), mode.c_str());
  m_spTeamManager->SetMode(id, mode);
  m_spLogger->info("CWsQuizHandler HandleMiId out for id [%s] mode [%s].", id.c_str(), mode.c_str());
}

void CWsQuizHandler::ForwardToAllUsers(const std::string mi, const json::const_iterator citJsData)
{
  json jsonData;
  jsonData["mi"]   = mi;
  jsonData["data"] = *citJsData;
  const std::string jsonDataDump = jsonData.dump();
  m_spLogger->info("CWsQuizHandler ForwardToAllUsers [%u]: [%s].", m_MapSocketId.size(), jsonDataDump.c_str());
  for(auto socketId : m_MapSocketId) {
    socketId.first->send(jsonDataDump);
  }
}
