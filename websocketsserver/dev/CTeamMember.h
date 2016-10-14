#ifndef __CTEAMMEMBER__H__
#define __CTEAMMEMBER__H__

#include <map>
#include <string>

class CTeamMember {
 public:
                     CTeamMember(const std::string& name, const bool connected = true);
                     CTeamMember(const CTeamMember& ref);
                     ~CTeamMember(void) throw();

 public:
  const std::string& GetName(void) const;
  bool               GetConnected(void) const;
  void               Update(const CTeamMember& ref);
  void               SetConnected(const bool connected);

 private:
  CTeamMember&       operator=(const CTeamMember& ref);

 private:
  std::string        m_Name;
  bool               m_Connected;
};

typedef std::pair<std::string, CTeamMember> PairCTeamMember;
typedef std::map<std::string, CTeamMember>  MapCTeamMember;
typedef MapCTeamMember::iterator            MapCTeamMemberIt;
typedef MapCTeamMember::const_iterator      MapCTeamMemberCIt;

#endif //#ifndef __CTEAMMEMBER__H__
