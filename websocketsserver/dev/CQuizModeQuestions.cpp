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
   , m_PointsPerQuestion(1)
   , m_Questions()
   , m_Answering(true)
   , m_Evaluations()
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
    } else {
        m_spLogger->error("CQuizModeQuestions [%s][%u] MI [%s] unhandled.", __FUNCTION__, __LINE__, mi.c_str());
    }
}

void CQuizModeQuestions::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("questions-configure" == mi) {
        HandleMessageMasterConfigure(citJsData);
    } else if("questions-action" == mi) {
        HandleMessageMasterAction(citJsData);
    } else if("questions-evaluations" == mi) {
        HandleMessageMasterEvaluations(citJsData);
    } else if("questions-set-points" == mi) {
        HandleMessageMasterSetPoints(citJsData);
    }
}

void CQuizModeQuestions::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator  /* citJsData */)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    m_spLogger->error("CQuizModeQuestions [%s][%u] MI [%s] unhandled.", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeQuestions::UsersChanged(const MapUser& users)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_Users = users;
}

void CQuizModeQuestions::ReConnect(const std::string& id)
{
    const bool toClient = m_spWsQuizHandler->HasId(id);
    const bool toMaster = m_spWsMasterHandler->HasId(id);
    const bool toBeamer = m_spWsBeamerHandler->HasId(id);
    m_spLogger->info("CQuizModeQuestions [%s][%u] [%d][%d][%d].", __FUNCTION__, __LINE__, toClient, toMaster, toBeamer);
    CQuizModeBase::ReConnect(id);

    //send configuration
    {
        json jsonData; 
        jsonData["nbrOfQuestions"]    = m_nbrOfQuestions;
        jsonData["pointsPerQuestion"] = m_PointsPerQuestion;
        if(toMaster) {
            m_spWsMasterHandler->SendMessage(id, "questions-configure",        jsonData);
            m_spWsMasterHandler->SendMessage(id, "questions-configure-master", jsonData);
        } else if(toBeamer) {
            m_spWsBeamerHandler->SendMessage(id, "questions-configure",        jsonData);
        } else if(toClient) {
            m_spWsQuizHandler->SendMessage  (id, "questions-configure",        jsonData);
        } else {
            m_spLogger->error("CQuizModeQuestions [%s][%u] unknown ID [%s].", __FUNCTION__, __LINE__, id.c_str());
        }
    }

    //send the current action
    {
        json jsonData; 
        jsonData["answering"] = m_Answering;
        if(toMaster) {
            m_spWsMasterHandler->SendMessage(id, "questions-action",        jsonData);
            m_spWsMasterHandler->SendMessage(id, "questions-action-master", jsonData);
        } else if(toBeamer) {
            m_spWsBeamerHandler->SendMessage(id, "questions-action",        jsonData);
        } else if(toClient) {
            m_spWsQuizHandler->SendMessage  (id, "questions-action",        jsonData);
        } else {
            m_spLogger->error("CQuizModeQuestions [%s][%u] unknown ID [%s].", __FUNCTION__, __LINE__, id.c_str());
        }
    }

    //send all answers for this team
    if(toClient) {
        m_spLogger->info("CQuizModeQuestions [%s][%u]", __FUNCTION__, __LINE__);
        //find the user and his/her team
        MapUserCIt citUser = m_Users.find(id);
        if(m_Users.end() == citUser) {
            //not found
        } else {
            const std::string teamId(citUser->second.TeamGet());

            auto teamQuestions = m_Questions.find(teamId);
            if(teamQuestions == m_Questions.end()) {
                //this should not happen: team memory was prepared before
                m_spLogger->warning("CQuizModeQuestions [%s][%u] team-ID [%s] not found.", __FUNCTION__, __LINE__, teamId.c_str());
            } else {
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
                m_spWsQuizHandler->SendMessage(id, "questions-answer-update-all", jsonData     );
                m_spWsQuizHandler->SendMessage(id, "questions-evaluations",       m_Evaluations);
            }
        }
    } else {
        //send all information to the beamer or master
        m_spLogger->info("CQuizModeQuestions [%s][%u] [%d][%d]", __FUNCTION__, __LINE__, toMaster, toBeamer);
        SendAnswersAll(toMaster, toBeamer);
        if(toMaster) {
            m_spWsMasterHandler->SendMessage(id, "questions-evaluations", m_Evaluations);
        }
        if(toBeamer) {
            m_spWsBeamerHandler->SendMessage(id, "questions-evaluations", m_Evaluations);
        }
    }
}

