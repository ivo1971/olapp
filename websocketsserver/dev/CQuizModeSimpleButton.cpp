#include "CQuizModeSimpleButton.h"
#include "CSimpleButtonInfo.h"
#include "JsonHelpers.h"
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
   , m_SimpleButtonInfo()
{
  //client initialisation
  TeamsChanged(m_Teams);
  UsersChanged(m_Users);

  //start clean
  m_SimpleButtonInfo.Reset();
  SendMessage("simple-button", m_SimpleButtonInfo.ToJson());
}

CQuizModeSimpleButton::~CQuizModeSimpleButton(void) throw()
{
}

void CQuizModeSimpleButton::HandleMessageQuiz(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("simple-push" == mi) {
        HandleMessageQuizPush(id, citJsData);
    } else {
        m_spLogger->warning("CQuizModeSimpleButton [%s][%u] MI [%s] UNHANDLED.", __FUNCTION__, __LINE__, mi.c_str());
    }
}

void CQuizModeSimpleButton::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  citJsData)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("simple-button-event" == mi) {
        //get info from message
        const std::string& event = GetElementString(citJsData, "event");
        m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s] handle event [%s].", __FUNCTION__, __LINE__, mi.c_str(), event.c_str());
        HandleMessageMasterEvent(event, citJsData);
    } else {
        m_spLogger->warning("CQuizModeSimpleButton [%s][%u] MI [%s] UNHANDLED.", __FUNCTION__, __LINE__, mi.c_str());
    }
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
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] ID [%s].", __FUNCTION__, __LINE__, id.c_str());
    CQuizModeBase::ReConnect(id);
    TeamsChanged(m_TeamsNew);        //send current teams
    UsersChanged(m_UsersNew);        //send current users
    SendMessage(id, "simple-button", m_SimpleButtonInfo.ToJson());
}

void CQuizModeSimpleButton::HandleMessageQuizPush(const std::string& id, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] ID [%s].", __FUNCTION__, __LINE__, id.c_str());

    //find the user
    MapUserCIt citUser = m_Users.find(id);
    if(m_Users.end() == citUser) {
        //not found
        m_spLogger->warning("CQuizModeSimpleButton [%s][%u] ID [%s] not found.", __FUNCTION__, __LINE__, id.c_str());
        return;
    }

    //find the team
    MapTeamCIt citTeam = m_Teams.find(citUser->second.TeamGet());
    if(m_Teams.end() == citTeam) {
        //not found
        m_spLogger->warning("CQuizModeSimpleButton [%s][%u] ID [%s] team id [%S] not found.", __FUNCTION__, __LINE__, id.c_str(), citUser->second.TeamGet().c_str());
        return;
    }

    //update status
    m_SimpleButtonInfo.TeamAdd       (citTeam->second.NameGet());
    m_SimpleButtonInfo.TeamMembersAdd(citTeam->second.NameGet(), citUser->second.NameGet());

    //inform clients
    m_spLogger->info("CQuizModeSimpleButton [%s][%u].", __FUNCTION__, __LINE__);
    SendMessage("simple-button", m_SimpleButtonInfo.ToJson());
    UpdateFirstActive();
}

void CQuizModeSimpleButton::HandleMessageMasterEvent(const std::string& event, const nlohmann::json::const_iterator citJsData)
{
    json jsonData    ; 
    bool jsonDataSet = true;

    //take action
    if("reset" == event) {
        jsonData    = m_SimpleButtonInfo.Reset();
    } else if("arm" == event) {
        jsonData    = m_SimpleButtonInfo.Arm();
    } else if("evaluate" == event) {
        //get info
        const std::string& evaluation     = GetElementString(citJsData, "evaluation");
        const std::string& team           = GetElementString(citJsData, "team");
        const bool         evaluationGood = "good" == evaluation;

        //evaluate
        if(evaluationGood) {
          m_SimpleButtonInfo.TeamGood(team);
        } else {
          m_SimpleButtonInfo.TeamDeactivate(team);
        }

        //spread the news
        jsonData    = m_SimpleButtonInfo.ToJson();
        UpdateFirstActive();
    } else {
        m_spLogger->info("CQuizModeSimpleButton [%s][%u] unhandled event [%s].", __FUNCTION__, __LINE__, event.c_str());
        jsonDataSet = false;
    }

    //inform clients
    if(jsonDataSet) {
      m_spLogger->info("CQuizModeSimpleButton [%s][%u].", __FUNCTION__, __LINE__);
      SendMessage("simple-button", jsonData);
    }
}

void CQuizModeSimpleButton::UpdateFirstActive()
{
    //TODO: detect is this is a change or not and thus if this has to be sent or not
    CSimpleButtonTeamInfo info("dummy");
    if(m_SimpleButtonInfo.GetFirstActive(info)) {
      if(!info.IsGood()) { //evaluation no required when team is already 'good'
        json data;
        data["team"] = info.GetName();
        SendMessage("simple-button-evaluate", data);
      }
    }
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
