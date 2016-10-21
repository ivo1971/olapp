/*
 * Identify a user not based upon the connection (can change when disconnected)
 * but by using Cordova info: platform and uuid of the device.
 * (https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html)
 * Remark: this might be a problem when testing from multiple browser windows on 1 
 *         desktop --> special debug code to add ...
 *         e.g. http://damien.antipa.at/blog/2014/02/08/3-ways-to-detect-that-your-application-is-running-in-cordova-slash-phonegap/
 */

#include "CTeamMember.h"

CTeamMember::CTeamMember(const std::string& name, const bool connected /* = true */)
  : m_Name(name)
  , m_Connected(connected) 
  , m_Mode("unknown")
{
}

CTeamMember::CTeamMember(const CTeamMember& ref)
  : m_Name(ref.m_Name)
  , m_Connected(ref.m_Connected) 
  , m_Mode(ref.m_Mode)
{
}

CTeamMember::~CTeamMember(void) throw()
{
}

const std::string& CTeamMember::GetName(void) const
{
  return m_Name;
}

bool CTeamMember::GetConnected(void) const
{
  return m_Connected;
}

const std::string& CTeamMember::GetMode(void) const
{
  return m_Mode;
}

void CTeamMember::Update(const CTeamMember& ref)
{
  m_Name      = ref.m_Name;
  m_Connected = ref.m_Connected;
}

void CTeamMember::SetConnected(const bool connected)
{
  m_Connected = connected;
}

void CTeamMember::SetMode(const std::string& mode)
{
  m_Mode = mode;
}
