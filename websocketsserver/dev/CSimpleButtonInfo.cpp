#include "CSimpleButtonInfo.h"

using namespace nlohmann;
using namespace std;

CSimpleButtonInfo::CSimpleButtonInfo(void)
  : m_SequenceNbr(0)
  , m_Teams()
{
}

CSimpleButtonInfo::~CSimpleButtonInfo(void) throw()
{
}

json CSimpleButtonInfo::Reset(void)
{
  m_SequenceNbr = 0;
  m_Teams.clear();
  return ToJson(true);
}

json CSimpleButtonInfo::Arm(void)
{
  Reset();
  return ToJson();
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

void CSimpleButtonInfo::TeamGood(const std::string& team)
{
  for(std::list<CSimpleButtonTeamInfo>::iterator it = m_Teams.begin() ; m_Teams.end() != it ; ++it) {
    if(it->HasName(team)) {
      it->Good();
    } else {
      it->Deactivate();
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

json CSimpleButtonInfo::ToJson(const bool noSequenceIncrement /* = false */) const
{
  json data;
  if(!noSequenceIncrement) {
    ++m_SequenceNbr;
  }
  data["seqNbr"] = m_SequenceNbr;
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

