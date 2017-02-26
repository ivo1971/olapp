#include "CQuizModeSortImages.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeSortImages::CQuizModeSortImages(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "sort-images")
   , m_spTeamManager(spTeamManager)
{
    //start this round clean
    m_spTeamManager->PointsRoundClear();
}

CQuizModeSortImages::~CQuizModeSortImages(void) throw()
{
}

void CQuizModeSortImages::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSortImages::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSortImages::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSortImages::UsersChanged(const MapUser& /* users */)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u].", __FUNCTION__, __LINE__);
}

void CQuizModeSortImages::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id);
}
