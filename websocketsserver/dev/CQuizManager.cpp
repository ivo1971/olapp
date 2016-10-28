#include "json.hpp"

#include "CQuizManager.h"

using namespace std;
using namespace nlohmann;
using namespace seasocks;

CQuizManager::CQuizManager(std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsQuizHandler> spWsQuizHandler)
  : m_spLogger(spLogger)
  , m_spWsQuizHandler(spWsQuizHandler)
  , m_WsQuisHandlerMessageConnection(m_spWsQuizHandler->ConnectSignalMessage(boost::bind(&CQuizManager::HandleMessageQuiz, this, _1, _2)))
{
}

CQuizManager::~CQuizManager(void) throw()
{
}

void CQuizManager::HandleMessageQuiz(const std::string mi, const json::const_iterator citJsData)
{
  m_spLogger->info("CQuizManager [%s][%u] MI [%s].", __FUNCTION__, __LINE__, mi.c_str());
}

