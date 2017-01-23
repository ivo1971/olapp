#include "JsonHelpers.h"

using namespace std;
using namespace nlohmann;

json::const_iterator GetElement(const json& jsonData, const char* const key)
{
  json::const_iterator cit = jsonData.find(key); 
  if(jsonData.end() == cit) {
    throw runtime_error(std::string("Key not found: ") + std::string(key));
  }
  return cit;
}

json::const_iterator GetElement(const json::const_iterator citJsonData, const char* const key)
{
  json::const_iterator cit = citJsonData->find(key); 
  if(citJsonData->end() == cit) {
    throw runtime_error(std::string("Key not found: ") + std::string(key));
  }
  return cit;
}

std::string GetElementString(const json& jsonData, const char* const key)
{
  json::const_iterator cit = GetElement(jsonData, key);
  if(!cit->is_string()) {
    throw runtime_error(std::string("Value for key is not a string: ") + std::string(key));
  }
  return cit->get<string>();
}

std::string GetElementString(const json::const_iterator citJsonData, const char* const key)
{
  json::const_iterator cit = GetElement(citJsonData, key);
  if(!cit->is_string()) {
    throw runtime_error(std::string("Value for key is not a string: ") + std::string(key));
  }
  return cit->get<string>();
}

int GetElementInt(const json& jsonData, const char* const key)
{
  json::const_iterator cit = GetElement(jsonData, key);
  if(!cit->is_number_integer()) {
    throw runtime_error(std::string("Value for key is not an integral: ") + std::string(key));
  }
  return cit->get<int>();
}

int GetElementInt(const json::const_iterator citJsonData, const char* const key)
{
  json::const_iterator cit = GetElement(citJsonData, key);
  if(!cit->is_number_integer()) {
    throw runtime_error(std::string("Value for key is not an integral: ") + std::string(key));
  }
  return cit->get<int>();
}
