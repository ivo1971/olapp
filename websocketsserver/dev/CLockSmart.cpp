#include "CLockSmart.h"

CLockSmart::CLockSmart(std::recursive_mutex* pMutex)
    : m_pLock(pMutex)
{
    m_pLock->lock();
}

CLockSmart::~CLockSmart(void) throw()
{
    m_pLock->unlock();
}
