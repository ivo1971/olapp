#include <iostream>     // std::cout
#include <algorithm>    // std::random_shuffle
#include <vector>       // std::vector
#include <ctime>        // std::time
#include <cstdlib>      // std::rand, std::srand

#include <sys/types.h>
#include <dirent.h>

#include "CQuizModeSortImages.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

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

void CQuizModeSortImages::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeSortImages [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
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

    //send the list to the client
    {
       json jsonData; 
       for(auto image : m_Images) {
           jsonData["images"].push_back(image);
       }
       //todo: figure out the client type instead of sending a message to all types
       m_spWsQuizHandler->SendMessage  (id, "sort-images-list-random", jsonData);
       m_spWsMasterHandler->SendMessage(id, "sort-images-list-random", jsonData);
       m_spWsBeamerHandler->SendMessage(id, "sort-images-list-random", jsonData);
    }
}

void CQuizModeSortImages::LoadImages(void)
{
   //init random number generator
   std::srand ( unsigned ( std::time(0) ) );

   //read image files
   const std::string sortImages("sortImages");
   std::stringstream ss;
   ss << m_HttpImagesDir << sortImages;
   DIR* pDir = opendir(ss.str().c_str());
   struct dirent* pDirent = NULL;
   while (NULL != (pDirent = readdir(pDir))) {
      if(0 == strcmp(".", pDirent->d_name)) {
          continue;
      }
      if(0 == strcmp("..", pDirent->d_name)) {
          continue;
      }
      const std::string imageAbs = ss.str() + std::string("/") + std::string(pDirent->d_name);
      const std::string imageRel = sortImages + std::string("/") + std::string(pDirent->d_name); 
      m_Images.push_back(imageRel);
      m_spLogger->info("CQuizModeSortImages [%s][%u] [%s][%s].", __FUNCTION__, __LINE__, imageAbs.c_str(), imageRel.c_str());
   }
   closedir(pDir);

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
        m_spLogger->warning("CQuizModeSimpleButton [%s][%u] ID [%s] not found.", __FUNCTION__, __LINE__, id.c_str());
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
