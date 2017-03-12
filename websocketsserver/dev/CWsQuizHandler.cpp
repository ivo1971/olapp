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
CWsQuizHandler::CWsQuizHandler(shared_ptr<Logger> spLogger, shared_ptr<Server> spServer, const std::string& name) 
  : m_spLogger(spLogger)
  , m_spServer(spServer)
  , m_Name(name)
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
  //check if this function is called from the thread which is running the server or not
  if(m_ServerThreadId != std::this_thread::get_id()) {
    //not the server thread
    //so schedule a runnable in the server thread to send this message
    //(delay the actual send)
    shared_ptr<RunnableFromServerThread> spRunnableFromServerThread(new RunnableFromServerThread(m_spLogger, m_spSelf, mi, data, id));
    m_spServer->execute(spRunnableFromServerThread);
    return;
  }

  //this is the server thread
  //so send the message
  json jsonData;
  jsonData["mi"]   = mi;
  jsonData["data"] = data;
  const std::string jsonDataDump = jsonData.dump();
  m_spLogger->info("CWsQuizHandler [%s][%u][%s] [%s][%u]: [%s].", __FUNCTION__, __LINE__, m_Name.c_str(), id.c_str(), m_MapSocketId.size(), jsonDataDump.c_str());
  for(auto socketId : m_MapSocketId) {
    if((0 == id.length()) || (socketId.second == id)) {
      socketId.first->send(jsonDataDump);
    }
  }
}

bool CWsQuizHandler::HasId(const std::string& id) const
{
  for(auto socketId : m_MapSocketId) {
    if(socketId.second == id) {
      return true;
    }
  }  
  return false;
}

std::list<std::string> CWsQuizHandler::GetAllIds(void)
{
  std::list<std::string> ids;
  for(auto socketId : m_MapSocketId) {
    ids.push_back(socketId.second);
  }
  return ids;
}

/*****************************************************************************************
 **
 ** Private functions
 **
 *****************************************************************************************/
void CWsQuizHandler::onConnect(WebSocket* /* pConnection */)
{
  m_spLogger->info("CWsQuizHandler [%s][%u][%s].", __FUNCTION__, __LINE__, m_Name.c_str());
}

void CWsQuizHandler::onDisconnect(WebSocket* pConnection) 
{
  m_spLogger->info("CWsQuizHandler [%s][%u][%s].", __FUNCTION__, __LINE__, m_Name.c_str());

  //internal bookkeeping
  MapSocketIdCIt cit = m_MapSocketId.find(pConnection);
  if(m_MapSocketId.end() != cit) {
    m_spLogger->info("CWsQuizHandler [%s][%u][%s] found in map [%s].", __FUNCTION__, __LINE__, m_Name.c_str(), cit->second.c_str());

    //emit disconnect
    m_SignalDisconnect(cit->second.c_str());

    //delete socket from the map
    m_MapSocketId.erase(cit);
  }
}

void CWsQuizHandler::onData(WebSocket* /* pConnection */, const uint8_t* /* pData */, size_t /* length */)
{
  m_spLogger->info("CWsQuizHandler [%s][%u][%s] ignoring binary data.", __FUNCTION__, __LINE__, m_Name.c_str());
}

void CWsQuizHandler::onData(WebSocket* pConnection, const char* pData)
{
  m_spLogger->info("CWsQuizHandler [%s][%u][%s] string.", __FUNCTION__, __LINE__, m_Name.c_str());
  try {
    const json           jsonData = json::parse(pData);
    const std::string    mi       = GetElementString(jsonData, "mi");
    std::string          id       ;

    //special handing for ID message
    if(0 == mi.compare("id")) {
      m_spLogger->info("CWsQuizHandler [%s][%u][%s] string ID.", __FUNCTION__, __LINE__, m_Name.c_str());
      const json::const_iterator citJsonData = GetElement(jsonData, "data");
      id = GetElementString(citJsonData, "id");
      m_MapSocketId.insert(PairSocketId(pConnection, id));
    } else {
      const MapSocketIdCIt cit = m_MapSocketId.find(pConnection);
      if(m_MapSocketId.end() == cit) {
        //ID not found in the map
        m_spLogger->info("CWsQuizHandler [%s][%u][%s] string ID not found", __FUNCTION__, __LINE__, m_Name.c_str());
        return;
      }
      id = cit->second;
    }

    //emit each and every messagge
    m_spLogger->info("CWsQuizHandler [%s][%u][%s] string from [%s] with MI [%s] emit.", __FUNCTION__, __LINE__, m_Name.c_str(), id.c_str(), mi.c_str());
    m_SignalMessage(id, mi, GetElement(jsonData, "data"));
  } catch(std::exception& ex) {
    m_spLogger->info("CWsQuizHandler [%s][%u][%s] string exception: %s.", __FUNCTION__, __LINE__, m_Name.c_str(), ex.what());
  } catch(...) {
    m_spLogger->info("CWsQuizHandler [%s][%u][%s] string exception: %s.", __FUNCTION__, __LINE__, m_Name.c_str(), "unknown");
  } 
}
