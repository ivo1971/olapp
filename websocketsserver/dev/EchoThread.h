#ifndef __ECHOTHREAD__H__
#define __ECHOTHREAD__H__

#include <memory>

#include "seasocks/Server.h"

#include "CWsEchoHandler.h"

void EchoThreadStart(std::shared_ptr<seasocks::Server> spServer, std::shared_ptr<seasocks::Logger> spLogger, std::shared_ptr<CWsEchoHandler> spWsEchoHandler);
void EchoThreadStop (void);

#endif //#ifndef __ECHOTHREAD__H__
