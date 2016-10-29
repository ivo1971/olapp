#include "CSimpleButtonInfo.h"

using namespace nlohmann;
using namespace std;

CSimpleButtonInfo::CSimpleButtonInfo(void)
  : m_Teams()
{
}

CSimpleButtonInfo::~CSimpleButtonInfo(void) throw()
{
}

void CSimpleButtonInfo::Reset(void)
{
  m_Teams.clear();
}

void CSimpleButtonInfo::TeamAdd(const std::string& team)
{
  m_Teams.push_back(CSimpleButtonTeamInfo(team));
}

void CSimpleButtonInfo::TeamDeactivate(const std::string& team)
{
  for(std::list<CSimpleButtonTeamInfo>::iterator it = m_Teams.begin() ; m_Teams.end() != it ; ++it) {
    if(it->HasName(team)) {
      it->Deactivate();
      return;
    }
  }
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
  if(0 != m_Teams.size()) {
    for(std::list<CSimpleButtonTeamInfo>::const_iterator cit = m_Teams.begin() ; m_Teams.end() != cit ; ++cit) {
      data["teams"].push_back(cit->ToJson());
    }
  } else {
    //send an array (easier to avoid null pointers in the client)
    json dataInner;
    data["teams"] = dataInner;
  }
  return data;
}

