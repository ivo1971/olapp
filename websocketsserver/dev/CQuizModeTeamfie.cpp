#include <fstream>

#include "CQuizModeTeamfie.h"
#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizModeTeamfie::CQuizModeTeamfie(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users, const std::string& teamfieDir)
   : IQuizMode()
   , CQuizModeBase(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, "teamfie")
   , m_spTeamManager(spTeamManager)
   , m_Users(users)
   , m_TeamfieDir(teamfieDir)
{
}

CQuizModeTeamfie::~CQuizModeTeamfie(void) throw()
{
}

void CQuizModeTeamfie::HandleMessageQuiz(const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
    if("teamfie" == mi) {
        HandleMessageQuizTeamfie(id, citJsData);
    } else {
        m_spLogger->info("CQuizModeTeamfie [%s][%u] MI [%s] unhandled.", __FUNCTION__, __LINE__, mi.c_str());        
    }
}

void CQuizModeTeamfie::HandleMessageMaster(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeTeamfie::HandleMessageBeamer(const std::string& /* id */, const std::string& mi, const nlohmann::json::const_iterator /* citJsData */)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

void CQuizModeTeamfie::UsersChanged(const MapUser& users)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u].", __FUNCTION__, __LINE__);
    m_Users = users;
}

void CQuizModeTeamfie::ReConnect(const std::string& id)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u].", __FUNCTION__, __LINE__);
    CQuizModeBase::ReConnect(id);
}

void CQuizModeTeamfie::HandleMessageQuizTeamfie(const std::string& id, const nlohmann::json::const_iterator citJsData)
{
    m_spLogger->info("CQuizModeTeamfie [%s][%u].", __FUNCTION__, __LINE__);

    //find the user
    MapUserCIt citUser = m_Users.find(id);
    if(m_Users.end() == citUser) {
        //not found
        m_spLogger->warning("CQuizModeTeamfie [%s][%u] ID [%s] not found.", __FUNCTION__, __LINE__, id.c_str());
        return;
    }

    //get the data
    const std::string& teamName   = GetElementString(citJsData, "name" );
    const std::string& teamImage  = GetElementString(citJsData, "image");

    //update team name
    m_spLogger->info("CQuizModeTeamfie [%s][%u] [%s].", __FUNCTION__, __LINE__, teamName.c_str());
    if(0 != teamName.length()) {
        m_spLogger->info("CQuizModeTeamfie [%s][%u].", __FUNCTION__, __LINE__);
        m_spTeamManager->Edit(citUser->second.TeamGet(), teamName);
        //TODO: send team name to all team members
    }

    //handle image
    m_spLogger->info("CQuizModeTeamfie [%s][%u] [%u].", __FUNCTION__, __LINE__, teamImage.length());
    if(0 != teamImage.length()) {
        //write to file
        const std::string teamId   = citUser->second.TeamGet();
        const std::string fileName = GetFileName(m_TeamfieDir, teamId);
        unlink(fileName.c_str());
        std::ofstream f(fileName, std::ofstream::binary);
        if(!f.is_open()) {
            m_spLogger->error("CQuizModeTeamfie [%s][%u] open file [%s] error: .", __FUNCTION__, __LINE__, fileName.c_str());
        } else {
            f << teamImage;
            f.close();
            if(f.bad()) {
                m_spLogger->error("CQuizModeTeamfie [%s][%u] write file [%s] error: .", __FUNCTION__, __LINE__, fileName.c_str());            
            }
        }

        //inform beamer and master
        SendImage(m_spWsMasterHandler, m_TeamfieDir, teamId);
        SendImage(m_spWsBeamerHandler, m_TeamfieDir, teamId);
    }
}

std::string CQuizModeTeamfie::GetFileName(const std::string& teamfieDir, const std::string& teamId)
{
    return teamfieDir + std::string("/") + teamId;
}

void CQuizModeTeamfie::SendImage(std::shared_ptr<CWsQuizHandler> spWsQuizHandler, const std::string& teamfieDir, const std::string& teamId)
{
    //read from file
    const std::string fileName = GetFileName(teamfieDir, teamId);
    std::ifstream f(fileName, std::ifstream::binary);
    if(!f.is_open()) {
        return;
    }
    std::string teamImage;
    f >> teamImage;
    f.close();
    if(f.bad()) {
        return;
    }

    //compose data
    json data;
    data["teamId"] = teamId;
    data["image"]  = teamImage; 

    //send
    spWsQuizHandler->SendMessage("teamfie", data);
}

void CQuizModeTeamfie::SendAllImages(std::shared_ptr<CWsQuizHandler> spWsQuizHandler, const std::string& teamfieDir, const SPTeamManager spTeamManager)
{
    const std::list<std::string> teamIds = spTeamManager->GetAllTeamIds();
    for(auto teamId : teamIds) {
        SendImage(spWsQuizHandler, teamfieDir, teamId);
    }
}
