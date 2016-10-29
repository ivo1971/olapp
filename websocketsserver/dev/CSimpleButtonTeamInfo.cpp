#include "CSimpleButtonTeamInfo.h"

using namespace nlohmann;
using namespace std;

CSimpleButtonTeamInfo::CSimpleButtonTeamInfo(const std::string& name)
  : m_Name(name)
  , m_Members()
{
}

CSimpleButtonTeamInfo::~CSimpleButtonTeamInfo(void) throw()
{
}

bool CSimpleButtonTeamInfo::HasName(const std::string& name)
{
  return name == m_Name;
}

void CSimpleButtonTeamInfo::MembersAdd(const std::string& name)
{
  m_Members.push_back(name);
}

void CSimpleButtonTeamInfo::MembersClear(void)
{
  m_Members.clear();
}

json CSimpleButtonTeamInfo::ToJson(void) const
{
  json data;
  data["name"]       = m_Name;
  data["members"]    = m_Members;
  return data;
}

