#include "CQuizModeQuestions.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeQuestions::CQuizModeQuestions(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "scoreboard")
   , m_spTeamManager(spTeamManager)
{
}

CQuizModeQuestions::~CQuizModeQuestions(void) throw()
{
}

void CQuizModeQuestions::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeQuestions::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeQuestions::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeQuestions::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeQuestions::ReConnect(const std::string& id)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    CQuizModeBase::ReConnect(id);
}
