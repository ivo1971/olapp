#include "CQuizModeScoreboard.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeScoreboard::CQuizModeScoreboard(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "scoreboard")
   , m_spTeamManager(spTeamManager)
{
}

CQuizModeScoreboard::~CQuizModeScoreboard(void) throw()
{
}

void CQuizModeScoreboard::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeScoreboard [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeScoreboard::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeScoreboard [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());

    if("scoreboard-set-points-round" == mi) {
        json::const_iterator citRound = GetElement(citJsData, "round");
        m_spLogger->info("CQuizModeScoreboard [%s][%u] MI [%s] size [%u].", __FUNCTION__, __LINE__, mi.c_str(), citRound->size());
        m_spTeamManager->PointsRoundClear(true);
        for(nlohmann::json::const_iterator citTeam = citRound->begin() ; citRound->end() != citTeam ; ++citTeam) {
            m_spTeamManager->PointsRoundId(citTeam.key(), citTeam.value().get<int>(), 0, true);
        }
        m_spTeamManager->CallDirty();
    } else if("scoreboard-points-round-2-total" == mi) {
        m_spTeamManager->PointsRound2Total();
    } else {
        //forward to all connected
        m_spWsQuizHandler->SendMessage  (mi, citJsData);
        m_spWsMasterHandler->SendMessage(mi, citJsData);
        m_spWsBeamerHandler->SendMessage(mi, citJsData);
    }
}

void CQuizModeScoreboard::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeScoreboard [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeScoreboard::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeScoreboard [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeScoreboard::ReConnect(const std::string& id)
{
    m_spLogger->info("CQuizModeScoreboard [%s][%u].", __FUNCTION__, __LINE__);
    CQuizModeBase::ReConnect(id);
}
