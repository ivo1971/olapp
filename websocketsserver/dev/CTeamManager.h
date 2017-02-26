#ifndef __CTEAMMANAGER__H__
#define __CTEAMMANAGER__H__

#include <list>
#include <map>
#include <memory>
#include <string>

#include "json.hpp"
#include "seasocks/PrintfLogger.h"

#include "CTeam.h"

//the CUser class
class CTeamManager {
    public:
      typedef std::function<void(void)>                 FuncDirty;

    public:
                                                        CTeamManager(std::shared_ptr<seasocks::Logger> spLogger, FuncDirty funcDirty);
                                                        CTeamManager(std::shared_ptr<seasocks::Logger> spLogger, FuncDirty funcDirty, const nlohmann::json& jsonData);
                                                        CTeamManager(const CTeamManager& ref);
                                                        ~CTeamManager(void) throw();

    public:
        CTeamManager&                                   operator=(const CTeamManager& ref);
        nlohmann::json                                  ToJson(void) const;
        bool                                            FindTeamName(const std::string& teamId, std::string& teamName);
        void                                            Add(const std::string& id, const std::string& name);
        void                                            Edit(const std::string& id, const std::string& name);
        void                                            Delete(const std::string& id);
        void                                            PointsRoundId  (const std::string& teamId,   const int teamPointsThis, const int teamPointsOther, const bool intermediate = false);
        void                                            PointsRoundName(const std::string& teamName, const int teamPointsThis, const int teamPointsOther, const bool intermediate = false);
        void                                            PointsRound2Total(void);
        void                                            PointsRoundClear(const bool intermediate = false);
        void                                            PointsClear(void);
        std::list<std::string>                          GetAllTeamIds(void);
        void                                            CallDirty(void);

    private:
        MapTeam                                         m_Teams;
        std::shared_ptr<seasocks::Logger>               m_spLogger;
        FuncDirty                                       m_FuncDirty;
};

typedef std::shared_ptr<CTeamManager>                   SPTeamManager;
#endif //__CTEAMMANAGER__H__
