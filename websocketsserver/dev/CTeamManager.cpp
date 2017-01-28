#include "CTeamManager.h"
#include "JsonHelpers.h"

using namespace nlohmann;

CTeamManager::CTeamManager(std::shared_ptr<seasocks::Logger> spLogger, FuncDirty funcDirty)
    : m_Teams()
    , m_spLogger(spLogger)
    , m_FuncDirty(funcDirty)
{
}

CTeamManager::CTeamManager(std::shared_ptr<seasocks::Logger> spLogger, FuncDirty funcDirty, const nlohmann::json& jsonData)
    : m_Teams()
    , m_spLogger(spLogger)
    , m_FuncDirty(funcDirty)
{
  try {
    const json::const_iterator citTeamsInner  = GetElement(jsonData, "teams");
    const json                 jsonTeamsInner (*citTeamsInner); //contains an array of teams
    for(json::const_iterator citTeam = jsonTeamsInner.begin() ; jsonTeamsInner.end() != citTeam ; ++citTeam) {
      m_spLogger->info("CQuizManager [%s][%u] test [%s].", __FUNCTION__, __LINE__, citTeam->dump().c_str());
      CTeam tmpTeam(*citTeam);
      m_Teams.insert(PairTeam(tmpTeam.IdGet(), tmpTeam));
    }
  } catch(std::exception& ex) {
      m_spLogger->info("CTeamManager [%s][%u] constructing teams from json data failed: %s.", __FUNCTION__, __LINE__, ex.what());
  }
}

CTeamManager::CTeamManager(const CTeamManager& ref)
    : m_Teams(ref.m_Teams)
    , m_spLogger(ref.m_spLogger)
    , m_FuncDirty(ref.m_FuncDirty)
{
}

CTeamManager::~CTeamManager(void) throw()
{
}

CTeamManager& CTeamManager::operator=(const CTeamManager& ref)
{
    if(this == &ref) return *this;
    m_Teams     = ref.m_Teams;
    m_spLogger  = ref.m_spLogger;
    return *this;
}

nlohmann::json CTeamManager::ToJson(void) const
{
  json data;
  for(auto it = m_Teams.begin() ; m_Teams.end() != it ; ++it) {
      data["teams"].push_back(it->second.ToJson());    
  }
  return data;
}

bool CTeamManager::FindTeamName(const std::string& teamId, std::string& teamName)
{
    MapTeamCIt citTeam = m_Teams.find(teamId);
    if(m_Teams.end() == citTeam) {
        return false;
    }
    teamName = citTeam->second.NameGet();
    return true;
}

void CTeamManager::Add(const std::string& id, const std::string& name)
{
    //new or existing team?
    MapTeamIt teamIt = m_Teams.find(id);
    if(m_Teams.end() != teamIt) {
        //existing --> error
        m_spLogger->error("CTeamManager [%s][%u] team with ID [%s] already exists.", __FUNCTION__, __LINE__, id.c_str());
        return;
    }
    //new --> add it
    m_Teams.insert(PairTeam(id, CTeam(id, name)));
    m_FuncDirty();
}

void CTeamManager::Edit(const std::string& id, const std::string& name)
{
    //new or existing team?
    MapTeamIt teamIt = m_Teams.find(id);
    if(m_Teams.end() == teamIt) {
        //new --> error
        m_spLogger->error("CTeamManager [%s][%u] team with ID [%s] does not yet exists.", __FUNCTION__, __LINE__, id.c_str());
        return;
    }
    //existing --> edit
    teamIt->second.NameSet(name);
    m_FuncDirty();
}

void CTeamManager::Delete(const std::string& id)
{
    //new or existing team?
    MapTeamIt teamIt = m_Teams.find(id);
    if(m_Teams.end() == teamIt) {
        //new --> error
        m_spLogger->error("CTeamManager [%s][%u] team with ID [%s] does not yet exists.", __FUNCTION__, __LINE__, id.c_str());
        return;
    }
    //existing --> delete
    m_Teams.erase(teamIt);
    m_FuncDirty();
}

void CTeamManager::PointsRound(const std::string& teamId, const int teamPointsThis, const int teamPointsOther)
{
    for(auto cit = m_Teams.begin() ; m_Teams.end() != cit ; ++cit) {
        if(teamId == cit->second.NameGet()) {
            cit->second.PointsRound(teamPointsThis);
        } else {
            cit->second.PointsRound(teamPointsOther);
        }
    }    
    m_FuncDirty();
}

void CTeamManager::PointsRound2Total(void)
{
    for(auto cit = m_Teams.begin() ; m_Teams.end() != cit ; ++cit) {
        cit->second.PointsRound2Total();
    }    
    m_FuncDirty();
}

void CTeamManager::PointsClear(void)
{
    for(auto cit = m_Teams.begin() ; m_Teams.end() != cit ; ++cit) {
        cit->second.PointsClear();
    }    
    m_FuncDirty();
}
