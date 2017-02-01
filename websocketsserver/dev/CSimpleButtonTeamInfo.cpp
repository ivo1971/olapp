#include "CSimpleButtonTeamInfo.h"

using namespace nlohmann;
using namespace std;

CSimpleButtonTeamInfo::CSimpleButtonTeamInfo(const std::string& name)
  : m_Name(name)
  , m_Members()
  , m_Active(true)
  , m_Good(false)
{
}

CSimpleButtonTeamInfo::CSimpleButtonTeamInfo(const CSimpleButtonTeamInfo& ref)
  : m_Name(ref.m_Name)
  , m_Members(ref.m_Members)
  , m_Active(ref.m_Active)
  , m_Good(ref.m_Good)
{
}

CSimpleButtonTeamInfo::~CSimpleButtonTeamInfo(void) throw()
{
}

CSimpleButtonTeamInfo& CSimpleButtonTeamInfo::operator=(const CSimpleButtonTeamInfo& ref)
{
  if(this == &ref) return *this;
  m_Name    = ref.m_Name;
  m_Members = ref.m_Members;
  m_Active  = ref.m_Active;
  m_Good    = ref.m_Good;
  return *this;
}

bool CSimpleButtonTeamInfo::IsName(const std::string& name) const
{
  return name == m_Name;
}

bool CSimpleButtonTeamInfo::IsActive(void) const
{
  return m_Active;
}

bool CSimpleButtonTeamInfo::IsGood(void) const
{
  return m_Good;
}

std::string CSimpleButtonTeamInfo::GetName(void) const
{
  return m_Name;
}

void CSimpleButtonTeamInfo::Deactivate(void)
{
  m_Active = false;
}

void CSimpleButtonTeamInfo::Good(void)
{
  m_Good = true;
}

bool CSimpleButtonTeamInfo::HasName(const std::string& name)
{
  return name == m_Name;
}

void CSimpleButtonTeamInfo::MembersAdd(const std::string& name)
{
  for(auto it : m_Members) {
    if(0 == it.compare(name)) {
      //already on the list
      return;
    }
  }
  m_Members.push_back(name);
}

void CSimpleButtonTeamInfo::MembersClear(void)
{
  m_Members.clear();
}

json CSimpleButtonTeamInfo::ToJson(void) const
{
  json data;
  data["name"]    = m_Name;
  data["members"] = m_Members;
  data["active"]  = m_Active;
  data["good"]    = m_Good;
  return data;
}

