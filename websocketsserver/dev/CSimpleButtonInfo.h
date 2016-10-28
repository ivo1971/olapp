#ifndef __CSIMPLEBUTTONINFO__H__
#define __CSIMPLEBUTTONINFO__H__

#include <map>
#include <string>

#include "json.hpp"

#include "CSimpleButtonTeamInfo.h"

class CSimpleButtonInfo {
 public:
  CSimpleButtonInfo(void);
  ~CSimpleButtonInfo(void) throw();

 public:
  void                                         Pressed(const bool pressed);
  void                                         TeamAdd(const std::string& team);
  void                                         TeamRemove(const std::string& team);
  void                                         TeamMembersAdd(const std::string& team, const std::string& name);
  nlohmann::json                               ToJson(void) const;

 private:
  bool                                         m_Pressed;
  std::map<std::string, CSimpleButtonTeamInfo> m_Teams;
};

#endif //__CSIMPLEBUTTONINFO__H__

