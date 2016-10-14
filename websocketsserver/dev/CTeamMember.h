#ifndef __CTEAMMEMBER__H__
#define __CTEAMMEMBER__H__

#include <map>
#include <string>

class CTeamMember {
 public:
                     CTeamMember(const std::string& name);
                     CTeamMember(const CTeamMember& ref);
                     ~CTeamMember(void) throw();

 public:
  const std::string& GetName(void) const;
  void               Update(const CTeamMember& ref);

 private:
  CTeamMember&       operator=(const CTeamMember& ref);

 private:
  std::string        m_Name;
};

typedef std::pair<std::string, CTeamMember> PairCTeamMember;
typedef std::map<std::string, CTeamMember>  MapCTeamMember;
typedef MapCTeamMember::iterator            MapCTeamMemberIt;
typedef MapCTeamMember::const_iterator      MapCTeamMemberCIt;

#endif //#ifndef __CTEAMMEMBER__H__
