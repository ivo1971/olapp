#include "CModeBase.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CModeBase::CModeBase(shared_ptr<Logger> spLogger, shared_ptr<CTeamManager> spTeamManager)
  : m_spLogger(spLogger)
  , m_spTeamManager(spTeamManager)
{
}

CModeBase::~CModeBase(void) throw()
{
}
