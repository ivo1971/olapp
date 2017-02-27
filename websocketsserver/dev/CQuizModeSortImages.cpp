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

CQuizModeSortImages::CQuizModeSortImages(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const std::string& httpDir, const std::string& httpImagesDir)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "sort-images")
   , m_spTeamManager(spTeamManager)
   , m_HttpDir(httpDir)
   , m_HttpImagesDir(httpImagesDir)
   , m_Images()
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
   std::stringstream ss;
   ss << m_HttpImagesDir << "sortImages";
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
      const std::string imageRel = imageAbs.substr(m_HttpDir.length() + 1); 
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
