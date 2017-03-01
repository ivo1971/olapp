#ifndef __CUSER__H__
#define __CUSER__H__

#include <map>
#include <string>

#include "json.hpp"

//forward declaration required for map typedefs
class CUser;

//typedefs around the CUser class
typedef std::pair<std::string, CUser> PairUser;
typedef std::map<std::string, CUser>  MapUser;
typedef MapUser::iterator             MapUserIt;
typedef MapUser::const_iterator       MapUserCIt;

//the CUser class
class CUser {
  public:
                        CUser(const std::string& id, const std::string& name, const bool connected);
                        CUser(const CUser& ref);
                        CUser(const nlohmann::json& jsonData, MapUser& mapUsers);
                        ~CUser(void) throw();
    CUser&              operator=(const CUser& ref);

  public:
    const std::string&  IdGet(void) const;
    void                NameSet(const std::string& name);
    const std::string&  NameGet(void) const;
    void                TeamSet(const std::string& team);
    const std::string&  TeamGet(void) const;
    void                ConnectedSet(const bool connected);
    bool                ConnectedGet(void) const;
    nlohmann::json      ToJson(void) const;

 private:
    std::string         m_Id;
    std::string         m_Name;
    std::string         m_Team;
    bool                m_Connected;
};

//extra functions
nlohmann::json MapUserToJson(const MapUser& teams);

#endif //__CUSER__H__
