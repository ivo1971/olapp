#include <sstream>
#include <unistd.h>

#include "curl/curl.h"

#include "CConfigureServer.h"

CConfigureServer::CConfigureServer(const std::string& ipAddress)
  : m_IpAddress(ipAddress)
  , m_ThreadConfigure(std::thread([=]{ThreadConfigure();}))
  , m_ThreadStop(false)
{
}

CConfigureServer::~CConfigureServer(void) throw()
{
}

void CConfigureServer::Stop(void)
{
  m_ThreadStop = true;
  m_ThreadConfigure.join();
}

void CConfigureServer::ThreadConfigure(void)
{
  fprintf(stdout, "send configure server request thread in\n");

  //curl init
  CURL* const pCurl = curl_easy_init();
  if(!pCurl) {
    fprintf(stderr, "curl_easy_init() failed\n");
    return;
  }

  //loop: send configuration request every X minutes
  while(!m_ThreadStop) {
    fprintf(stdout, "send configure server request\n");
    /* Add headers */ 
    struct curl_slist* pChunk = NULL;
    pChunk = curl_slist_append(pChunk, "olapId: 1234hoedjevanhoedjevan");
    std::stringstream ss;
    ss << "olapIp: " << m_IpAddress;
    pChunk = curl_slist_append(pChunk, ss.str().c_str());
    
    /* Set our custom set of headers */ 
    curl_easy_setopt(pCurl, CURLOPT_HTTPHEADER, pChunk);
    //curl_easy_setopt(pCurl, CURLOPT_URL,        "192.168.0.65:5000/api/address/set");
    curl_easy_setopt(pCurl, CURLOPT_URL,        "http://chilling-coffin-40047.herokuapp.com/api/address/set");
    curl_easy_setopt(pCurl, CURLOPT_VERBOSE,    1L);
 
    const CURLcode res = curl_easy_perform(pCurl);
    if(CURLE_OK != res) {
      fprintf(stderr, "\ncurl_easy_perform() failed: %s\n", curl_easy_strerror(res));
    } else {
      fprintf(stdout, "\nsend configure server request: OK\n");
    }

    /* Free the custom headers */ 
    curl_slist_free_all(pChunk);

    //wait for next run
    const time_t start = std::time(0);
    while(!m_ThreadStop) {
      //check expiry
      const time_t now = std::time(0);
      if((5 * 60) < (now -start)) {
	break;
      }
      usleep(1000 * 1000);
    }
  }

  /* Always cleanup */ 
  curl_easy_cleanup(pCurl);
  
  fprintf(stdout, "send configure server request thread out\n");
}

