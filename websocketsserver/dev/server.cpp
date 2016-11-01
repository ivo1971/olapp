#include <memory>
#include <string>

#include "seasocks/PrintfLogger.h"
#include "seasocks/Server.h"

#include "CConfigureServer.h"
#include "CWsQuizHandler.h"
#include "CQuizManager.h"

using namespace std;
using namespace seasocks;

int main(int /*argc*/, const char* /*argv*/[]) {
  //construction
  shared_ptr<Logger>               spLogger             (new PrintfLogger(Logger::DEBUG));
  shared_ptr<Server>               spServer             (new Server(spLogger));
  shared_ptr<CWsQuizHandler>       spWsQuizHandler      (new CWsQuizHandler(spLogger, spServer));
  shared_ptr<CQuizManager>         spQuizManger         (new CQuizManager(spLogger, spWsQuizHandler));
  const std::string                ipAddressServer      ("ab.cd.ef.gh");
  CConfigureServer                 configureServer      (ipAddressServer);

  //configuration
  spWsQuizHandler->SpSelfSet(spWsQuizHandler);
  spServer->addWebSocketHandler("/quiz",       spWsQuizHandler      );

  //run server
  spServer->serve("/dev/null", 8000);

  //cleanup
  configureServer.Stop();
  spWsQuizHandler->SpSelfClear();

  return 0;
}
