#include "CTeam.h"
#include "JsonHelpers.h"

using namespace nlohmann;

CTeam::CTeam(const std::string& id, const std::string& name)
  : m_Id(id)
  , m_Name(name)
  , m_PointsTotal()
  , m_PointsRound()
{
}

CTeam::CTeam(const CTeam& ref)
  : m_Id(ref.m_Id)
  , m_Name(ref.m_Name)
  , m_PointsTotal(ref.m_PointsTotal)
  , m_PointsRound(ref.m_PointsRound)
{
}

CTeam::CTeam(const nlohmann::json& jsonData)
  : m_Id(GetElementString(jsonData, "id"))
  , m_Name(GetElementString(jsonData, "name"))
  , m_PointsTotal(GetElementInt(jsonData, "pointsTotal"))
  , m_PointsRound(GetElementInt(jsonData, "pointsRound"))
{
}

CTeam::~CTeam(void) throw()
{
}

CTeam& CTeam::operator=(const CTeam& ref)
{
  if(this == &ref) return *this;
  m_Id          = ref.m_Id;
  m_Name        = ref.m_Name;
  m_PointsTotal = ref.m_PointsTotal;
  m_PointsRound = ref.m_PointsRound;
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

const std::string& CTeam::IdGet(void) const
{
  return m_Id;
}

json CTeam::ToJson(void) const
{
  json data;
  data["id"]          = m_Id;
  data["name"]        = m_Name;
  data["pointsTotal"] = m_PointsTotal;
  data["pointsRound"] = m_PointsRound;
  return data;
}
