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

#include "seasocks/PrintfLogger.h"
#include "seasocks/Server.h"
#include "seasocks/StringUtil.h"
#include "seasocks/WebSocket.h"

#include <cstring>
#include <iostream>
#include <memory>
#include <set>
#include <sstream>
#include <string>
#include <unistd.h>


#include <thread>

/* Simple server that echo any text or binary WebSocket messages back. */

using namespace seasocks;
using namespace std;

bool g_Stop = false;

class CEchoHandler: public WebSocket::Handler {
public:
  CEchoHandler(shared_ptr<Logger> logger) 
    : m_Logger(logger)
    , m_Connections()
  {
    m_Logger->info("Echo handler constructed.\n");
  }

public:
  virtual void onConnect(WebSocket* pConnection) override {
    m_Logger->info("Echo handler onConnect.\n");
    m_Connections.insert(pConnection);
  }

  virtual void onData(WebSocket* /* pConnection */, const uint8_t* pData, size_t length) override {
    //pConnection->send(data, length); // binary
    m_Logger->info("Echo handler onData binary.\n");
    for(auto pConnection : m_Connections) {
      pConnection->send(pData, length);
    }
  }

  virtual void onData(WebSocket* /* pConnection */, const char* pData) override {
    //pConnection->send(data); // text
    m_Logger->info("Echo handler onData text [%s].\n", pData);
    for(auto pConnection : m_Connections) {
      pConnection->send(pData);
    }
  }

  virtual void onDisconnect(WebSocket* pConnection) override {
    m_Logger->info("Echo handler onDisconnect.\n");
    m_Connections.erase(pConnection);
  }

  void TakeSomeInitiative(void) {
    m_Logger->info("Echo handler taking some initiative.\n");
    for(auto pConnection : m_Connections) {
      pConnection->send("{\"type\":\"server\",\"message\":\"server initiative\"}");
    }
  }

private:
  shared_ptr<Logger> m_Logger;
  set<WebSocket*>    m_Connections;
};

class RunnableFromServerThread : public Server::Runnable {
public:
  RunnableFromServerThread(shared_ptr<CEchoHandler> spEchoHandler)
    : m_spEchoHandler(spEchoHandler)
  {
  }

  virtual ~RunnableFromServerThread() 
  {
  }

  void run()
  {
    cout << "RunnableFromServerThread run" << std::endl;
    m_spEchoHandler->TakeSomeInitiative();
  }

private:
  shared_ptr<CEchoHandler> m_spEchoHandler;
};

void ExecuteFromServerThread(void)
{
  cout << "Execute from server thread" << std::endl;
}

void CallFromThread(Server* const pServer, shared_ptr<CEchoHandler> spEchoHandler) 
{
  shared_ptr<RunnableFromServerThread> spRunnableFromServerThread(new RunnableFromServerThread(spEchoHandler));
  cout << "Thread in" << std::endl;
  while(!g_Stop) {
    cout << "Hello, World in" << std::endl;
    pServer->execute(ExecuteFromServerThread);
    pServer->execute(spRunnableFromServerThread);
    cout << "Hello, World out" << std::endl;
    usleep(7 * 1000 * 1000);
  }
  cout << "Thread out" << std::endl;
}

int main(int /*argc*/, const char* /*argv*/[]) {
  shared_ptr<Logger> logger(new PrintfLogger(Logger::DEBUG));
  Server server(logger);
  
  std::shared_ptr<CEchoHandler> echoHandler(new CEchoHandler(logger));
  server.addWebSocketHandler("/echo", echoHandler);

  g_Stop = false;
  thread t1(CallFromThread, &server, echoHandler);

  server.serve("/dev/null", 8000);

  g_Stop = true;
  t1.join();

  return 0;
}
