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

void CSimpleButtonTeamInfo::MembersAdd(const std::string& name)
{
  m_Members.push_back(name);
}

void CSimpleButtonTeamInfo::MembersClear(void)
{
  m_Members.clear();
}

json CSimpleButtonTeamInfo::ToJson(const bool first) const
{
  json data;
  data["name"]       = m_Name;
  data["background"] = first ? "success" : "info";
  data["members"]    = m_Members;
  return data;
}
