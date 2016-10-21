#ifndef __CMODEBASE__H__
#define __CMODEBASE__H__

#include "json.hpp"
#include "seasocks/PrintfLogger.h"
#include "seasocks/WebSocket.h"

#include "CTeamManager.h"

class CModeBase {
 public:
                                    CModeBase(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CTeamManager> spTeamManager);
  virtual                           ~CModeBase(void) throw();

 public:
  virtual void                      OnData(const std::string& mi, const nlohmann::json::const_iterator citJsonData) = 0;

 protected:
  std::shared_ptr<seasocks::Logger> m_spLogger;
  std::shared_ptr<CTeamManager>     m_spTeamManager;

 private:
  CModeBase(const CModeBase& ref);
  CModeBase& operator=(const CModeBase& ref) const;
};

#endif //#ifndef __CMODEBASE__H__
