#include "CQuizModeWelcome.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeWelcome::CQuizModeWelcome(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapUser& users)
   : IQuizMode(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, users)
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "welcome")
{
}

CQuizModeWelcome::~CQuizModeWelcome(void) throw()
{
}

void CQuizModeWelcome::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeWelcome [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeWelcome::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeWelcome [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeWelcome::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeWelcome [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeWelcome::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeWelcome [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeWelcome::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id);
}
