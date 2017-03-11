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
   std::string fileName;
   {
      bool fileNameIsNext = false;
      for(int i = 0 ; i < argc ; ++i) {
         if(fileNameIsNext) {
	         fileName = std::string(argv[i]);
         }
         fileNameIsNext = (0 == strcmp("--file-name", argv[i]));
      }
      fprintf(stdout, "file name: %s\n", fileName.c_str());
      if(0 == fileName.length()) {
         fprintf(stderr, "no file name configured\n");
         exit(-1);
      }
   }

   //config 
   const std::string httpDir("./resources/http");

   //construction
   shared_ptr<Logger>               spLogger             (new PrintfLogger(Logger::DEBUG));
   shared_ptr<Server>               spServer             (new Server(spLogger));
   shared_ptr<CWsQuizHandler>       spWsQuizHandler      (new CWsQuizHandler(spLogger, spServer, "client"));
   shared_ptr<CWsQuizHandler>       spWsMasterHandler    (new CWsQuizHandler(spLogger, spServer, "master"));
   shared_ptr<CWsQuizHandler>       spWsBeamerHandler    (new CWsQuizHandler(spLogger, spServer, "beamer"));
   shared_ptr<CQuizManager>         spQuizManger         (new CQuizManager(spLogger, spWsQuizHandler, spWsMasterHandler, spWsBeamerHandler, fileName, httpDir));
   CConfigureServer                 configureServer      (ipAddressServer);

   //configuration
   spWsQuizHandler->SpSelfSet  (spWsQuizHandler  );
   spWsMasterHandler->SpSelfSet(spWsMasterHandler);
   spWsBeamerHandler->SpSelfSet(spWsBeamerHandler);
   spServer->addWebSocketHandler("/quiz",       spWsQuizHandler      );
   spServer->addWebSocketHandler("/master",     spWsMasterHandler    );
   spServer->addWebSocketHandler("/beamer",     spWsBeamerHandler    );

   //run server
   spServer->serve(httpDir.c_str(), 8000);

   //cleanup
   configureServer.Stop();
   spWsQuizHandler->SpSelfClear();
   spWsMasterHandler->SpSelfClear();
   spWsBeamerHandler->SpSelfClear();

   return 0;
}
