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
{
}

CTeamMember::CTeamMember(const CTeamMember& ref)
  : m_Name(ref.m_Name)
  , m_Connected(ref.m_Connected) 
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

void CTeamMember::Update(const CTeamMember& ref)
{
  m_Name      = ref.m_Name;
  m_Connected = ref.m_Connected;
}

void CTeamMember::SetConnected(const bool connected)
{
  m_Connected = connected;
}
