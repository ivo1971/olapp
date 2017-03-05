#include <algorithm>    // std::random_shuffle
#include <cstdlib>      // std::rand, std::srand
#include <ctime>        // std::time
#include <fstream>      // std::ifstream, std::ofstream
#include <iostream>     // std::cout
#include <vector>       // std::vector

#include <sys/types.h>
#include <dirent.h>

#include "CQuizModeSortImages.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

#define FILE_NAME_SOLUTION "solution"

// random generator function:
int myrandom (int i) { return std::rand()%i;}

CQuizModeSortImages::CQuizModeSortImages(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users, const std::string& httpDir, const std::string& httpImagesDir)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "sort-images")
   , m_Users(users)
   , m_spTeamManager(spTeamManager)
   , m_HttpDir(httpDir)
   , m_HttpImagesDir(httpImagesDir)
   , m_Images()
   , m_MapTeamImageLists()
   , m_ModeSort(true) /* start in sorting mode */
{
    //start this round clean
    m_spTeamManager->PointsRoundClear();

    //load a list of images
    LoadImages();

    //send the list to all clients
    {
       json jsonData; 
       for(auto image : m_Images) {
           jsonData["images"].push_back(image);
       }
       m_spWsQuizHandler->SendMessage  ("sort-images-list-random", jsonData);
       m_spWsMasterHandler->SendMessage("sort-images-list-random", jsonData);
       m_spWsBeamerHandler->SendMessage("sort-images-list-random", jsonData);
    }
}

CQuizModeSortImages::~CQuizModeSortImages(void) throw()
{
}

void CQuizModeSortImages::HandleMessageQuiz(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("sort-images-list-team" == mi) {
        HandleMessageQuizListTeam(id, citJsData);
    }
}

void CQuizModeSortImages::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("sort-images-action" == mi) {
        HandleMessageMasterAction(citJsData);
    } else if("sort-images-set-points" == mi) {
        HandleMessageMasterSetPoints(citJsData);
    }
}

void CQuizModeSortImages::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeSortImages::UsersChanged(const MapUser& users)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u].", __FUNCTION__, __LINE__);
    m_Users = users;
}

void CQuizModeSortImages::ReConnect(const std::string& id)
{
    CQuizModeBase::ReConnect(id);

    //find the user and his/her team
    std::string teamId  ;
    MapUserCIt  citUser = m_Users.find(id);
    if(m_Users.end() != citUser) {
        //found
        teamId = citUser->second.TeamGet();
    }

    //send the list to the client
    {
       json jsonData; 
       for(auto image : m_Images) {
           jsonData["images"].push_back(image);
       }
       m_spWsMasterHandler->SendMessage(id, "sort-images-list-random", jsonData);
       m_spWsBeamerHandler->SendMessage(id, "sort-images-list-random", jsonData);

       //special handling for clients
       const auto teamImageList = m_MapTeamImageLists.find(teamId);
       if(teamImageList == m_MapTeamImageLists.end()) {
          //send randomized list
          m_spWsQuizHandler->SendMessage(id, "sort-images-list-random", jsonData);
       } else {
          //send sorted list
          m_spWsQuizHandler->SendMessage(id, "sort-images-list-random", teamImageList->second);
       }
    }

    //deal with the mode
    HandleMessageMasterAction(m_ModeSort, id);
}

