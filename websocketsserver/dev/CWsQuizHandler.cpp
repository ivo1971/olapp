#include "seasocks/Server.h"

#include "CWsQuizHandler.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

/*****************************************************************************************
 **
 ** Anonymous class to send message from another thread then the server thread.
 **
 *****************************************************************************************/
namespace {
  class RunnableFromServerThread : public Server::Runnable {
  public:
    RunnableFromServerThread(shared_ptr<Logger> spLogger, shared_ptr<CWsQuizHandler> spWsQuizHandler, const std::string& mi, const json& data, const std::string& id)
      : m_spLogger(spLogger)
      , m_spWsQuizHandler(spWsQuizHandler)
      , m_Mi(mi)
      , m_Data(data)
      , m_Id(id)
    {
    }
    
    virtual ~RunnableFromServerThread() 
    {
    }
    
    void run()
    {
      m_spLogger->info("RunnableFromServerThread [%s][%u].", __FUNCTION__, __LINE__);
      m_spWsQuizHandler->SendMessage(m_Id, m_Mi, m_Data);
    }
    
  private:
    shared_ptr<Logger>         m_spLogger;
    shared_ptr<CWsQuizHandler> m_spWsQuizHandler;
    const std::string          m_Mi;
    const json                 m_Data;
    const std::string          m_Id;
  };
};

/*****************************************************************************************
 **
 ** Construction/Destruction
 **
 *****************************************************************************************/
CWsQuizHandler::CWsQuizHandler(shared_ptr<Logger> spLogger, shared_ptr<Server> spServer) 
  : m_spLogger(spLogger)
  , m_spServer(spServer)
  , m_SignalMessage()
  , m_SignalDisconnect()
  , m_MapSocketId()
  , m_ServerThreadId(std::this_thread::get_id())
  , m_spSelf()
{
  if(!m_spServer) {
    throw runtime_error("CWsQuizHandler with NULL server");
  }
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
void CWsQuizHandler::SpSelfSet(std::shared_ptr<CWsQuizHandler> self)
{
  m_spSelf = self;
}

void CWsQuizHandler::SpSelfClear(void)
{
  m_spSelf = shared_ptr<CWsQuizHandler>(NULL);
}

void CWsQuizHandler::SendMessage(const std::string& mi, const json::const_iterator citJsData)
{
  SendMessage(std::string(), mi, *citJsData);
}

void CWsQuizHandler::SendMessage(const std::string& mi, const json& data)
{
  SendMessage(std::string(), mi, data);
}

void CWsQuizHandler::SendMessage(const std::string& id, const std::string& mi, const json::const_iterator citJsData)
{
  SendMessage(id, mi, *citJsData);
}

void CWsQuizHandler::SendMessage(const std::string& id, const std::string& mi, const json& data)
{
  if(m_ServerThreadId != std::this_thread::get_id()) {
    shared_ptr<RunnableFromServerThread> spRunnableFromServerThread(new RunnableFromServerThread(m_spLogger, m_spSelf, mi, data, id));
    m_spServer->execute(spRunnableFromServerThread);
    return;
  }

  json jsonData;
  jsonData["mi"]   = mi;
  jsonData["data"] = data;
  const std::string jsonDataDump = jsonData.dump();
  m_spLogger->info("CWsQuizHandler [%s][%u] [%s][%u]: [%s].", __FUNCTION__, __LINE__, id.c_str(), m_MapSocketId.size(), jsonDataDump.c_str());
  for(auto socketId : m_MapSocketId) {
    if((0 == id.length()) || (socketId.second == id)) {
      socketId.first->send(jsonDataDump);
    }
  }
}

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
    std::string          id       ;

    //special handing for ID message
    if(0 == mi.compare("id")) {
      m_spLogger->info("CWsQuizHandler [%s][%u] string ID.", __FUNCTION__, __LINE__);
      const json::const_iterator citJsonData = GetElement(jsonData, "data");
      id = GetElementString(citJsonData, "id");
      m_MapSocketId.insert(PairSocketId(pConnection, id));
    } else {
      const MapSocketIdCIt cit = m_MapSocketId.find(pConnection);
      if(m_MapSocketId.end() == cit) {
	//ID not found in the map
	m_spLogger->info("CWsQuizHandler [%s][%u] string ID not found", __FUNCTION__, __LINE__);
	return;
      }
      id = cit->second;
    }

    //emit each and every messagge
    m_spLogger->info("CWsQuizHandler [%s][%u] string from [%s] with MI [%s] emit.", __FUNCTION__, __LINE__, id.c_str(), mi.c_str());
    m_SignalMessage(id, mi, GetElement(jsonData, "data"));
  } catch(std::exception& ex) {
    m_spLogger->info("CWsQuizHandler [%s][%u] string exception: %s.", __FUNCTION__, __LINE__, ex.what());
  } catch(...) {
    m_spLogger->info("CWsQuizHandler [%s][%u] string exception: %s.", __FUNCTION__, __LINE__, "unknown");
  } 
}

