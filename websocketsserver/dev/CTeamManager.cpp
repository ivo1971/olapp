#include "CTeamManager.h"

using namespace::std;

CTeamManager::CTeamManager(void)
  : m_MapTeamMembers()
{
}

CTeamManager::~CTeamManager(void) throw()
{
}

const MapCTeamMember& CTeamManager::GetTeamMembers(void) const
{
  return m_MapTeamMembers;
}

void CTeamManager::AddTeamMember(const std::string id, const CTeamMember& teamMember)
{
  MapCTeamMemberIt it = m_MapTeamMembers.find(id);
  if(m_MapTeamMembers.end() == it) {
    //new member
    m_MapTeamMembers.insert(PairCTeamMember(id, teamMember));
  } else {
    //update member
    it->second.Update(teamMember);
  }
}
