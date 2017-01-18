#include "CUser.h"

using namespace nlohmann;

CUser::CUser(const std::string& name)
  : m_Name(name)
{
}

CUser::CUser(const CUser& ref)
  : m_Name(ref.m_Name)
{
}

CUser::~CUser(void) throw()
{
}

CUser& CUser::operator=(const CUser& ref)
{
  if(this == &ref) return *this;
  m_Name = ref.m_Name;
  return *this;
}

void CUser::NameSet(const std::string& name)
{
  m_Name = name;
}

const std::string& CUser::NameGet(void) const
{
  return m_Name;
}

json CUser::ToJson(void) const
{
  json data;
  data["name"]    = m_Name;
  return data;
}

json MapUserToJson(const MapUser& users)
{
  json data;
  for(auto it = users.begin() ; users.end() != it ; ++it) {
      data["users"].push_back(it->second.ToJson());    
  }
  return data;
}

