cmake_minimum_required(VERSION 3.10)

project(MyExample)
enable_testing()   # enables ctest

set(CMAKE_CXX_STANDARD 11)

include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

#for windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(
            runTests
            src/Input.cpp
            src/AddCommand.cpp
            tests/Input_test.cpp
            tests/Output_test.cpp
            tests/add_tests.cpp 
            tests/RLEcompress_test.cpp)
target_link_libraries(runTests gtest_main)
# Register the test with CTest
include(GoogleTest)
gtest_discover_tests(runTests)