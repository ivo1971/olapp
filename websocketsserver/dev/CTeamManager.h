#ifndef __CTEAMMANAGER__H__
#define __CTEAMMANAGER__H__

#include <string>

#include "boost/signals2.hpp"

#include "CTeamMember.h"

class CTeamManager {
 public:
                                          CTeamManager(void);
                                          ~CTeamManager(void) throw();

 public:
   const MapCTeamMember&                  GetTeamMembers(void) const;
   void	                                  AddTeamMember(const std::string id, const CTeamMember& teamMember);

 public:
  typedef boost::signals2::signal<void()> Signal_t;
  boost::signals2::connection             Connect(const Signal_t::slot_type& subscriber);
  
 private:
                                          CTeamManager(const CTeamManager& ref);
  CTeamManager&                           operator=(const CTeamManager& ref);

 private:
  MapCTeamMember                          m_MapTeamMembers;
  Signal_t                                m_Signal;
};

#endif //#ifndef __CTEAMMANAGER__H__
