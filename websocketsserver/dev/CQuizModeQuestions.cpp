#include <fstream>
#include <iostream>

#include <dirent.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

#include "CQuizModeQuestions.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeQuestions::CQuizModeQuestions(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users, const std::string& httpDir, const std::string& httpImagesDir, const std::string& fileName)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "questions")
   , m_spTeamManager(spTeamManager)
   , m_Users(users)
   , m_HttpDir(httpDir)
   , m_HttpImagesDir(httpImagesDir)
   , m_FileName(fileName + std::string(".questions"))
   , m_NbrOfQuestions(0)
   , m_PointsPerQuestion(1)
   , m_AnsweringType()
   , m_Questions()
   , m_Answering(true)
   , m_Evaluations()
   , m_ImagesAvailable(LoadImages())
   , m_ImageOnBeamer()
   , m_ImagesOnClient()
{
    //load from file
    if(Load()) {
        //loaded status from file
        //--> simulate reconnect of all to spread the new information
        ReConnectAll();
    }

    //send available images to master
    m_spWsMasterHandler->SendMessage("questions-images-available", m_ImagesAvailable);
}

CQuizModeQuestions::~CQuizModeQuestions(void) throw()
{
    //clear the status
    unlink(m_FileName.c_str());
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
    } else if("questions-image-on-beamer" == mi) {
        HandleMessageMasterImageOnBeamer(citJsData);
    } else if("questions-images-on-client" == mi) {
        HandleMessageMasterImagesOnClient(citJsData);
    } else {
        m_spLogger->error("CQuizModeQuestions [%s][%u] MI [%s] unhandled.", __FUNCTION__, __LINE__, mi.c_str());
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
        jsonData["nbrOfQuestions"]    = m_NbrOfQuestions;
        jsonData["pointsPerQuestion"] = m_PointsPerQuestion;
        jsonData["answeringType"]     = m_AnsweringType;
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

    //send available images to master
    if(toMaster) {
        m_spWsMasterHandler->SendMessage(id, "questions-images-available",        m_ImagesAvailable);
        m_spWsMasterHandler->SendMessage(id, "questions-image-on-beamer",         m_ImageOnBeamer);
        m_spWsMasterHandler->SendMessage(id, "questions-images-on-client",        m_ImagesOnClient);
        m_spWsMasterHandler->SendMessage(id, "questions-images-on-client-master", m_ImagesOnClient);
    }

    //send image-on-beamer to the beamer
    if(toBeamer) {
        m_spWsBeamerHandler->SendMessage(id, "questions-image-on-beamer",  m_ImageOnBeamer);
        m_spWsBeamerHandler->SendMessage(id, "questions-images-on-client", m_ImagesOnClient);
    }

    //send images-on-client to the client
    if(toClient) {
        m_spWsQuizHandler->SendMessage(id, "questions-images-on-client", m_ImagesOnClient);
    }
}

void CQuizModeQuestions::HandleMessageMasterConfigure(const nlohmann::json::const_iterator citJsData)
{
    //parse the request
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_NbrOfQuestions    = GetElementInt   (citJsData, "nbrOfQuestions"   );
    m_PointsPerQuestion = GetElementInt   (citJsData, "pointsPerQuestion");
    m_AnsweringType     = GetElementString(citJsData, "answeringType"    );

    //spread the news
    m_spWsQuizHandler->SendMessage  ("questions-configure", citJsData);
    m_spWsBeamerHandler->SendMessage("questions-configure", citJsData);
    m_spWsMasterHandler->SendMessage("questions-configure", citJsData);

    //prepare the answers storage
    m_Questions.clear();
    for(const auto teamId : m_spTeamManager->GetAllTeamIds()) {
        std::vector<std::string> questions(m_NbrOfQuestions);
        m_Questions.insert(std::pair<std::string,std::vector<std::string>>(teamId, questions));
    }

    //clear the evaluations
    m_Evaluations.clear();

    //save the current state
    Save();
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

    //save the current state
    Save();
}

void CQuizModeQuestions::HandleMessageMasterEvaluations(const nlohmann::json::const_iterator citJsData)
{
    //spread the news
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_Evaluations = *citJsData;
    m_spWsQuizHandler->SendMessage  ("questions-evaluations", citJsData);
    m_spWsBeamerHandler->SendMessage("questions-evaluations", citJsData);
    m_spWsMasterHandler->SendMessage("questions-evaluations", citJsData);

    //save the current state
    Save();
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

    //save the current state
    Save();
}

