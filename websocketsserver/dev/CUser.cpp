#include "CUser.h"
#include "JsonHelpers.h"

using namespace nlohmann;

CUser::CUser(const std::string& id, const std::string& name, const bool connected)
  : m_Id(id)
  , m_Name(name)
  , m_Team()
  , m_Connected(connected)
{
}

CUser::CUser(const CUser& ref)
  : m_Id(ref.m_Id)
  , m_Name(ref.m_Name)
  , m_Team(ref.m_Team)
  , m_Connected(ref.m_Connected)
{
}

CUser::CUser(const nlohmann::json& jsonData, MapUser& mapUsers)
  : m_Id(GetElementString(jsonData, "id"))
  , m_Name(GetElementString(jsonData, "name"))
  , m_Team(GetElementString(jsonData, "team"))
  , m_Connected(false)
{
  mapUsers.insert(PairUser(m_Id, *this));
}

CUser::~CUser(void) throw()
{
}

CUser& CUser::operator=(const CUser& ref)
{
  if(this == &ref) return *this;
  m_Id        = ref.m_Id;
  m_Name      = ref.m_Name;
  m_Team      = ref.m_Team;
  m_Connected = ref.m_Connected;
  return *this;
}

void CUser::NameSet(const std::string& name)
{
  m_Name = name;
}

const std::string& CUser::NameGet(void) const
{
  return m_Name;
}

void CUser::TeamSet(const std::string& team)
{
  m_Team = team;
}

const std::string& CUser::TeamGet(void) const
{
  return m_Team;
}

void CUser::ConnectedSet(const bool connected)
{
  m_Connected = connected;
}

bool CUser::ConnectedGet(void) const
{
  return m_Connected;
}

json CUser::ToJson(void) const
{
  json data;
  data["id"]        = m_Id;
  data["name"]      = m_Name;
  data["team"]      = m_Team;
  data["connected"] = m_Connected;
  return data;
}

json MapUserToJson(const MapUser& users)
{
  json data;
  for(auto it = users.begin() ; users.end() != it ; ++it) {
      data["users"].push_back(it->second.ToJson());    
  }
  return data;
}

