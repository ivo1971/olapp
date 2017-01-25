#include "CQuizModeSimpleButton.h"
#include "JsonHelpers.h"

using namespace nlohmann;

CQuizModeSimpleButton::CConfig::CConfig(std::function<void(void)> funcDirty)
    : m_FuncDirty(funcDirty)
    , m_Delay(5)
    , m_PointsGoodThis(2)
    , m_PointsGoodOther(0)
    , m_PointsBadThis(0)
    , m_PointsBadOther(1)
{
}

CQuizModeSimpleButton::CConfig::CConfig(const CConfig& ref)
    : m_FuncDirty(ref.m_FuncDirty)
    , m_Delay(ref.m_Delay)
    , m_PointsGoodThis(ref.m_PointsGoodThis)
    , m_PointsGoodOther(ref.m_PointsGoodOther)
    , m_PointsBadThis(ref.m_PointsBadThis)
    , m_PointsBadOther(ref.m_PointsBadOther)
{
}

CQuizModeSimpleButton::CConfig::CConfig(const nlohmann::json& jsonData, std::function<void(void)> funcDirty)
    : m_FuncDirty(funcDirty)
    , m_Delay(GetElementInt(jsonData, "delay"))
    , m_PointsGoodThis(GetElementInt(jsonData, "pointsGoodThis"))
    , m_PointsGoodOther(GetElementInt(jsonData, "pointsGoodOther"))
    , m_PointsBadThis(GetElementInt(jsonData, "pointsBadThis"))
    , m_PointsBadOther(GetElementInt(jsonData, "pointsBadOther"))
{
}

CQuizModeSimpleButton::CConfig::~CConfig(void)
{
}

CQuizModeSimpleButton::CConfig& CQuizModeSimpleButton::CConfig::operator=(const CConfig& ref)
{
    if(this == &ref) return *this;
    m_FuncDirty       = ref.m_FuncDirty;
    m_Delay           = ref.m_Delay;
    m_PointsGoodThis  = ref.m_PointsGoodThis;
    m_PointsGoodOther = ref.m_PointsGoodOther;
    m_PointsBadThis   = ref.m_PointsBadThis;
    m_PointsBadOther  = ref.m_PointsBadOther;
    return *this;
}

nlohmann::json CQuizModeSimpleButton::CConfig::ToJson(void) const
{
  json data;
  data["delay"]           = m_Delay;
  data["pointsGoodThis"]  = m_PointsGoodThis;
  data["pointsGoodOther"] = m_PointsGoodOther;
  data["pointsBadThis"]   = m_PointsBadThis;
  data["pointsBadOther"]  = m_PointsBadOther;
  return data;
}

int  CQuizModeSimpleButton::CConfig::GetDelay(void) const
{
    return m_Delay;
}

int  CQuizModeSimpleButton::CConfig::GetPointsGoodThis(void) const
{
    return m_PointsGoodThis;
}

int  CQuizModeSimpleButton::CConfig::GetPointsGoodOther(void) const
{
    return m_PointsGoodOther;
}

int  CQuizModeSimpleButton::CConfig::GetPointsBadThis(void) const
{
    return m_PointsBadThis;
}

int  CQuizModeSimpleButton::CConfig::GetPointsBadOther(void) const
{
    return m_PointsBadOther;
}

void CQuizModeSimpleButton::CConfig::SetDelay(const int delay)
{
    m_Delay = delay;
    m_FuncDirty();
}

void CQuizModeSimpleButton::CConfig::SetPointsGoodThis(const int pointsGoodThis)
{
    m_PointsGoodThis  = pointsGoodThis;
    m_FuncDirty();
}

void CQuizModeSimpleButton::CConfig::SetPointsGoodOther(const int pointsGoodOther)
{
    m_PointsGoodOther = pointsGoodOther;
    m_FuncDirty();
}

void CQuizModeSimpleButton::CConfig::SetPointsBadThis(const int pointsBadThis)
{
    m_PointsBadThis   = pointsBadThis;
    m_FuncDirty();
}

void CQuizModeSimpleButton::CConfig::SetPointsBadOther(const int pointsBadOther)
{
    m_PointsBadOther  = pointsBadOther;
    m_FuncDirty();
}

void CQuizModeSimpleButton::CConfig::SetAll(const int delay, const int pointsGoodThis, const int pointsGoodOther, const int pointsBadThis, const int pointsBadOther)
{
    m_Delay           = delay;
    m_PointsGoodThis  = pointsGoodThis;
    m_PointsGoodOther = pointsGoodOther;
    m_PointsBadThis   = pointsBadThis;
    m_PointsBadOther  = pointsBadOther;
    m_FuncDirty();
}

