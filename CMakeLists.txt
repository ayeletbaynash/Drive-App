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

# Test executable
 add_executable(
             runTests
             src/Input.cpp
             src/AddCommand.cpp
             src/Output.cpp
             src/RLECompress.cpp
             src/App.cpp
             src/SearchCommand.cpp
             src/GetCommand.cpp
             src/DeleteCommand.cpp
             src/InputStream.cpp
             src/InputStreamBuf.cpp
             src/OutputStream.cpp
             src/OutputStreamBuf.cpp
             src/TCPServer.cpp
             src/Multithreading.cpp
             src/PatchCommand.cpp
             tests/Input_test.cpp
             tests/Output_test.cpp
             tests/Add_tests.cpp 
             tests/RLECompress_test.cpp
             tests/App_tests.cpp
             tests/GetCommand_tests.cpp
             tests/Search_test.cpp
             tests/Delete_tests.cpp
             tests/InputStream_test.cpp
             tests/InputStreamBuf_test.cpp
             tests/OutputStream_test.cpp
             tests/OutputStreamBuf_test.cpp
             tests/Multithreading_tests.cpp
             tests/TCPServer_tests.cpp
             tests/Patch_test.cpp

           )
 target_compile_definitions(runTests PRIVATE TEST_MODE)          
 target_link_libraries(runTests gtest_main)
 include(GoogleTest)
 gtest_discover_tests(runTests)

 # App executables
 add_executable(clientCpp
    src/Client_cpp.cpp
    src/Input.cpp
    src/Output.cpp
    src/InputStream.cpp
    src/InputStreamBuf.cpp
    src/OutputStream.cpp
    src/OutputStreamBuf.cpp
)

add_executable(serverExec
    src/TCPServer.cpp
    src/Input.cpp
    src/AddCommand.cpp
    src/Output.cpp
    src/RLECompress.cpp
    src/App.cpp
    src/SearchCommand.cpp
    src/GetCommand.cpp
    src/DeleteCommand.cpp
    src/InputStream.cpp
    src/InputStreamBuf.cpp
    src/OutputStream.cpp
    src/OutputStreamBuf.cpp
    src/Multithreading.cpp
)