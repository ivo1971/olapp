#ifndef __CUSER__H__
#define __CUSER__H__

#include <map>
#include <string>

//the CUser class
class CUser {
 public:
                     CUser(const std::string& name);
                     CUser(const CUser& ref);
                     ~CUser(void) throw();
  CUser&             operator=(const CUser& ref);

 public:
  void               NameSet(const std::string& name);
  const std::string& NameGet(void) const;

 private:

 private:
  std::string        m_Name;
};

//typedefs around the CUser class
typedef std::pair<std::string, CUser> PairUser;
typedef std::map<std::string, CUser>  MapUser;
typedef MapUser::iterator             MapUserIt;
typedef MapUser::const_iterator       MapUserCIt;

#endif //__CUSER__H__

