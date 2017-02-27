#ifndef __CQUIZMANAGER__H__
#define __CQUIZMANAGER__H__

#include <thread>
#include <time.h>

#include "seasocks/PrintfLogger.h"

#include "CTeamManager.h"
#include "CQuizModeSimpleButton.h"
#include "CUser.h"
#include "CWsQuizHandler.h"
#include "IQuizMode.h"

class CQuizManager {
  private:
  public:
                                                    CQuizManager(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const std::string& fileName, const std::string& httpDir);
                                                    ~CQuizManager(void) throw();

  private:
    void                                            HandleMessageQuiz     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
    void                                            HandleDisconnectQuiz  (const std::string& id);
    void                                            HandleMessageMaster   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
    void                                            HandleDisconnectMaster(const std::string& id);
    void                                            HandleMessageBeamer   (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
    void                                            HandleDisconnectBeamer(const std::string& id);
    void                                            HandleMiLoadImgBase64 (std::shared_ptr<CWsQuizHandler> spWsQuizHandler, const std::string& id, const nlohmann::json::const_iterator citJsData);
    void                                            SelectMode            (const std::string& mode);
    void                                            SendTeam              (const std::string& userId);
    void                                            Save                  (void) const;
    void                                            Load                  (void);
    void                                            SendTeamsToAll        (void);
    void                                            SendTeamsToOne        (std::shared_ptr<CWsQuizHandler> spWsHandler, const std::string& id);
    void                                            SendMessageAll        (                       const std::string& mi, const nlohmann::json::const_iterator citJsData);
    void                                            SendMessageAll        (                       const std::string& mi, const nlohmann::json&                data     );
    void                                            SendMessageAll        (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
    void                                            SendMessageAll        (const std::string& id, const std::string& mi, const nlohmann::json&                data     );

  private:
    std::shared_ptr<seasocks::Logger>               m_spLogger;
    std::shared_ptr<CWsQuizHandler>                 m_spWsQuizHandler;
    std::shared_ptr<CWsQuizHandler>                 m_spWsMasterHandler;
    std::shared_ptr<CWsQuizHandler>                 m_spWsBeamerHandler;
    boost::signals2::connection                     m_WsQuizHandlerMessageConnection;
    boost::signals2::connection                     m_WsQuizHandlerDisconnectConnection;
    boost::signals2::connection                     m_WsMasterHandlerMessageConnection;
    boost::signals2::connection                     m_WsMasterHandlerDisconnectConnection;
    boost::signals2::connection                     m_WsBeamerHandlerMessageConnection;
    boost::signals2::connection                     m_WsBeamerHandlerDisconnectConnection;
    std::mutex                                      m_Lock;
    MapUser                                         m_Users;
    std::unique_ptr<IQuizMode>                      m_CurrentQuizMode;
    std::string                                     m_FileName;
    std::string                                     m_TeamfieDir;
    std::string                                     m_HttpDir;
    std::string                                     m_HttpImagesDir;
    CQuizModeSimpleButton::FuncDirty                m_DirtySimpleButtonConfig;
    CTeamManager::FuncDirty                         m_DirtyTeamManager;
    std::shared_ptr<CQuizModeSimpleButton::CConfig> m_spSimpleButtonConfig;
    SPTeamManager                                   m_spTeamManager;
};

#endif //__CQUIZMANAGER__H__
