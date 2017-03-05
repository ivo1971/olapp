#include "CQuizModeQuestions.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeQuestions::CQuizModeQuestions(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "questions")
   , m_spTeamManager(spTeamManager)
   , m_nbrOfQuestions(0)
{
}

CQuizModeQuestions::~CQuizModeQuestions(void) throw()
{
}

void CQuizModeQuestions::HandleMessageQuiz(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeQuestions::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("questions-configure" == mi) {
        HandleMessageMasterConfigure(citJsData);
    }
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
    {
        json jsonData; 
        jsonData["nbrOfQuestions"] = m_nbrOfQuestions;
        m_spWsQuizHandler->SendMessage(id, "questions-configure", jsonData);
    }
}

void CQuizModeQuestions::HandleMessageMasterConfigure(const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_nbrOfQuestions = GetElementInt(citJsData, "nbrOfQuestions");
    m_spWsQuizHandler->SendMessage("questions-configure", citJsData);
}
