#include <memory>
#include <string>

#include "seasocks/PrintfLogger.h"
#include "seasocks/Server.h"

#include "CWsQuizHandler.h"
#include "CQuizManager.h"

using namespace std;
using namespace seasocks;

int main(int /*argc*/, const char* /*argv*/[]) {
  shared_ptr<Logger>               spLogger             (new PrintfLogger(Logger::DEBUG));
  shared_ptr<Server>               spServer             (new Server(spLogger));
  shared_ptr<CWsQuizHandler>       spWsQuizHandler      (new CWsQuizHandler(spLogger, spServer));
  shared_ptr<CQuizManager>         spQuizManger         (new CQuizManager(spLogger, spWsQuizHandler));

  spWsQuizHandler->SpSelfSet(spWsQuizHandler);

  spServer->addWebSocketHandler("/quiz",       spWsQuizHandler      );
  spServer->serve("/dev/null", 8000);

  spWsQuizHandler->SpSelfClear();

  return 0;
}
