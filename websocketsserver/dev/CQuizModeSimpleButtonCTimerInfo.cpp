#include "CLockSmart.h"
#include "CQuizModeSimpleButton.h"
#include "CSimpleButtonInfo.h"
#include "JsonHelpers.h"
#include "Typedefs.h"

CQuizModeSimpleButton::CTimerInfo::CTimerInfo(const unsigned int runTimeMilliSec, const ETimerType type, unsigned long long int& sequence)
  : m_Expiry(std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()) + std::chrono::milliseconds(runTimeMilliSec))
  , m_Sequence(++sequence)
  , m_Type(type)
{
}

CQuizModeSimpleButton::CTimerInfo::CTimerInfo(const CTimerInfo& ref)
  : m_Expiry(ref.m_Expiry)
  , m_Sequence(ref.m_Sequence)
  , m_Type(ref.m_Type)
{
}

CQuizModeSimpleButton::CTimerInfo& CQuizModeSimpleButton::CTimerInfo::operator=(const CQuizModeSimpleButton::CTimerInfo& ref)
{
    if(this == &ref) return *this;
    m_Expiry   = ref.m_Expiry;
    m_Sequence = ref.m_Sequence;
    m_Type     = ref.m_Type;
    return *this;
}

bool CQuizModeSimpleButton::CTimerInfo::operator<(const CQuizModeSimpleButton::CTimerInfo& ref) const
{
    return m_Expiry < ref.m_Expiry;
}

bool CQuizModeSimpleButton::CTimerInfo::IsExpired(const std::chrono::milliseconds& now) const
{
    return now >= m_Expiry;
}

bool CQuizModeSimpleButton::CTimerInfo::IsSequence(const unsigned long long int sequence) const
{
  return sequence == m_Sequence;
}

CQuizModeSimpleButton::ETimerType CQuizModeSimpleButton::CTimerInfo::GetType(void) const
{
  return m_Type;
}