void CQuizModeQuestions::HandleMessageMasterImageOnBeamer(const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_ImageOnBeamer = *citJsData;
    m_spWsBeamerHandler->SendMessage("questions-image-on-beamer", m_ImageOnBeamer);
    m_spWsMasterHandler->SendMessage("questions-image-on-beamer", m_ImageOnBeamer);

    //save the current state
    Save();
}

void CQuizModeQuestions::HandleMessageMasterImagesOnClient(const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeQuestions [%s][%u].", __FUNCTION__, __LINE__);
    m_ImagesOnClient = *citJsData;
    m_spWsBeamerHandler->SendMessage("questions-images-on-client", m_ImagesOnClient);
    m_spWsQuizHandler->SendMessage  ("questions-images-on-client", m_ImagesOnClient);
    m_spWsMasterHandler->SendMessage("questions-images-on-client", m_ImagesOnClient);

    //save the current state
    Save();
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

    //save the current state
    Save();
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

void CQuizModeQuestions::Save(void)
{
    //generate json data
    json data;
    data["nbrOfQuestions"]       = m_NbrOfQuestions;
    data["pointsPerQuestion"]    = m_PointsPerQuestion;
    data["answeringType"]        = m_AnsweringType;
    data["answering"]            = m_Answering;
    data["evaluations"]          = m_Evaluations;
    data["imageOnBeamer"]        = m_ImageOnBeamer;
    data["imagesOnClient"]       = m_ImagesOnClient;

    for(const auto team : m_Questions) {
        json dataTeam;
        dataTeam["id"] = team.first;
        for(const auto question : team.second) {
            json dataQuestion;
            dataQuestion["answer"] = question;
            dataTeam["questions"].push_back(dataQuestion);
        }
        data["questions"].push_back(dataTeam);        
    }

    //trace
    const std::string dataDump = data.dump();
    m_spLogger->info("CQuizModeQuestions [%s][%u] save [%s]: [%s].", __FUNCTION__, __LINE__, m_FileName.c_str(), dataDump.c_str());

    //save to file
    ofstream file;
    file.open(m_FileName, ios::out | ios::trunc);
    if(!file.is_open()) {
        m_spLogger->error("CQuizModeQuestions [%s][%u] could not open file [%s]: %m", __FUNCTION__, __LINE__, m_FileName.c_str());
    }
    file << dataDump;
    file.close();
}

bool CQuizModeQuestions::Load(void)
{
    //load status from file when the file exists
    if(0 != access(m_FileName.c_str(), R_OK)) {
        //no status file
        return false;
    }

    //read from file
    std::string dataDump;

    //read from file
    ifstream file;
    file.open(m_FileName, ios::in);
    if(!file.is_open()) {
        m_spLogger->error("CQuizModeQuestions [%s][%u] could not open file [%s]: %m", __FUNCTION__, __LINE__, m_FileName.c_str());
        return false;
    }
    while(file) {
        std::string tmp;
        file >> tmp;
        dataDump += tmp;
    }
    file.close();
    m_spLogger->info("CQuizModeQuestions [%s][%u] load [%s]: [%s].", __FUNCTION__, __LINE__, m_FileName.c_str(), dataDump.c_str());

    //string to json
    const json jsonData = json::parse(dataDump);  

    //from json to status
    m_NbrOfQuestions    = GetElementInt    (jsonData, "nbrOfQuestions"   );
    m_PointsPerQuestion = GetElementInt    (jsonData, "pointsPerQuestion");
    m_AnsweringType     = GetElementString (jsonData, "answeringType"    );
    m_Answering         = GetElementBoolean(jsonData, "answering"        );
    try {
        m_Evaluations.clear();
        const json::const_iterator citEvaluations = GetElement(jsonData, "evaluations");
        m_Evaluations = *citEvaluations;
    } catch(...) {
        m_Evaluations.clear();
    }
    try {
        m_ImageOnBeamer.clear();
        const json::const_iterator cit = GetElement(jsonData, "imageOnBeamer");
        m_ImageOnBeamer = *cit;
    } catch(...) {
        m_ImageOnBeamer.clear();
    }
    try {
        m_ImagesOnClient.clear();
        const json::const_iterator cit = GetElement(jsonData, "imagesOnClient");
        m_ImagesOnClient = *cit;
    } catch(...) {
        m_ImagesOnClient.clear();
    }
    try {
        m_Questions.clear();
        const json::const_iterator questions = GetElement(jsonData, "questions");
        for(json::const_iterator citQuestions = questions->begin() ; questions->end() != citQuestions ; ++citQuestions) {
            const std::string          id               = GetElementString(*citQuestions, "id"       );
            const json::const_iterator teamQuestions    = GetElement      (*citQuestions, "questions");
            std::vector<std::string>   teamQuestionsV   ;
            for(json::const_iterator citTeamQuestions = teamQuestions->begin() ; teamQuestions->end() != citTeamQuestions ; ++citTeamQuestions) {
                const std::string answer = GetElementString(*citTeamQuestions, "answer");
                teamQuestionsV.push_back(answer);
            }
            m_Questions.insert(std::pair<std::string,std::vector<std::string>>(id, teamQuestionsV));
        }
    } catch(...) {
        //clear all answers
        m_Questions.clear();
        for(const auto teamId : m_spTeamManager->GetAllTeamIds()) {
            std::vector<std::string> questions(m_NbrOfQuestions);
            m_Questions.insert(std::pair<std::string,std::vector<std::string>>(teamId, questions));
        }
    }
    return true;
}

json CQuizModeQuestions::LoadImages(void) const
{
    //read image files
    const std::string questionsImages("questions");
    const std::string dirAbs         (m_HttpImagesDir + questionsImages);
    //const std::string dirRel         (dirAbs.substr(m_HttpDir.length() + 1));
    const std::string dirRel         (questionsImages);
    const json        dataDir        = LoadImagesDir(dirAbs, dirRel, questionsImages);
    m_spLogger->info("CQuizModeQuestions [%s][%u] [%s].", __FUNCTION__, __LINE__, dataDir.dump().c_str());
    return dataDir;
}

json CQuizModeQuestions::LoadImagesDir(const std::string& dirAbs, const std::string& dirRel, const std::string dirName) const
{
    m_spLogger->info("CQuizModeQuestions [%s][%u] [%s][%s][%s].", __FUNCTION__, __LINE__, dirAbs.c_str(), dirRel.c_str(), dirName.c_str());

    //start json data for this directory
    json dataDir;
    dataDir["dirName"] = dirName;

    //scan this directory
    DIR* pDir = opendir(dirAbs.c_str());
    struct dirent* pDirent = NULL;
    while (NULL != (pDirent = readdir(pDir))) {
        //handle all directory entries
      if(0 == strcmp(".", pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp("..", pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp(".gitignore", pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp(".gitignore~", pDirent->d_name)) {
          continue;
      }
      const std::string imageAbs = dirAbs + std::string("/") + std::string(pDirent->d_name);
      const std::string imageRel = dirRel + std::string("/") + std::string(pDirent->d_name); 
      m_spLogger->info("CQuizModeQuestions [%s][%u] [%s][%s].", __FUNCTION__, __LINE__, imageAbs.c_str(), imageRel.c_str());

      //dir or file?
      struct stat fs;
      if(0 != stat(imageAbs.c_str(), &fs)) {
          m_spLogger->info("CQuizModeQuestions [%s][%u] [%s] fstat error: %m.", __FUNCTION__, __LINE__, imageAbs.c_str());
          continue;
      }
      if(S_ISDIR(fs.st_mode)) {
          //dir
          m_spLogger->info("CQuizModeQuestions [%s][%u] [%s][%s] dir.", __FUNCTION__, __LINE__, imageAbs.c_str(), imageRel.c_str());
          dataDir["images"] = json::array();          
          dataDir["subdir"].push_back(LoadImagesDir(imageAbs, imageRel, pDirent->d_name));
      } else {
          //file
          std::string name(pDirent->d_name);
          size_t      posNameExt = name.find_last_of(".");
          if(std::string::npos != posNameExt) {
              name = name.substr(0, posNameExt);
          }
          m_spLogger->info("CQuizModeQuestions [%s][%u] [%s][%s] image.", __FUNCTION__, __LINE__, imageAbs.c_str(), imageRel.c_str());
          json dataImage;
          dataImage["name"] = name;
          dataImage["url"]  = imageRel;
          dataDir["images"].push_back(dataImage);          
          dataDir["subdir"] = json::array();          
      }
   }
   closedir(pDir);
   return dataDir;
}
