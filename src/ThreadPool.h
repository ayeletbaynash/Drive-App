#ifndef THREADPOOL_H
#define THREADPOOL_H

#include "IThreads.h"

#include <vector>
#include <thread>
#include <queue>
#include <functional>
#include <mutex>
#include <condition_variable>
#include <atomic>

class ThreadPool : public IThreads {
private:
    // Worker threads
    std::vector<std::thread> workers;

    // Task queue
    std::queue<std::function<void()>> tasks;

    // Synchronization
    std::mutex queueMutex;
    std::condition_variable condition;

    // Stop flag
    std::atomic<bool> stop;

    // Worker thread loop
    void workerLoop();

public:
    explicit ThreadPool(size_t numThreads);
    ~ThreadPool() override;

    // Add a task to the pool
    void launch(std::function<void()> task) override;
};

#endif // THREADPOOL_H
