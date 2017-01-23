#ifndef __JSONHELPERS__H__
#define __JSONHELPERS__H__

#include "json.hpp"

nlohmann::json::const_iterator GetElement      (const nlohmann::json& jsonData,                   const char* const key);
nlohmann::json::const_iterator GetElement      (const nlohmann::json::const_iterator citJsonData, const char* const key);
std::string                    GetElementString(const nlohmann::json& jsonData,                   const char* const key);
std::string                    GetElementString(const nlohmann::json::const_iterator citjsonData, const char* const key);
int                            GetElementInt   (const nlohmann::json& jsonData,                   const char* const key);
int                            GetElementInt   (const nlohmann::json::const_iterator citjsonData, const char* const key);

#endif //#ifndef __JSONHELPERS__H__
