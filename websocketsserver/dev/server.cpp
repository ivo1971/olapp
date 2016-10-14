// Copyright (c) 2013-2016, Matt Godbolt
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without 
// modification, are permitted provided that the following conditions are met:
// 
// Redistributions of source code must retain the above copyright notice, this 
// list of conditions and the following disclaimer.
// 
// Redistributions in binary form must reproduce the above copyright notice, 
// this list of conditions and the following disclaimer in the documentation 
// and/or other materials provided with the distribution.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE 
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
// POSSIBILITY OF SUCH DAMAGE.

#include <memory>
#include <string>

#include "seasocks/PrintfLogger.h"
#include "seasocks/Server.h"

#include "CTeamManager.h"
#include "CWsEchoHandler.h"
#include "CWsQuizHandler.h"
#include "CWsQuizMasterHandler.h"
#include "EchoThread.h"

using namespace std;
using namespace seasocks;

int main(int /*argc*/, const char* /*argv*/[]) {
  shared_ptr<Logger>               spLogger             (new PrintfLogger(Logger::DEBUG));
  shared_ptr<CTeamManager>         spTeamManager        (new CTeamManager());
  shared_ptr<Server>               spServer             (new Server(spLogger));
  shared_ptr<CWsEchoHandler>       spWsEchoHandler      (new CWsEchoHandler(spLogger));
  shared_ptr<CWsQuizHandler>       spWsQuizHandler      (new CWsQuizHandler(spLogger, spTeamManager));
  shared_ptr<CWsQuizMasterHandler> spWsQuizMasterHandler(new CWsQuizMasterHandler(spLogger, spTeamManager));
  
  spServer->addWebSocketHandler("/echo",       spWsEchoHandler      );
  spServer->addWebSocketHandler("/quiz",       spWsQuizHandler      );
  spServer->addWebSocketHandler("/quizMaster", spWsQuizMasterHandler);

  //EchoThreadStart(spServer, spLogger, spWsEchoHandler);
  spServer->serve("/dev/null", 8000);
  //EchoThreadStop();

  return 0;
}
