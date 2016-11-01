#ifndef __CCONFIGURESERVER__H__
#define __CCONFIGURESERVER__H__

#include <string>
#include <thread>

class CConfigureServer {
 public:
  CConfigureServer(const std::string& ipAddress);
  ~CConfigureServer(void) throw();

 public:
  void Stop(void);

 private:
  void ThreadConfigure(void);

 private:
  std::string m_IpAddress;
  std::thread m_ThreadConfigure;
  bool        m_ThreadStop;
};

#endif //__CCONFIGURESERVER__H__

