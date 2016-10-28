#ifndef __CSIMPLEBUTTONTEAMINFO__H__
#define __CSIMPLEBUTTONTEAMINFO__H__

#include <list>
#include <string>

#include "json.hpp"

class CSimpleButtonTeamInfo {
 public:
  CSimpleButtonTeamInfo(const std::string& name);
  ~CSimpleButtonTeamInfo(void) throw();

 public:
  void                   MembersAdd(const std::string& name);
  void                   MembersClear(void);
  nlohmann::json         ToJson(const bool first) const;

 private:
  std::string            m_Name;
  std::list<std::string> m_Members;

};

#endif //__CSIMPLEBUTTONTEAMINFO__H__