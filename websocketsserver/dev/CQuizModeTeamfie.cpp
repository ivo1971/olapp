#include "CQuizModeTeamfie.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeTeamfie::CQuizModeTeamfie(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "teamfie")
{
}

CQuizModeTeamfie::~CQuizModeTeamfie(void) throw()
{
}

void CQuizModeTeamfie::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeTeamfie::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeTeamfie::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeTeamfie::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeTeamfie::ReConnect(const std::string& id)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u].", __FUNCTION__, __LINE__);
    CQuizModeBase::ReConnect(id);
}
