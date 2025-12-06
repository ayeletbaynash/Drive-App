#ifndef MULTITHREADING_H
#define MULTITHREADING_H

#include "IThreads.h"
#include <thread>
#include <vector>
#include <functional>
#include <atomic>
#include <mutex>

class Multithreading : public IThreads {
private:
std::vector<std::thread> threads;  // Vector to store running threads
std::mutex mtx;                    // Protect threads vector
public:
Multithreading();
~Multithreading();

// Launch a new task in a separate thread
void launch(std::function<void()> task) override;

};

#endif // MULTITHREADING_H