#include "CWsQuizHandler.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

/*****************************************************************************************
 **
 ** Construction/Destruction
 **
 *****************************************************************************************/
CWsQuizHandler::CWsQuizHandler(shared_ptr<Logger> spLogger) 
  : m_spLogger(spLogger)
  , m_SignalMessage()
  , m_SignalDisconnect()
  , m_MapSocketId()
{
  m_spLogger->info("CWsQuizHandler handler constructed.");
}

CWsQuizHandler::~CWsQuizHandler(void) throw()
{
}

/*****************************************************************************************
 **
 ** Public signal conenctions
 **
 *****************************************************************************************/
boost::signals2::connection CWsQuizHandler::ConnectSignalMessage(const SignalMessage::slot_type& subscriber)
{
  return m_SignalMessage.connect(subscriber);
}

boost::signals2::connection CWsQuizHandler::ConnectSignalDisconnect(const SignalDisconnect::slot_type& subscriber)
{
  return m_SignalDisconnect.connect(subscriber);
}

/*****************************************************************************************
 **
 ** Public functions
 **
 *****************************************************************************************/

/*****************************************************************************************
 **
 ** Private functions
 **
 *****************************************************************************************/
void CWsQuizHandler::onConnect(WebSocket* pConnection)
{
  m_spLogger->info("CWsQuizHandler [%s][%u].", __FUNCTION__, __LINE__);
}

void CWsQuizHandler::onDisconnect(WebSocket* pConnection) 
{
  m_spLogger->info("CWsQuizHandler [%s][%u].", __FUNCTION__, __LINE__);

  //internal bookkeeping
  MapSocketIdCIt cit = m_MapSocketId.find(pConnection);
  if(m_MapSocketId.end() != cit) {
    m_spLogger->info("CWsQuizHandler [%s][%u] found in map [%s].", __FUNCTION__, __LINE__, cit->second.c_str());

    //emit disconnect
    m_SignalDisconnect(cit->second.c_str());

    //delete socket from the map
    m_MapSocketId.erase(cit);
  }
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

    //special handing for ID message
    if(0 == mi.compare("id")) {
      m_spLogger->info("CWsQuizHandler [%s][%u] string ID.", __FUNCTION__, __LINE__);
      const json::const_iterator citJsonData = GetElement(jsonData, "data");
      m_MapSocketId.insert(PairSocketId(pConnection, GetElementString(citJsonData, "id")));
    }

    //emit each and every messagge
    m_spLogger->info("CWsQuizHandler [%s][%u] string [%s] emit.", __FUNCTION__, __LINE__, mi.c_str());
    m_SignalMessage(mi, GetElement(jsonData, "data"));
  } catch(std::exception& ex) {
    m_spLogger->info("CWsQuizHandler [%s][%u] string exception: %s.", __FUNCTION__, __LINE__, ex.what());
  } catch(...) {
    m_spLogger->info("CWsQuizHandler [%s][%u] string exception: %s.", __FUNCTION__, __LINE__, "unknown");
  } 
}

