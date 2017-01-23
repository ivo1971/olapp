#include "CQuizModeSimpleButton.h"
#include "JsonHelpers.h"

using namespace nlohmann;

CQuizModeSimpleButton::CConfig::CConfig(void)
    : m_Delay(5)
    , m_PointsGoodThis(2)
    , m_PointsGoodOther(0)
    , m_PointsBadThis(0)
    , m_PointsBadOther(1)
{
}

CQuizModeSimpleButton::CConfig::CConfig(const CConfig& ref)
    : m_Delay(ref.m_Delay)
    , m_PointsGoodThis(ref.m_PointsGoodThis)
    , m_PointsGoodOther(ref.m_PointsGoodOther)
    , m_PointsBadThis(ref.m_PointsBadThis)
    , m_PointsBadOther(ref.m_PointsBadOther)
{
}

CQuizModeSimpleButton::CConfig::CConfig(const nlohmann::json& jsonData)
    : m_Delay(GetElementInt(jsonData, "delay"))
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
