#ifndef INPUT_STREAM_BUF_H
#define INPUT_STREAM_BUF_H

#include <streambuf>

/**
 * InputStreamBuf class custom implementation of std::streambuf designed to read data
 * directly from a network socket (file descriptor).
 *
 * This class overrides the virtual underflow() function to perform
 * network reception (recv) into an internal buffer whenever the C++
 * stream attempts to read data and the existing buffer is empty.
 * This allows a network connection to be treated like a standard C++
 * input stream (e.g., used with std::istream or std::cin).
 */

class InputStreamBuf : public std::streambuf {
private:
    int socket_fd;
    static const int BUFFER_SIZE = 1024;
    char buffer[BUFFER_SIZE];

protected:
    // Called when buffer is empty and we need to recv() more data
    virtual int underflow() override;

public:
    explicit InputStreamBuf(int fd);
};

#endif
