#include "CQuizModeConfigureTeams.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeConfigureTeams::CQuizModeConfigureTeams(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "configure-teams")
   , m_spTeamManager(spTeamManager)
   , m_Users(users)
{
    SendTeamsToMaster();
    UsersChanged(m_Users);
}

CQuizModeConfigureTeams::~CQuizModeConfigureTeams(void) throw()
{
}

void CQuizModeConfigureTeams::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeConfigureTeams::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    
    if("team-add" == mi) {
      const std::string& teamId   = GetElementString(citJsData, "teamId"  );
      const std::string& teamName = GetElementString(citJsData, "teamName");
      m_spTeamManager->Add(teamId, teamName);
    } else if("team-edit" == mi) {
      const std::string& teamId   = GetElementString(citJsData, "teamId"  );
      const std::string& teamName = GetElementString(citJsData, "teamName");
      m_spTeamManager->Edit(teamId, teamName);
    } else if("team-delete" == mi) {
      const std::string& teamId   = GetElementString(citJsData, "teamId"  );
      m_spTeamManager->Delete(teamId);
    } else {
        m_spLogger->error("CQuizManager [%s][%u] unhandled MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
        return;
    }

    m_spWsMasterHandler->SendMessage("team-list", m_spTeamManager->ToJson());
}

void CQuizModeConfigureTeams::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeConfigureTeams::UsersChanged(const MapUser& users)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u].", __FUNCTION__, __LINE__);
    m_Users = users;
    m_spWsMasterHandler->SendMessage("user-list", MapUserToJson(m_Users));
}

void CQuizModeConfigureTeams::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id); //route
    SendTeamsToMaster();
    UsersChanged(m_Users);        //send current users
}

void CQuizModeConfigureTeams::SendTeamsToMaster(void)
{
    m_spLogger->info("CQuizModeConfigureTeams [%s][%u].", __FUNCTION__, __LINE__);
    m_spWsMasterHandler->SendMessage("team-list", m_spTeamManager->ToJson());
}
