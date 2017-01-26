#ifndef __CQUIZMODESSIMPLEBUTTON__H__
#define __CQUIZMODESSIMPLEBUTTON__H__

#include <chrono>
#include <functional>
#include <mutex>
#include <set>

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CSimpleButtonInfo.h"
#include "CTeamManager.h"

class CQuizModeSimpleButton : public IQuizMode, public CQuizModeBase {
   private:
      enum ETimerType {
            ETimerTypeReset,
            ETimerTypePush,
      };

   private:
      class CTimerInfo {
            public:
                                                      CTimerInfo(const unsigned int runTimeMilliSec, const ETimerType type, unsigned long long int& sequence, const std::string& extra = std::string());
                                                      CTimerInfo(const CTimerInfo& ref);
                CTimerInfo&                           operator=(const CTimerInfo& ref);

            public:
                bool                                  operator<(const CTimerInfo& ref) const;
                bool                                  IsExpired(const std::chrono::milliseconds& now) const;
                bool                                  IsSequence(const unsigned long long int sequence) const;
                ETimerType                            GetType(void) const;
                std::string                           GetExtra(void) const;

            private:
                std::chrono::milliseconds             m_Expiry;
                unsigned long long int                m_Sequence;
                ETimerType                            m_Type;
                std::string                           m_Extra;
      };
      typedef std::set<CTimerInfo>                    STimerInfo;
      typedef STimerInfo::iterator                    STimerInfoIt;
      typedef STimerInfo::const_pointer               STimerInfoCIt;

   public:
      typedef std::function<void(void)>               FuncDirty;
      class CConfig {
            public:
                                                      CConfig(FuncDirty funcDirty);
                                                      CConfig(const CConfig& ref);
                                                      CConfig(const nlohmann::json& jsonData, FuncDirty funcDirty);
                                                      ~CConfig(void);

            public:
                CConfig&                              operator=(const CConfig& ref);
                nlohmann::json                        ToJson(void) const;
                int                                   GetDelay(void) const;
                int                                   GetPointsGoodThis(void) const;
                int                                   GetPointsGoodOther(void) const;
                int                                   GetPointsBadThis(void) const;
                int                                   GetPointsBadOther(void) const;
                void                                  SetDelay(const int delay);
                void                                  SetPointsGoodThis(const int pointsGoodThis);
                void                                  SetPointsGoodOther(const int pointsGoodOther);
                void                                  SetPointsBadThis(const int pointsBadThis);
                void                                  SetPointsBadOther(const int pointsBadOther);
                void                                  SetAll(const int delay, const int pointsGoodThis, const int pointsGoodOther, const int pointsBadThis, const int pointsBadOther);

            private:
                FuncDirty                             m_FuncDirty;
                int                                   m_Delay;
                int                                   m_PointsGoodThis;
                int                                   m_PointsGoodOther;
                int                                   m_PointsBadThis;
                int                                   m_PointsBadOther;
      };

   public:
                                                      CQuizModeSimpleButton(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, SPTeamManager spTeamManager, const MapUser& users, std::shared_ptr<CQuizModeSimpleButton::CConfig> spSimpleButtonConfig);
      virtual                                         ~CQuizModeSimpleButton(void) throw();

   public:
      virtual void                                    HandleMessageQuiz        (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                    HandleMessageMaster      (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                    HandleMessageBeamer      (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                                    UsersChanged             (const MapUser& users);
      virtual void                                    ReConnect                (const std::string& id);

   private:
      void                                            SendTeamsToMaster        (void);
      void                                            HandleMessageQuizPush    (const std::string& id, const nlohmann::json::const_iterator citJsData);
      void                                            HandleMessageMasterEvent (const std::string& event, const nlohmann::json::const_iterator citJsData);
      void                                            HandleMessageMasterConfig(const nlohmann::json::const_iterator citJsData);
      bool                                            UpdateFirstActive        (std::string* const pTeamName = NULL);
      void                                            SendMessage              (                       const std::string& mi, const nlohmann::json::const_iterator citJsData);
      void                                            SendMessage              (                       const std::string& mi, const nlohmann::json&                data     );
      void                                            SendMessage              (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      void                                            SendMessage              (const std::string& id, const std::string& mi, const nlohmann::json&                data     );
      void                                            ThreadTimer              (void);
      void                                            ThreadTimerHandle        (const STimerInfoIt& it);

   private:
      std::recursive_mutex                            m_Lock;
      bool                                            m_TimerThreadStop;
      std::thread                                     m_TimerThread;
      STimerInfo                                      m_STimerInfo;
      SPTeamManager                                   m_spTeamManager;
      MapUser                                         m_Users;
      MapUser                                         m_UsersNew;
      CSimpleButtonInfo                               m_SimpleButtonInfo;
      bool                                            m_Stopped;
      unsigned long long int                          m_CurrentSequence;
      std::shared_ptr<CQuizModeSimpleButton::CConfig> m_spSimpleButtonConfig;
};

#endif //__CQUIZMODESSIMPLEBUTTON__H__
