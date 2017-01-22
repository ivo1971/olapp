#ifndef __CQUIZMODESSIMPLEBUTTON__H__
#define __CQUIZMODESSIMPLEBUTTON__H__

#include <chrono>
#include <mutex>
#include <set>

#include "IQuizMode.h"
#include "CQuizModeBase.h"
#include "CSimpleButtonInfo.h"

class CQuizModeSimpleButton : public IQuizMode, public CQuizModeBase {
   private:
      enum ETimerType {
            ETimerTypeReset,
            ETimerTypePush,
      };

   private:
      class CTimerInfo {
            public:
                                            CTimerInfo(const unsigned int runTimeMilliSec, const ETimerType type, unsigned long long int& sequence);
                                            CTimerInfo(const CTimerInfo& ref);
                CTimerInfo&                 operator=(const CTimerInfo& ref);

            public:
                bool                        operator<(const CTimerInfo& ref) const;
                bool                        IsExpired(const std::chrono::milliseconds& now) const;
                bool                        IsSequence(const unsigned long long int sequence) const;
                ETimerType                  GetType(void) const;

            private:
                std::chrono::milliseconds   m_Expiry;
                unsigned long long int      m_Sequence;
                ETimerType                  m_Type;
      };
      typedef std::set<CTimerInfo>          STimerInfo;
      typedef STimerInfo::iterator          STimerInfoIt;
      typedef STimerInfo::const_pointer     STimerInfoCIt;

   public:
                                            CQuizModeSimpleButton(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler, std::shared_ptr<CWsQuizHandler> spWsMasterHandler, std::shared_ptr<CWsQuizHandler> spWsBeamerHandler, const MapTeam& teams, const MapUser& users);
      virtual                               ~CQuizModeSimpleButton(void) throw();

   public:
      virtual void                          HandleMessageQuiz       (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageMaster     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          HandleMessageBeamer     (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      virtual void                          TeamsChanged            (const MapTeam& teams);
      virtual void                          UsersChanged            (const MapUser& users);
      virtual void                          ReConnect               (const std::string& id);

   private:
      void                                  HandleMessageQuizPush   (const std::string& id, const nlohmann::json::const_iterator citJsData);
      void                                  HandleMessageMasterEvent(const std::string& event, const nlohmann::json::const_iterator citJsData);
      void                                  UpdateFirstActive       (void);
      void                                  SendMessage             (                       const std::string& mi, const nlohmann::json::const_iterator citJsData);
      void                                  SendMessage             (                       const std::string& mi, const nlohmann::json&                data     );
      void                                  SendMessage             (const std::string& id, const std::string& mi, const nlohmann::json::const_iterator citJsData);
      void                                  SendMessage             (const std::string& id, const std::string& mi, const nlohmann::json&                data     );
      void                                  ThreadTimer             (void);

   private:
      std::mutex                            m_Lock;
      bool                                  m_TimerThreadStop;
      std::thread                           m_TimerThread;
      STimerInfo                            m_STimerInfo;
      MapTeam                               m_Teams;
      MapTeam                               m_TeamsNew;
      MapUser                               m_Users;
      MapUser                               m_UsersNew;
      CSimpleButtonInfo                     m_SimpleButtonInfo;
      bool                                  m_Stopped;
      unsigned long long int                m_CurrentSequence;
};

#endif //__CQUIZMODESSIMPLEBUTTON__H__
