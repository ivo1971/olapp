#include "CTeam.h"

using namespace nlohmann;

CTeam::CTeam(const std::string& id, const std::string& name)
  : m_Id(id)
  , m_Name(name)
{
}

CTeam::CTeam(const CTeam& ref)
  : m_Id(ref.m_Id)
  , m_Name(ref.m_Name)
{
}

CTeam::~CTeam(void) throw()
{
}

CTeam& CTeam::operator=(const CTeam& ref)
{
  if(this == &ref) return *this;
  m_Id   = ref.m_Id;
  m_Name = ref.m_Name;
  return *this;
}

void CTeam::NameSet(const std::string& name)
{
  m_Name = name;
}

const std::string& CTeam::NameGet(void) const
{
  return m_Name;
}

json CTeam::ToJson(void) const
{
  json data;
  data["id"]      = m_Id;
  data["name"]    = m_Name;
  return data;
}

json MapTeamToJson(const MapTeam& teams)
{
  json data;
  for(auto it = teams.begin() ; teams.end() != it ; ++it) {
      data["teams"].push_back(it->second.ToJson());    
  }
  return data;
}
