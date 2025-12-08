#include "gtest/gtest.h"
#include "InputStreamBuf.h"

#include <sys/socket.h>
#include <unistd.h>
#include <string>

//1. should read a single word correctly
TEST(InputStreamBufTest, ReadsSingleWord)
{
    int sv[2]; // Define array to hold two File Descriptors
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0); // Create a Socket Pair and Check if created successfully

    const char* msg = "Hello\n";        // Define data for message
    write(sv[1], msg, strlen(msg));     // Write data into the socket

    InputStreamBuf buf(sv[0]); // Create instance- uses the FD of the "read" side of the Socket
    std::istream is(&buf); // Create inputstream object using inputstreambuf

    std::string out; // keep in here 
    is >> out;   // reads until whitespace

    EXPECT_EQ(out, "Hello");

    close(sv[0]);
    close(sv[1]);
}

//2. should read a full sentance correctly
TEST(InputStreamBufTest, ReadsFullSentenceWithSpaces)
{
    int sv[2]; // Define array to hold two File Descriptors
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0); // Create a Socket Pair and Check if created successfully

    std::string sentence = "this is a full sentence"; // Define data for message
    write(sv[1], sentence.c_str(), sentence.size()); // Write data into the socket

    InputStreamBuf buf(sv[0]); // Initializing the streambuf 
    std::istream is(&buf);     // And the stream

    char buffer[128]; // Create buffer array
    is.read(buffer, sentence.size()); // Read exact no. of bytes from stream
    buffer[sentence.size()] = '\0'; // Add end to buffer

    EXPECT_EQ(std::string(buffer), sentence);

    close(sv[0]);
    close(sv[1]);
}

//3. should return end of file after all data from the Socket has been read
TEST(InputStreamBufTest, ReturnsEOFWhenNoMoreData)
{
    int sv[2]; // Define array to hold two File Descriptors
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0); // Create a Socket Pair and Check if created successfully

    write(sv[1], "A", 1); // Write data into the socket
    close(sv[1]); // Close to signal EOF

    InputStreamBuf buf(sv[0]); // Initealize streambuf

    EXPECT_NE(buf.sgetc(), EOF); // First read returns 'A'

    buf.sbumpc(); // Move buf pointer forwords to consume it

    EXPECT_EQ(buf.sgetc(), EOF); // Now should be EOF

    close(sv[0]);
}
