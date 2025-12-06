#include "gtest/gtest.h"
#include "OutputStream.h"

#include <sys/socket.h>
#include <unistd.h>
#include <string>

// Should write correctly with standard C++ stream functions and ensure data is sent to the socket
TEST(OutputStreamTest, SendsLinesCorrectly)
{
    int sv[2]; // Define array to hold two File Descriptors
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0); // Create a Socket Pair and Check if created successfully

    OutputStream out(sv[0]); // Initializing stream

    out << "line1\n"; // Write into the output stream that uses the buf
    out.flush(); // Clean the buff by pushing strate into sv[1]

    char buffer[64] = {0}; // Create empty array
    read(sv[1], buffer, sizeof(buffer));// Read from sv[1] into buffer 64 bytes

    EXPECT_STREQ(buffer, "line1\n");

    close(sv[0]);
    close(sv[1]);
}
