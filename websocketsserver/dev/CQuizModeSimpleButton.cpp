#include "CLockSmart.h"
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
    , m_Lock()
    , m_TimerThreadStop(false)
    , m_TimerThread([=]{ThreadTimer();})
    , m_STimerInfo()
    , m_Teams(teams)
    , m_TeamsNew(teams)
    , m_Users(users)
    , m_UsersNew(users)
    , m_SimpleButtonInfo()
    , m_Stopped(false)
    , m_CurrentSequence(0)
    , m_Config()
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
    //stop test thread
    {
        CLockSmart lockSmart(&m_Lock);
        m_TimerThreadStop = true;
    }
    m_TimerThread.join();
}

void CQuizModeSimpleButton::HandleMessageQuiz(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    CLockSmart lockSmart(&m_Lock);
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("simple-push" == mi) {
        HandleMessageQuizPush(id, citJsData);
    } else {
        m_spLogger->warning("CQuizModeSimpleButton [%s][%u] MI [%s] UNHANDLED.", __FUNCTION__, __LINE__, mi.c_str());
    }
}

void CQuizModeSimpleButton::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  citJsData)
{
    CLockSmart lockSmart(&m_Lock);
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("simple-button-event" == mi) {
        //get info from message
        const std::string& event = GetElementString(citJsData, "event");
        m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s] handle event [%s].", __FUNCTION__, __LINE__, mi.c_str(), event.c_str());
        HandleMessageMasterEvent(event, citJsData);
    } else if("simple-button-config" == mi) {
        m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s] handle config.", __FUNCTION__, __LINE__, mi.c_str());
        HandleMessageMasterConfig(citJsData);
    } else {
        m_spLogger->warning("CQuizModeSimpleButton [%s][%u] MI [%s] UNHANDLED.", __FUNCTION__, __LINE__, mi.c_str());
    }
}

void CQuizModeSimpleButton::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    CLockSmart lockSmart(&m_Lock);
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSimpleButton::TeamsChanged(const MapTeam& teams)
{
    CLockSmart lockSmart(&m_Lock);
    m_spLogger->info("CQuizModeSimpleButton [%s][%u].", __FUNCTION__, __LINE__);
    m_TeamsNew = teams;
    m_spWsMasterHandler->SendMessage("team-list", MapTeamToJson(m_TeamsNew));
}

void CQuizModeSimpleButton::UsersChanged(const MapUser& users)
{
    CLockSmart lockSmart(&m_Lock);
    m_spLogger->info("CQuizModeSimpleButton [%s][%u].", __FUNCTION__, __LINE__);
    m_UsersNew = users;
    m_spWsMasterHandler->SendMessage("user-list", MapUserToJson(m_UsersNew));
}

void CQuizModeSimpleButton::ReConnect(const std::string& id)
{
    CLockSmart lockSmart(&m_Lock);
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] ID [%s].", __FUNCTION__, __LINE__, id.c_str());
    CQuizModeBase::ReConnect(id);
    TeamsChanged(m_TeamsNew);        //send current teams
    UsersChanged(m_UsersNew);        //send current users
    SendMessage(id, "simple-button", m_SimpleButtonInfo.ToJson());
}

/********************************************************************************************
 **
 ** Private functions:
 ** only called when m_Lock is taken!
 **
 *******************************************************************************************/
