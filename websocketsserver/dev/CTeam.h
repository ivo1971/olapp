#ifndef __CTEAM__H__
#define __CTEAM__H__

#include <map>
#include <string>

#include "json.hpp"

//the CUser class
class CTeam {
 public:
                     CTeam(const std::string& id, const std::string& name);
                     CTeam(const CTeam& ref);
                     ~CTeam(void) throw();
  CTeam&             operator=(const CTeam& ref);

 public:
  void               NameSet(const std::string& name);
  const std::string& NameGet(void) const;
  nlohmann::json     ToJson(void) const;

 private:
  std::string        m_Id;
  std::string        m_Name;
};

//typedefs around the CTeam class
typedef std::pair<std::string, CTeam> PairTeam;
typedef std::map<std::string, CTeam>  MapTeam;
typedef MapTeam::iterator             MapTeamIt;
typedef MapTeam::const_iterator       MapTeamCIt;

//extra functions
nlohmann::json MapTeamToJson(const MapTeam& teams);

#endif //__CTEAM__H__
