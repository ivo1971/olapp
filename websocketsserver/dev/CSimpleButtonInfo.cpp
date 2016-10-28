#include "CSimpleButtonInfo.h"

using namespace nlohmann;
using namespace std;

CSimpleButtonInfo::CSimpleButtonInfo(void)
  : m_Pressed(false)
  , m_Teams()
{
}

CSimpleButtonInfo::~CSimpleButtonInfo(void) throw()
{
}

void CSimpleButtonInfo::Pressed(const bool pressed)
{
  m_Pressed = pressed;
}

void CSimpleButtonInfo::TeamAdd(const std::string& team)
{
  m_Teams.insert(std::pair<std::string, CSimpleButtonTeamInfo>(team, CSimpleButtonTeamInfo(team)));
}

void CSimpleButtonInfo::TeamRemove(const std::string& team)
{
  std::map<string, CSimpleButtonTeamInfo>::iterator it = m_Teams.find(team);
  if(m_Teams.end() == it) {
    return;
  }
  m_Teams.erase(it);
}

void CSimpleButtonInfo::TeamMembersAdd(const std::string& team, const std::string& name)
{
  std::map<string, CSimpleButtonTeamInfo>::iterator it = m_Teams.find(team);
  if(m_Teams.end() == it) {
    return;
  }
  it->second.MembersAdd(name);
}

json CSimpleButtonInfo::ToJson(void) const
{
  json data;
  data["pressed"]    = m_Pressed;
  data["background"] = "warning";
  for(std::map<string, CSimpleButtonTeamInfo>::const_iterator cit = m_Teams.begin() ; m_Teams.end() != cit ; ++cit) {
    data["teams"].push_back(cit->second.ToJson(m_Teams.begin() == cit));
  }
  return data;
}

