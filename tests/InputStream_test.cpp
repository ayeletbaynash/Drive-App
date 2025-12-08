#include "gtest/gtest.h"
#include "InputStream.h"

#include <sys/socket.h>
#include <unistd.h>
#include <string>

// should read correctly with standard C++ stream functions, and recognize and consume the line separator (\n).
TEST(InputStreamTest, ReadsLineCorrectly)
{
    int sv[2]; // Define array to hold two File Descriptors
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0); // Create a Socket Pair and Check if created successfully

    std::string msg = "hello world\nsecond\n"; // Define data for message
    write(sv[1], msg.c_str(), msg.size()); // Write data into the socket

    InputStream input(sv[0]); // Initializing stream

    std::string line; // Keep in here 
    std::getline(input, line); // Read line

    EXPECT_EQ(line, "hello world"); 

    std::getline(input, line); // Read next line
    EXPECT_EQ(line, "second");

    close(sv[0]);
    close(sv[1]);
}
