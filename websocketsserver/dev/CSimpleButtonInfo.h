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
  void                             Reset(void);
  void                             TeamAdd(const std::string& team);
  void                             TeamDeactivate(const std::string& team);
  void                             TeamGood(const std::string& team);
  void                             TeamRemove(const std::string& team);
  void                             TeamMembersAdd(const std::string& team, const std::string& name);
  nlohmann::json                   ToJson(void) const;

 private:
  std::list<CSimpleButtonTeamInfo> m_Teams; //has to be a list to keep the insert order
};

#endif //__CSIMPLEBUTTONINFO__H__