void CQuizModeSimpleButton::HandleMessageQuizPush(const std::string& id, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeSimpleButton [%s][%u] ID [%s] [%d].", __FUNCTION__, __LINE__, id.c_str(), m_Stopped);
    if(m_Stopped) {
      return;
    }

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
    {
        const std::string teamName = citTeam->second.NameGet();
        if((m_SimpleButtonInfo.TeamAdd(teamName)) && (0 < m_Config.m_Delay)) {
            //added team is currently the first active team
            m_STimerInfo.insert(CTimerInfo(m_Config.m_Delay * 1000, CQuizModeSimpleButton::ETimerTypePush, m_CurrentSequence, teamName));
        }      
        m_SimpleButtonInfo.TeamMembersAdd(teamName, citUser->second.NameGet());
    }

    //inform clients
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
        m_Stopped   = false;
        m_Teams     = m_TeamsNew;
        m_Users     = m_UsersNew;
        m_STimerInfo.insert(CTimerInfo(2000, CQuizModeSimpleButton::ETimerTypeReset, m_CurrentSequence));
    } else if("arm" == event) {
        jsonData    = m_SimpleButtonInfo.Arm();
        m_Stopped   = false;
    } else if("evaluate" == event) {
        //get info
        const std::string& evaluation     = GetElementString(citJsData, "evaluation");
        const std::string& team           = GetElementString(citJsData, "team");
        const bool         evaluationGood = "good" == evaluation;

        //evaluate
        ++m_CurrentSequence;
        if(evaluationGood) {
          m_SimpleButtonInfo.TeamGood(team);
          m_Stopped = true;
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

void CQuizModeSimpleButton::HandleMessageMasterConfig(const nlohmann::json::const_iterator citJsData)
{
  m_Config.m_Delay           = GetElementInt(citJsData, "configDelay"          );
  m_Config.m_PointsGoodThis  = GetElementInt(citJsData, "configPointsGoodThis" );
  m_Config.m_PointsGoodOther = GetElementInt(citJsData, "configPointsGoodOther");
  m_Config.m_PointsBadThis   = GetElementInt(citJsData, "configPointsBadThis"  );
  m_Config.m_PointsBadOther  = GetElementInt(citJsData, "configPointsBadOther" );
  m_spLogger->info("CQuizModeSimpleButton [%s][%u] [%d][%d][%d][%d][%d].", __FUNCTION__, __LINE__, m_Config.m_Delay, m_Config.m_PointsGoodThis, m_Config.m_PointsGoodOther, m_Config.m_PointsBadThis, m_Config.m_PointsBadOther);
}

bool CQuizModeSimpleButton::UpdateFirstActive(std::string* const pTeamName)
{
    //TODO: detect is this is a change or not and thus if this has to be sent or not
    CSimpleButtonTeamInfo info("dummy");
    if(m_SimpleButtonInfo.GetFirstActive(info)) {
      if(!info.IsGood()) { //evaluation no required when team is already 'good'
        json data;
        data["team"] = info.GetName();
        SendMessage("simple-button-evaluate", data);
        if(NULL != pTeamName) {
          *pTeamName = info.GetName();
        }
        return true;
      }
    } else {
      //there is no 'first active' team
      json data;
      data["team"] = "";
      SendMessage("simple-button-evaluate", data);
    }
    return false;
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

void CQuizModeSimpleButton::ThreadTimer(void) {
  m_spLogger->info("CQuizManager [%s][%u] in.", __FUNCTION__, __LINE__);
  while(!m_TimerThreadStop) {
    usleep(100 * 1000);
    {
      CLockSmart lockSmart(&m_Lock);
      //m_spLogger->debug("CQuizManager [%s][%u] timer check [%d].", __FUNCTION__, __LINE__, m_STimerInfo.size());
      const std::chrono::milliseconds now = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch());
      for(STimerInfoIt it = m_STimerInfo.begin() ; m_STimerInfo.end() != it ; it = m_STimerInfo.begin()) {
        //check expiry
        if(!it->IsExpired(now)) {
          break;
        }

        //check the sequence
        if(it->IsSequence(m_CurrentSequence)) {
          //handle it
          ThreadTimerHandle(it); 
        }

        //remove the expired item from the list
        m_STimerInfo.erase(it);
      }
      if(0 == m_STimerInfo.size()) {
        m_CurrentSequence = 0;
      }
      //m_spLogger->debug("CQuizManager [%s][%u] timer check done.", __FUNCTION__, __LINE__);
    }
  }
  m_spLogger->info("CQuizManager [%s][%u] out.", __FUNCTION__, __LINE__);
}

void CQuizModeSimpleButton::ThreadTimerHandle(const STimerInfoIt& it) 
{
  switch(it->GetType()) {
    case CQuizModeSimpleButton::ETimerTypeReset:
    {
      SendMessage("simple-button", m_SimpleButtonInfo.Arm());
      break;
    }
    case CQuizModeSimpleButton::ETimerTypePush:
    {
      m_spLogger->info("CQuizManager [%s][%u] handle [%s].", __FUNCTION__, __LINE__, it->GetExtra().c_str());
      m_SimpleButtonInfo.TeamDeactivate(it->GetExtra());              
      SendMessage("simple-button", m_SimpleButtonInfo.ToJson());
      std::string firstActiveTeamName;
      const bool firstActiveFound = UpdateFirstActive(&firstActiveTeamName);

      //check if there is again a 'first active' team and
      //restart the timer when this is the case
      if((firstActiveFound) && (0 < m_Config.m_Delay)) {
        m_STimerInfo.insert(CTimerInfo(m_Config.m_Delay * 1000, CQuizModeSimpleButton::ETimerTypePush, m_CurrentSequence, firstActiveTeamName));
      }
      break;
    }
    default:
    {
      m_spLogger->warning("CQuizManager [%s][%u] handle [%d] UNHANDLED.", __FUNCTION__, __LINE__, it->GetType());
      break;
    }
  }
}