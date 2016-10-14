/*
 * Identify a user not based upon the connection (can change when disconnected)
 * but by using Cordova info: platform and uuid of the device.
 * (https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html)
 * Remark: this might be a problem when testing from multiple browser windows on 1 
 *         desktop --> special debug code to add ...
 *         e.g. http://damien.antipa.at/blog/2014/02/08/3-ways-to-detect-that-your-application-is-running-in-cordova-slash-phonegap/
 */

#include "CTeamMember.h"

CTeamMember::CTeamMember(const std::string& name)
  : m_Name(name)
{
}

CTeamMember::~CTeamMember(void) throw()
{
}

const std::string& CTeamMember::GetName(void) const
{
  return m_Name;
}
