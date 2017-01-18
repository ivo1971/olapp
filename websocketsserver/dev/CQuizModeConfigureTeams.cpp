#include "CQuizModeConfigureTeams.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeConfigureTeams::CQuizModeConfigureTeams(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapTeam& teams, const MapUser& users)
   : IQuizMode(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, teams, users)
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "configure-teams")
   , m_Teams(teams)
{
    TeamsChanged(m_Teams);
    UsersChanged(users);
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

void CQuizModeConfigureTeams::TeamsChanged(const MapTeam& teams)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u].", __FUNCTION__, __LINE__);
    m_Teams = teams;
    m_spWsMasterHandler->SendMessage("team-list", MapTeamToJson(m_Teams));
}

void CQuizModeConfigureTeams::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeConfigureTeams::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id); //route
    TeamsChanged(m_Teams);        //send current teams
}
