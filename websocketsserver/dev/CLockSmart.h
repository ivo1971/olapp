#ifndef __LOCKSMART__H__
#define __LOCKSMART__H__

#include <mutex>

class CLockSmart {
    public:
                                            CLockSmart(std::recursive_mutex* pMutex);
                                            ~CLockSmart(void) throw();

    private:
      std::recursive_mutex* const           m_pLock;
};

#endif //__LOCKSMART__H__
