#ifndef __CUSER__H__
#define __CUSER__H__

#include <string>

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

#endif //__CUSER__H__

