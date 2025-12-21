#include <gtest/gtest.h>
#include <thread>
#include <atomic>
#include <vector>
#include <chrono>

#include "IThreads.h"
#include "ThreadPool.h"

class ThreadPoolTest : public ::testing::Test {
protected:
    static constexpr int POOL_SIZE = 3;
    ThreadPool pool{POOL_SIZE};
};

// should execute all tasks submitted to the pool
TEST_F(ThreadPoolTest, ShouldExecuteAllTasksSubmittedToThePool) {
    std::atomic<int> counter{0};
    const int NUM_TASKS = 10;

    for (int i = 0; i < NUM_TASKS; ++i) {
        pool.launch([&counter]() {
            counter++;
        });
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    EXPECT_EQ(counter.load(), NUM_TASKS);
}

// should handle tasks added concurrently from multiple sources
TEST_F(ThreadPoolTest, ShouldHandleTasksAddedConcurrentlyFromMultipleSources) {
    std::atomic<int> counter{0};

    auto submitter = [&]() {
        for (int i = 0; i < 5; ++i) {
            pool.launch([&counter]() {
                counter++;
            });
        }
    };

    std::thread t1(submitter);
    std::thread t2(submitter);

    t1.join();
    t2.join();

    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    EXPECT_EQ(counter.load(), 10);
}

// should correctly shut down without losing tasks
TEST(ThreadPoolShutdownTest, ShouldCorrectlyShutDownWithoutLosingTasks) {
    std::atomic<int> counter{0};

    {
        ThreadPool pool(2);
        for (int i = 0; i < 5; ++i) {
            pool.launch([&counter]() {
                std::this_thread::sleep_for(std::chrono::milliseconds(50));
                counter++;
            });
        }
        // pool goes out of scope here → destructor
    }

    EXPECT_EQ(counter.load(), 5);
}

// should handle empty task queue without crashing
TEST_F(ThreadPoolTest, ShouldHandleEmptyTaskQueue) {
    // Do nothing – no tasks submitted
    std::this_thread::sleep_for(std::chrono::milliseconds(50));

    SUCCEED(); // Test passes if no crash or deadlock occurs
}

// should not exceed the number of threads in the pool
TEST_F(ThreadPoolTest, ShouldNotExceedNumberOfThreadsInPool) {
    std::atomic<int> activeTasks{0};
    std::atomic<int> maxActive{0};

    auto task = [&]() {
        int current = ++activeTasks;
        maxActive.store(std::max(maxActive.load(), current));
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        --activeTasks;
    };

    for (int i = 0; i < 10; ++i) {
        pool.launch(task);
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(300));

    EXPECT_LE(maxActive.load(), POOL_SIZE);
}