void CQuizModeQuestions::HandleMessageMasterConfigure(const nlohmann::json::const_iterator citJsData)
{
    //spread the news
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_nbrOfQuestions    = GetElementInt(citJsData, "nbrOfQuestions"   );
    m_PointsPerQuestion = GetElementInt(citJsData, "pointsPerQuestion");
    m_spWsQuizHandler->SendMessage  ("questions-configure", citJsData);
    m_spWsBeamerHandler->SendMessage("questions-configure", citJsData);
    m_spWsMasterHandler->SendMessage("questions-configure", citJsData);

    //prepare the answers storage
    m_Questions.clear();
    for(const auto teamId : m_spTeamManager->GetAllTeamIds()) {
        std::vector<std::string> questions(m_nbrOfQuestions);
        m_Questions.insert(std::pair<std::string,std::vector<std::string>>(teamId, questions));
    }

    //clear the evaluations
    m_Evaluations.clear();
}

void CQuizModeQuestions::HandleMessageMasterAction(const nlohmann::json::const_iterator citJsData)
{
    //spread the news
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_Answering = GetElementBoolean(citJsData, "answering");
    m_spWsQuizHandler->SendMessage  ("questions-action", citJsData);
    m_spWsBeamerHandler->SendMessage("questions-action", citJsData);
    m_spWsMasterHandler->SendMessage("questions-action", citJsData);

    //send answers from the teams to the masters and the beamers
    SendAnswersAll();
}

void CQuizModeQuestions::HandleMessageMasterEvaluations(const nlohmann::json::const_iterator citJsData)
{
    //spread the news
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_Evaluations = *citJsData;
    m_spWsQuizHandler->SendMessage  ("questions-evaluations", citJsData);
    m_spWsBeamerHandler->SendMessage("questions-evaluations", citJsData);
    m_spWsMasterHandler->SendMessage("questions-evaluations", citJsData);
}

void CQuizModeQuestions::HandleMessageMasterSetPoints(const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    const json::const_iterator citJsDataTeams = GetElement(citJsData, "teams");
    const vector<json> vJsDataTeams = citJsDataTeams->get<vector<json>>();
    m_spTeamManager->PointsRoundClear();
    for(const auto team : vJsDataTeams) {
        const std::string& id          = GetElementString(team, "id");
        const int          pointsRound = GetElementInt   (team, "pointsRound");
        m_spLogger->info("CQuizModeQuestions [%s][%u] [%s][%d].", __FUNCTION__, __LINE__, id.c_str(), pointsRound);
        m_spTeamManager->PointsRoundId(id, pointsRound, 0, true);
    }
    m_spTeamManager->PointsRound2Total();
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

void CQuizModeQuestions::SendAnswersAll(const bool toMaster, const bool toBeamer)
{
    json jsonData; 
    for(const auto teamQuestions : m_Questions) {
        std::string teamName;
        m_spTeamManager->FindTeamName(teamQuestions.first, teamName);

        json jsonDataTeam; 
        jsonDataTeam["id"]    = teamQuestions.first;
        jsonDataTeam["name"]  = teamName;
        unsigned int idx = 0;
        for(const auto teamAnswer : teamQuestions.second) {
            json jsonDataTeamAnswer; 
            jsonDataTeamAnswer["idx"]    = idx++;
            jsonDataTeamAnswer["answer"] = teamAnswer;
            jsonDataTeam["answers"].push_back(jsonDataTeamAnswer);
        }
        jsonData["teams"].push_back(jsonDataTeam);
    }
    if(toMaster) {
        m_spWsMasterHandler->SendMessage("questions-teams-answers-all", jsonData);    
    }
    if(toBeamer) {
        m_spWsBeamerHandler->SendMessage("questions-teams-answers-all", jsonData);    
    }
}
