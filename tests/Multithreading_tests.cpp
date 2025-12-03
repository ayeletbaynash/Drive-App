#include <gtest/gtest.h>
#include <thread>
#include <atomic>
#include <vector>
#include <chrono>
#include "IThreads.h"
#include "Multithreading.h"

class MultithreadingTest : public ::testing::Test {
protected:
    Multithreading mt;
};

// Should create a new thread for each submitted task
TEST_F(MultithreadingTest, CreatesNewThreadForEachTask) {
    std::atomic<int> counter{0};
    
    mt.launch([&counter]() { counter++; });
    mt.launch([&counter]() { counter++; });

    // Give threads some time to execute
    std::this_thread::sleep_for(std::chrono::milliseconds(50));

    EXPECT_EQ(counter.load(), 2);
}

// Should execute tasks concurrently without blocking others
TEST_F(MultithreadingTest, ExecutesTasksConcurrently) {
    std::atomic<int> counter{0};

    auto task = [&counter]() {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        counter++;
    };

    auto start = std::chrono::steady_clock::now();
    mt.launch(task);
    mt.launch(task);

    // Wait slightly longer than a single thread duration
    std::this_thread::sleep_for(std::chrono::milliseconds(150));
    auto duration = std::chrono::steady_clock::now() - start;

    EXPECT_EQ(counter.load(), 2);
    // If tasks ran truly in parallel, total time should be ~100ms, not 200ms
    EXPECT_LT(std::chrono::duration_cast<std::chrono::milliseconds>(duration).count(), 200);
}

// Should correctly join or detach threads
TEST_F(MultithreadingTest, JoinsOrDetachesThreads) {
    std::atomic<bool> finished{false};

    mt.launch([&finished]() { finished = true; });
    std::this_thread::sleep_for(std::chrono::milliseconds(50));

    EXPECT_TRUE(finished.load());
    // If Multithreading joins threads, they finish without leaving dangling threads
}

// Should repeat Launch without crashes
TEST_F(MultithreadingTest, RepeatedLaunchWorks) {
    const int NUM_TASKS = 5;
    std::atomic<int> counter{0};

    for(int i = 0; i < NUM_TASKS; ++i) {
        mt.launch([&counter]() { counter++; });
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    EXPECT_EQ(counter.load(), NUM_TASKS);
}