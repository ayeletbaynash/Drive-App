#ifndef ITHREADS_H
#define ITHREADS_H

#include <functional>

class IThreads {
public:
    virtual ~IThreads() = default;
    
    // Run a task in a new thread 
    virtual void launch(std::function<void()> task) = 0;
};

#endif // ITHREADS_H