#include "CQuizModeIgnore.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeIgnore::CQuizModeIgnore(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapTeam& teams, const MapUser& users)
   : IQuizMode(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, teams, users)
   , m_spLogger(spLogger)
{
}

CQuizModeIgnore::~CQuizModeIgnore(void) throw()
{
}

void CQuizModeIgnore::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeIgnore [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeIgnore::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeIgnore [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeIgnore::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeIgnore [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeIgnore::TeamsChanged(const MapTeam& /* teams */)
{
    m_spLogger->info("CQuizModeIgnore [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeIgnore::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeIgnore [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeIgnore::ReConnect(const std::string& /* id */)
{
    m_spLogger->info("CQuizModeIgnore [%s][%u].", __FUNCTION__, __LINE__);
}