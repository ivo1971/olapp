#ifndef __CSIMPLEBUTTONTEAMINFO__H__
#define __CSIMPLEBUTTONTEAMINFO__H__

#include <list>
#include <string>

#include "json.hpp"

class CSimpleButtonTeamInfo {
 public:
                         CSimpleButtonTeamInfo(const std::string& name);
                         CSimpleButtonTeamInfo(const CSimpleButtonTeamInfo& ref);
                         ~CSimpleButtonTeamInfo(void) throw();
  CSimpleButtonTeamInfo& operator=(const CSimpleButtonTeamInfo& ref);

 public:
  bool                   IsName(const std::string& name) const;
  bool                   IsActive(void) const;
  std::string            GetName(void) const;
  void                   Deactivate(void);
  void                   Good(void);
  bool                   HasName(const std::string& name);
  void                   MembersAdd(const std::string& name);
  void                   MembersClear(void);
  nlohmann::json         ToJson(void) const;

 private:
  std::string            m_Name;
  std::list<std::string> m_Members;  
  bool                   m_Active;
  bool                   m_Good;
};

#endif //__CSIMPLEBUTTONTEAMINFO__H__
