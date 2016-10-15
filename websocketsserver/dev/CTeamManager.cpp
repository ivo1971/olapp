#include "CTeamManager.h"

using namespace::std;

CTeamManager::CTeamManager(void)
  : m_MapTeamMembers()
  , m_SignalTeamMembersChanged()
{
}

CTeamManager::~CTeamManager(void) throw()
{
}

const MapCTeamMember& CTeamManager::GetTeamMembers(void) const
{
  return m_MapTeamMembers;
}

void CTeamManager::TeamMemberAdd(const std::string id, const CTeamMember& teamMember)
{
  MapCTeamMemberIt it = m_MapTeamMembers.find(id);
  if(m_MapTeamMembers.end() == it) {
    //new member
    m_MapTeamMembers.insert(PairCTeamMember(id, teamMember));
  } else {
    //update member
    it->second.Update(teamMember);
  }
  m_SignalTeamMembersChanged();
}

void CTeamManager::TeamMemberDisconnected(const std::string id)
{
  MapCTeamMemberIt it = m_MapTeamMembers.find(id);
  if(m_MapTeamMembers.end() == it) {
    //unknown member: ignore
  } else {
    //update member
    it->second.SetConnected(false);
  }
  m_SignalTeamMembersChanged();
}

boost::signals2::connection CTeamManager::ConnectTeamMembersChanged(const Signal_t::slot_type& subscriber)
{
  return m_SignalTeamMembersChanged.connect(subscriber);
}