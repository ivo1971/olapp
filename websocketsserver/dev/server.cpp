#include <memory>
#include <string>

#include "seasocks/PrintfLogger.h"
#include "seasocks/Server.h"

#include "CConfigureServer.h"
#include "CWsQuizHandler.h"
#include "CQuizManager.h"

using namespace std;
using namespace seasocks;

int main(int argc, const char* argv[]) {
  //parse arguments
  std::string ipAddressServer;
  {
    bool addrIsNext = false;
    for(int i = 0 ; i < argc ; ++i) {
      if(addrIsNext) {
	ipAddressServer = std::string(argv[i]);
      }
      addrIsNext = (0 == strcmp("--address", argv[i]));
      }
    fprintf(stdout, "local address: %s\n", ipAddressServer.c_str());
    if(0 == ipAddressServer.length()) {
      fprintf(stderr, "no local address configured\n");
      exit(-1);
    }
  }

  //construction
  shared_ptr<Logger>               spLogger             (new PrintfLogger(Logger::DEBUG));
  shared_ptr<Server>               spServer             (new Server(spLogger));
  shared_ptr<CWsQuizHandler>       spWsQuizHandler      (new CWsQuizHandler(spLogger, spServer));
  shared_ptr<CQuizManager>         spQuizManger         (new CQuizManager(spLogger, spWsQuizHandler));
  CConfigureServer                 configureServer      (ipAddressServer);

  //configuration
  spWsQuizHandler->SpSelfSet(spWsQuizHandler);
  spServer->addWebSocketHandler("/quiz",       spWsQuizHandler      );

  //run server
  spServer->serve("./resources/http", 8000);

  //cleanup
  configureServer.Stop();
  spWsQuizHandler->SpSelfClear();

  return 0;
}