void CQuizModeSortImages::LoadImages(void)
{
   //init random number generator
   std::srand ( unsigned ( std::time(0) ) );

   //read image files
   const std::string sortImages("sortImages");
   std::stringstream imagesDir;
   imagesDir << m_HttpImagesDir << sortImages;
   DIR* pDir = opendir(imagesDir.str().c_str());
   struct dirent* pDirent = NULL;
   while (NULL != (pDirent = readdir(pDir))) {
      if(0 == strcmp(".", pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp("..", pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp(FILE_NAME_SOLUTION, pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp(FILE_NAME_SOLUTION "~", pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp(".gitignore", pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp(".gitignore~", pDirent->d_name)) {
          continue;
      }
      const std::string imageAbs = imagesDir.str() + std::string("/") + std::string(pDirent->d_name);
      const std::string imageRel = sortImages      + std::string("/") + std::string(pDirent->d_name); 
      m_Images.push_back(imageRel);
      m_spLogger->info("CQuizModeSortImages [%s][%u] [%s][%s].", __FUNCTION__, __LINE__, imageAbs.c_str(), imageRel.c_str());
   }
   closedir(pDir);

   //handle solutions file 
   {
       std::stringstream solutionsFile;
       solutionsFile << imagesDir.str() << "/" << FILE_NAME_SOLUTION;
       if(0 == access(solutionsFile.str().c_str(), R_OK)) {
          //file exists, accept it as the solution
          m_spLogger->info("CQuizModeSortImages [%s][%u] solutions file found.", __FUNCTION__, __LINE__);
          std::vector<std::string> solution;
          std::ifstream            solutionFileStream(solutionsFile.str());
          std::string              line;
          while (std::getline(solutionFileStream, line)) {
             m_spLogger->info("CQuizModeSortImages [%s][%u] solutions file: [%s].", __FUNCTION__, __LINE__, line.c_str());
             solution.push_back(line);
          }
          json jsonDataSolution; 
          for(auto image : solution) {
             jsonDataSolution["images"].push_back(image);
          }
          m_MapTeamImageLists.insert(std::pair<std::string, nlohmann::json>("solution", jsonDataSolution));
       } else {
          //file does not exist --> create it and exit
          std::ofstream solutionFileStream(solutionsFile.str());
          m_spLogger->info("CQuizModeSortImages [%s][%u] solutions file NOT found --> creating.", __FUNCTION__, __LINE__);
          for(auto image : m_Images) {
              solutionFileStream << image << std::endl;
              m_spLogger->info("CQuizModeSortImages [%s][%u] add [%s].", __FUNCTION__, __LINE__, image.c_str());
          }
          solutionFileStream.close();
          exit(-1);
       }
   }

   //randomize the list
   std::random_shuffle(m_Images.begin(), m_Images.end());
   for(auto image : m_Images) {
      m_spLogger->info("CQuizModeSortImages [%s][%u] [%s].", __FUNCTION__, __LINE__, image.c_str());
   }
}

void CQuizModeSortImages::HandleMessageQuizListTeam(const std::string& id, const nlohmann::json::const_iterator citJsData)
{
    //find the user and his/her team
    MapUserCIt citUser = m_Users.find(id);
    if(m_Users.end() == citUser) {
        //not found
        m_spLogger->warning("CQuizModeSortImages [%s][%u] ID [%s] not found.", __FUNCTION__, __LINE__, id.c_str());
        return;
    }
    const std::string teamId(citUser->second.TeamGet());

    //store the new list for this team
    {
        const auto teamImageListItem = m_MapTeamImageLists.find(teamId);
        if(teamImageListItem != m_MapTeamImageLists.end()) {
            //exiting item --> remove
            m_MapTeamImageLists.erase(teamImageListItem);
        }
        m_MapTeamImageLists.insert(std::pair<std::string, nlohmann::json>(teamId, *citJsData));
        m_spLogger->info("CQuizModeSortImages [%s][%u] [%s].", __FUNCTION__, __LINE__, teamId.c_str());

        //send all teams with info to the master
        {
            json jsonData; 
            for(const auto teamImageList : m_MapTeamImageLists) {
                std::string teamName;
                if(m_spTeamManager->FindTeamName(teamImageList.first, teamName)) {
                    jsonData["teams"].push_back(teamName);
                }
            }
            m_spWsMasterHandler->SendMessage("sort-images-list-teams", jsonData);
        }        
    }

    //send the new list to all other user's in this team
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
        m_spLogger->warning("CQuizModeSimpleButton [%s][%u] incoming ID [%s] to ID [%s].", __FUNCTION__, __LINE__, id.c_str(), userId.c_str());
        m_spWsQuizHandler->SendMessage(userId, "sort-images-list-random", citJsData);
    }
}

void CQuizModeSortImages::HandleMessageMasterAction(const nlohmann::json::const_iterator citJsData)
{
    const bool sort = GetElementBoolean(citJsData, "sort");
    m_ModeSort = sort;
    HandleMessageMasterAction(sort);
}

void CQuizModeSortImages::HandleMessageMasterAction(const bool sort, const std::string id)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u] [%d].", __FUNCTION__, __LINE__, sort);
    json jsonData; 
    jsonData["sort"] = sort;
    if(sort) {
        //send an empty result list
    } else {
        //send all results
        for(const auto teamImageListItem : m_MapTeamImageLists) {
            std::string teamName;
            m_spTeamManager->FindTeamName(teamImageListItem.first, teamName);

            json jsonDataTeam; 
            jsonDataTeam["teamId"]   = teamImageListItem.first;
            jsonDataTeam["teamName"] = teamName;
            m_spLogger->info("CQuizModeSortImages [%s][%u] [%s][%d].", __FUNCTION__, __LINE__, teamImageListItem.first.c_str(), teamImageListItem.second.size());
            for(const auto imagesListItem : teamImageListItem.second) {
                jsonDataTeam["images"].push_back(imagesListItem);
            }
            jsonData["teams"].push_back(jsonDataTeam);
        }    
    }
    if(0 != id.length()) {
        m_spWsBeamerHandler->SendMessage(id, "sort-images-list-result", jsonData);
        m_spWsMasterHandler->SendMessage(id, "sort-images-list-result", jsonData);
        m_spWsQuizHandler->SendMessage  (id, "sort-images-list-result", jsonData);
    } else {
        m_spWsBeamerHandler->SendMessage("sort-images-list-result", jsonData);
        m_spWsMasterHandler->SendMessage("sort-images-list-result", jsonData);
        m_spWsQuizHandler->SendMessage  ("sort-images-list-result", jsonData);
    }
}

void CQuizModeSortImages::HandleMessageMasterSetPoints(const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u].", __FUNCTION__, __LINE__);
    const json::const_iterator citJsDataTeams = GetElement(citJsData, "teams");
    const vector<json> vJsDataTeams = citJsDataTeams->get<vector<json>>();
    m_spTeamManager->PointsRoundClear();
    for(const auto team : vJsDataTeams) {
        const std::string& id          = GetElementString(team, "id");
        const int          pointsRound = GetElementInt(team, "pointsRound");
        m_spLogger->info("CQuizModeSortImages [%s][%u] [%s][%d].", __FUNCTION__, __LINE__, id.c_str(), pointsRound);
        m_spTeamManager->PointsRoundId(id, pointsRound, 0, true);
    }
    m_spTeamManager->PointsRound2Total();
}
