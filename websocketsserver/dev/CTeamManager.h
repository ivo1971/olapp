#ifndef __CTEAMMANAGER__H__
#define __CTEAMMANAGER__H__

#include <string>

#include "boost/signals2.hpp"
#include "json.hpp"

#include "CTeamMember.h"

class CTeamManager {
 public:
                                          CTeamManager(void);
                                          ~CTeamManager(void) throw();

 public:
   const MapCTeamMember&                  GetTeamMembers(void) const;
   void	                                  TeamMemberAdd(const std::string id, const CTeamMember& teamMember);
   void                                   TeamMemberDisconnected(const std::string id);
   void                                   ForwardToAllUsers(const std::string mi, const nlohmann::json::const_iterator citJsData);



 public:
  typedef boost::signals2::signal<void()> Signal_t;
  boost::signals2::connection             ConnectTeamMembersChanged(const Signal_t::slot_type& subscriber);
  typedef boost::signals2::signal<void(const std::string mi, const nlohmann::json::const_iterator citJsData)> SignalForwardToAllUsers;
  boost::signals2::connection             ConnectForwardToAllUsers(const SignalForwardToAllUsers::slot_type& subscriber);
  
 private:
                                          CTeamManager(const CTeamManager& ref);
  CTeamManager&                           operator=(const CTeamManager& ref);

 private:
  MapCTeamMember                          m_MapTeamMembers;
  Signal_t                                m_SignalTeamMembersChanged;
  SignalForwardToAllUsers                 m_SignalForwardToAllUsers;
};

#endif //#ifndef __CTEAMMANAGER__H__
