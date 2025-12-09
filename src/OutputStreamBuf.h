#ifndef OUTPUT_STREAM_BUF_H
#define OUTPUT_STREAM_BUF_H

#include <streambuf>

/**
 * OutputStreamBuf class custom implementation of std::streambuf designed to write data
 * directly to a network socket (file descriptor).
 *
 * This class overrides the virtual overflow() and xsputn() functions to perform
 * network transmission (send/write) from an internal buffer whenever the C++
 * stream attempts to write data and the buffer capacity is exceeded, or when
 * a buffer flush is explicitly requested (via sync()).
 * This allows a network connection to be treated like a standard C++
 * output stream (e.g., used with std::ostream or std::cout).
 */

class OutputStreamBuf : public std::streambuf {
private:
    int socket_fd;
    static const int BUFFER_SIZE = 1024;
    char buffer[BUFFER_SIZE];

protected:
    virtual int overflow(int ch) override;
    virtual std::streamsize xsputn(const char* s, std::streamsize n) override;
    virtual int sync() override;

public:
    explicit OutputStreamBuf(int fd);
};

#endif
