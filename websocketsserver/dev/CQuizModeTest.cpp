#include "CQuizModeTest.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeTest::CQuizModeTest(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapTeam& teams, const MapUser& users)
   : IQuizMode(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, teams, users)
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "test")
{
}

CQuizModeTest::~CQuizModeTest(void) throw()
{
}

void CQuizModeTest::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeTest [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeTest::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeTest [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeTest::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeTest [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeTest::TeamsChanged(const MapTeam& /* teams */)
{
    m_spLogger->info("CQuizModeTest [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeTest::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeTest [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeTest::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id);
}