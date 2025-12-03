#include "Multithreading.h"
#include <iostream>

// Constructor
Multithreading::Multithreading() {}

// Destructor: join all threads
Multithreading::~Multithreading() {
    std::lock_guard<std::mutex> lock(mtx);
    for (auto& t : threads) {
        if (t.joinable()) {
            t.join();
        }
    }
}

// Launch a new task in a separate thread
void Multithreading::launch(std::function<void()> task) {
    std::lock_guard<std::mutex> lock(mtx);
    threads.emplace_back([task]() {
        try {
            task(); // Run the user-provided function
        } catch (const std::exception& e) {
            std::cerr << "Exception in thread: " << e.what() << std::endl;
        } catch (...) {
            std::cerr << "Unknown exception in thread" << std::endl;
        }
    });
}