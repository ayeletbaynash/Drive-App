#include "gtest/gtest.h"
#include "OutputStreamBuf.h"

#include <sys/socket.h>
#include <unistd.h>
#include <string>

// 1. Should correctly write a single word from the stream to the socket
TEST(OutputStreamBufTest, WritesDataToPeer)
{
    int sv[2]; // Define array to hold two File Descriptors
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0); // Create a Socket Pair and Check if created successfully

    OutputStreamBuf buf(sv[0]); //Create object and initialize with the writing side of the socket
    std::ostream os(&buf);

    os << "Hello"; // Write into the output stream that uses the buf
    os.flush(); // Clean the buff by pushing strate into sv[0]

    char buffer[16] = {0}; // Create empty array
    read(sv[1], buffer, sizeof(buffer)); // Read from sv[1] into buffer 16 bytes

    EXPECT_STREQ(buffer, "Hello");

    close(sv[0]);
    close(sv[1]);
}

// 2. Should correctly write a full sentance from the stream to the socket
TEST(OutputStreamBufTest, WriteFullSentenceWithSpaces)
{
    int sv[2]; // Define array to hold two File Descriptors
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0); // Create a Socket Pair and Check if created successfully

    OutputStreamBuf buf(sv[0]); //Create object and initialize with the writing side of the socket
    std::ostream os(&buf);

    os << "this is a full sentence"; // Write into the output stream that uses the buf
    os.flush(); // Clean the buff by pushing strate into sv[0]

    char buffer[30] = {0}; // Create empty array
    read(sv[1], buffer, sizeof(buffer)); // Read from sv[1] into buffer 16 bytes

    EXPECT_STREQ(buffer, "this is a full sentence");

    close(sv[0]);
    close(sv[1]);
}