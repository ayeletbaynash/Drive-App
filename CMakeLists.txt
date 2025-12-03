cmake_minimum_required(VERSION 3.10)

project(MyExample)
enable_testing()   # enables ctest

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(${CMAKE_SOURCE_DIR}/src)
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
             src/Output.cpp
             src/RLECompress.cpp
#             src/App.cpp
#             src/SearchCommand.cpp
#             src/GetCommand.cpp
                src/DeleteCommand.cpp
#             tests/Input_test.cpp
#             tests/Output_test.cpp
#             tests/Add_tests.cpp 
#             tests/RLECompress_test.cpp
#             tests/App_tests.cpp
#             tests/GetCommand_tests.cpp
#             tests/Search_test.cpp
#             tests/main_tests.cpp
            tests/Delete_tests.cpp
           )
 target_link_libraries(runTests gtest_main)
# # Register the test with CTest
 #include(GoogleTest)
 #gtest_discover_tests(runTests)

# add_executable(
#     appExec
#     src/Input.cpp
#     src/AddCommand.cpp
#     src/Output.cpp
#     src/RLECompress.cpp
#     src/App.cpp
#     src/SearchCommand.cpp
#     src/GetCommand.cpp
#     src/main.cpp
# )

# wildcard so we dont have to add each file manualy:

#file(GLOB SRC_FILES src/*.cpp)
#list(REMOVE_ITEM SRC_FILES "${CMAKE_SOURCE_DIR}/src/main.cpp")
#file(GLOB TEST_FILES tests/*.cpp)
#add_executable(appExec ${SRC_FILES} src/main.cpp)
#add_executable(runTests ${SRC_FILES} ${TEST_FILES})
#target_link_libraries(runTests gtest_main)
#include(GoogleTest)
#gtest_discover_tests(runTests)
