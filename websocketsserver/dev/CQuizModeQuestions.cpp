#include "CQuizModeQuestions.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeQuestions::CQuizModeQuestions(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "questions")
   , m_spTeamManager(spTeamManager)
   , m_Users(users)
   , m_nbrOfQuestions(0)
   , m_Questions()
{
}

CQuizModeQuestions::~CQuizModeQuestions(void) throw()
{
}

void CQuizModeQuestions::HandleMessageQuiz(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("questions-answer" == mi) {
        HandleMessageQuizAnswer(id, citJsData);
    }
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

void CQuizModeQuestions::UsersChanged(const MapUser& users)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_Users = users;
}

void CQuizModeQuestions::ReConnect(const std::string& id)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    CQuizModeBase::ReConnect(id);

    //send number of questions
    {
        json jsonData; 
        jsonData["nbrOfQuestions"] = m_nbrOfQuestions;
        m_spWsQuizHandler->SendMessage(id, "questions-configure", jsonData);
    }

    //send all answers for this team
    {
        //find the user and his/her team
        MapUserCIt citUser = m_Users.find(id);
        if(m_Users.end() == citUser) {
            //not found
            //can be the beamer or the master
            return;
        }
        const std::string teamId(citUser->second.TeamGet());

        auto teamQuestions = m_Questions.find(teamId);
        if(teamQuestions == m_Questions.end()) {
            //this should not happen: team memory was prepared before
            m_spLogger->warning("CQuizModeQuestions [%s][%u] team-ID [%s] not found.", __FUNCTION__, __LINE__, teamId.c_str());
            return;
        }

        //compose data
        json         jsonData; 
        unsigned int idx     = 0;
        for(const auto teamQuestionsOne : teamQuestions->second) {
            json jsonDataOne; 
            jsonDataOne["idx"]    = idx++;
            jsonDataOne["answer"] = teamQuestionsOne;
            jsonData["answers"].push_back(jsonDataOne);
        }

        //send
        m_spWsQuizHandler->SendMessage(id, "questions-answer-update-all", jsonData);
    }
}

void CQuizModeQuestions::HandleMessageMasterConfigure(const nlohmann::json::const_iterator citJsData)
{
    //spread the news
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_nbrOfQuestions = GetElementInt(citJsData, "nbrOfQuestions");
    m_spWsQuizHandler->SendMessage("questions-configure", citJsData);

    //prepare the answers storage
    m_Questions.clear();
    for(const auto teamId : m_spTeamManager->GetAllTeamIds()) {
        std::vector<std::string> questions(m_nbrOfQuestions);
        m_Questions.insert(std::pair<std::string,std::vector<std::string>>(teamId, questions));
    }
}

void CQuizModeQuestions::HandleMessageQuizAnswer(const std::string& id, const nlohmann::json::const_iterator citJsData)
{
    //get info from the data
    const int         idx    = GetElementInt(citJsData,    "idx"   );
    const std::string answer = GetElementString(citJsData, "answer");

    //find the user and his/her team
    MapUserCIt citUser = m_Users.find(id);
    if(m_Users.end() == citUser) {
        //not found
        m_spLogger->warning("CQuizModeQuestions [%s][%u] ID [%s] not found.", __FUNCTION__, __LINE__, id.c_str());
        return;
    }
    const std::string teamId(citUser->second.TeamGet());

    //store the answer
    {
        //get the team map entry
        auto teamQuestions = m_Questions.find(teamId);
        if(teamQuestions == m_Questions.end()) {
            //this should not happen: team memory was prepared before
            m_spLogger->warning("CQuizModeQuestions [%s][%u] team-ID [%s] not found.", __FUNCTION__, __LINE__, teamId.c_str());
            return;
        }

        //update the answer
        if(idx < 0) {
            m_spLogger->warning("CQuizModeQuestions [%s][%u] invalid index [%d].", __FUNCTION__, __LINE__, idx);
            return;
        }
        if((unsigned int)idx >= teamQuestions->second.size()) {
            m_spLogger->warning("CQuizModeQuestions [%s][%u] invalid index [%d].", __FUNCTION__, __LINE__, idx);
            return;
        }
        teamQuestions->second[idx] = answer;
    }    

    //send the new answer to all other user's in this team
    {
        //compose data
        json jsonData; 
        jsonData["idx"]    = idx;
        jsonData["answer"] = answer;
        
        //send
        for(auto user : m_Users) {
            //look for a matching team
            if(teamId != user.second.TeamGet()) {
                continue;
            }

            //exclude the sender
            const std::string userId(user.second.IdGet());
            if(id == userId) {
                continue;
            }

            //send the new list
            m_spLogger->warning("CQuizModeQuestions [%s][%u] incoming ID [%s] to ID [%s].", __FUNCTION__, __LINE__, id.c_str(), userId.c_str());
            m_spWsQuizHandler->SendMessage(userId, "questions-answer-update-one", citJsData);
        }
    }
}
