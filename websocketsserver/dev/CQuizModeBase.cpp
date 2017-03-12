#include "CQuizModeBase.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeBase::CQuizModeBase(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const std::string& mode)
    : m_Mode(mode)
    , m_spLogger(spLogger)
    , m_spWsQuizHandler(spWsQuizHandler)
    , m_spWsMasterHandler(spWsMasterHandler)
    , m_spWsBeamerHandler(spWsBeamerHandler)
{
    m_spLogger->info("CQuizModeBase constructed for mode [%s].", m_Mode.c_str());
    json data;
    data["to"] = m_Mode;
    m_spWsQuizHandler->SendMessage  ("route", data);
    m_spWsMasterHandler->SendMessage("route", data);
    m_spWsBeamerHandler->SendMessage("route", data);      
}

CQuizModeBase::~CQuizModeBase(void) throw()
{
    m_spLogger->info("CQuizModeBase destructed for mode [%s].", m_Mode.c_str());
}

void CQuizModeBase::ReConnect(const std::string& id)
{
    m_spLogger->info("CQuizModeBase reconnect for mode [%s] id [%s].", m_Mode.c_str(), id.c_str());
    json data;
    data["to"] = m_Mode;
    m_spWsQuizHandler->SendMessage  (id, "route", data);
    m_spWsMasterHandler->SendMessage(id, "route", data);
    m_spWsBeamerHandler->SendMessage(id, "route", data);          
}

void CQuizModeBase::ReConnectAll(void)
{
    m_spLogger->info("CQuizModeBase [%s][%u].", __FUNCTION__, __LINE__);
    ReConnectAll(m_spWsMasterHandler);
    ReConnectAll(m_spWsBeamerHandler);
    ReConnectAll(m_spWsQuizHandler);
}

void CQuizModeBase::ReConnectAll(std::shared_ptr<CWsQuizHandler> wsQuizHandler)
{
    m_spLogger->info("CQuizModeBase [%s][%u] for [%s].", __FUNCTION__, __LINE__, wsQuizHandler->GetName().c_str());
    const std::list<std::string> ids = wsQuizHandler->GetAllIds();
    for(const auto id : ids) {
        ReConnect(id);
    }    
}

