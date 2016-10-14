#include <thread>
#include <unistd.h>

#include "EchoThread.h"

using namespace std;
using namespace seasocks;

namespace {
  bool    g_Stop    = false;
  thread* g_pThread = NULL;

  class RunnableFromServerThread : public Server::Runnable {
  public:
    RunnableFromServerThread(shared_ptr<Logger> spLogger, shared_ptr<CWsEchoHandler> spWsEchoHandler)
      : m_spLogger(spLogger)
      , m_spWsEchoHandler(spWsEchoHandler)
    {
    }
    
    virtual ~RunnableFromServerThread() 
    {
    }
    
    void run()
    {
      m_spLogger->info("RunnableFromServerThread called");
      m_spWsEchoHandler->TakeSomeInitiative();
    }
    
  private:
    shared_ptr<Logger>         m_spLogger;
    shared_ptr<CWsEchoHandler> m_spWsEchoHandler;
  };

  void CallFromThread(shared_ptr<Server> spServer, shared_ptr<Logger> spLogger, shared_ptr<CWsEchoHandler> spWsEchoHandler) 
  {
    shared_ptr<RunnableFromServerThread> spRunnableFromServerThread(new RunnableFromServerThread(spLogger, spWsEchoHandler));
    spLogger->info("Thread in.");
    while(!g_Stop) {
      spLogger->info("Thread run in.");
      spServer->execute(spRunnableFromServerThread);
      spLogger->info("Thread run out.");
      usleep(7 * 1000 * 1000);
    }
    spLogger->info("Thread out.");
  }
};


void EchoThreadStart(shared_ptr<Server> spServer, shared_ptr<Logger> spLogger, shared_ptr<CWsEchoHandler> spWsEchoHandler)
{
  g_Stop = false;
  g_pThread = new thread(CallFromThread, spServer, spLogger, spWsEchoHandler);
}

void EchoThreadStop(void)
{
  if(NULL == g_pThread) {
    return;
  }
  g_Stop = true;
  g_pThread->join();
  delete g_pThread;
}
