#include "CQuizModeConfigureTeams.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeConfigureTeams::CQuizModeConfigureTeams(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapUser& users)
   : IQuizMode(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, users)
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "configure-teams")
{
}

CQuizModeConfigureTeams::~CQuizModeConfigureTeams(void) throw()
{
}

void CQuizModeConfigureTeams::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeConfigureTeams::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeConfigureTeams::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeConfigureTeams::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeConfigureTeams::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id);
}
