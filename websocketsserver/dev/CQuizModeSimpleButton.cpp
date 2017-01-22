#include "CQuizModeSimpleButton.h"
#include "CSimpleButtonInfo.h"
#include "Typedefs.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeSimpleButton::CQuizModeSimpleButton(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapTeam& teams, const MapUser& users)
   : IQuizMode(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, teams, users)
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "simple-button")
   , m_Teams(teams)
   , m_TeamsNew(teams)
   , m_Users(users)
   , m_UsersNew(users)
{
  TeamsChanged(m_Teams);
  UsersChanged(m_Users);
}

CQuizModeSimpleButton::~CQuizModeSimpleButton(void) throw()
{
}

void CQuizModeSimpleButton::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSimpleButton::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSimpleButton::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSimpleButton::TeamsChanged(const MapTeam& teams)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u].", __FUNCTION__, __LINE__);
    m_TeamsNew = teams;
    m_spWsMasterHandler->SendMessage("team-list", MapTeamToJson(m_TeamsNew));
}

void CQuizModeSimpleButton::UsersChanged(const MapUser& users)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u].", __FUNCTION__, __LINE__);
    m_UsersNew = users;
    m_spWsMasterHandler->SendMessage("user-list", MapUserToJson(m_UsersNew));
}

void CQuizModeSimpleButton::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id);
    TeamsChanged(m_TeamsNew);        //send current teams
    UsersChanged(m_UsersNew);        //send current users
}

void CQuizModeSimpleButton::SendMessage(const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
  m_spWsQuizHandler->SendMessage  (mi, citJsData);
  m_spWsMasterHandler->SendMessage(mi, citJsData);
  m_spWsBeamerHandler->SendMessage(mi, citJsData);
}

void CQuizModeSimpleButton::SendMessage(const std::string& mi, const nlohmann::json& data)
{
  m_spWsQuizHandler->SendMessage  (mi, data);
  m_spWsMasterHandler->SendMessage(mi, data);
  m_spWsBeamerHandler->SendMessage(mi, data);
}

void CQuizModeSimpleButton::SendMessage(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
  m_spWsQuizHandler->SendMessage  (id, mi, citJsData);
  m_spWsMasterHandler->SendMessage(id, mi, citJsData);
  m_spWsBeamerHandler->SendMessage(id, mi, citJsData);
}

void CQuizModeSimpleButton::SendMessage(const std::string& id, const std::string& mi, const nlohmann::json& data)
{
  m_spWsQuizHandler->SendMessage  (id, mi, data);
  m_spWsMasterHandler->SendMessage(id, mi, data);
  m_spWsBeamerHandler->SendMessage(id, mi, data);
}
