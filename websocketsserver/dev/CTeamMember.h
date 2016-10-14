#ifndef __CTEAMMEMBER__H__
#define __CTEAMMEMBER__H__

#include <string>

class CTeamMember {
 public:
                     CTeamMember(const std::string& name);
                     ~CTeamMember(void) throw();

 public:
  const std::string& GetName(void) const;

 private:
                     CTeamMember(const CTeamMember& ref);
  CTeamMember&       operator=(const CTeamMember& ref);

 private:
  std::string        m_Name;
};

#endif //#ifndef __CTEAMMEMBER__H__
