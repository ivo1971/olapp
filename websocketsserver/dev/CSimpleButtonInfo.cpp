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
  m_Teams.push_back(CSimpleButtonTeamInfo(team));
}

void CSimpleButtonInfo::TeamRemove(const std::string& team)
{
  for(std::list<CSimpleButtonTeamInfo>::iterator it = m_Teams.begin() ; m_Teams.end() != it ; ++it) {
    if(it->HasName(team)) {
      m_Teams.erase(it);
      return;
    }
  }
}

void CSimpleButtonInfo::TeamMembersAdd(const std::string& team, const std::string& name)
{
  for(std::list<CSimpleButtonTeamInfo>::iterator it = m_Teams.begin() ; m_Teams.end() != it ; ++it) {
    if(it->HasName(team)) {
      it->MembersAdd(name);
      return;
    }
  }
}

json CSimpleButtonInfo::ToJson(void) const
{
  json data;
  data["pressed"]    = m_Pressed;
  data["background"] = "warning";
  for(std::list<CSimpleButtonTeamInfo>::const_iterator cit = m_Teams.begin() ; m_Teams.end() != cit ; ++cit) {
    data["teams"].push_back(cit->ToJson(m_Teams.begin() == cit));
  }
  return data;
}

