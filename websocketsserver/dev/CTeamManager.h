#ifndef __CTEAMMANAGER__H__
#define __CTEAMMANAGER__H__

#include <string>

#include "CTeamMember.h"

class CTeamManager {
 public:
                         CTeamManager(void);
                         ~CTeamManager(void) throw();

 public:
   const MapCTeamMember& GetTeamMembers(void) const;
   void	                 AddTeamMember(const std::string id, const CTeamMember& teamMember);

 private:
                         CTeamManager(const CTeamManager& ref);
  CTeamManager&          operator=(const CTeamManager& ref);

 private:
  MapCTeamMember         m_MapTeamMembers;
};

#endif //#ifndef __CTEAMMANAGER__H__
