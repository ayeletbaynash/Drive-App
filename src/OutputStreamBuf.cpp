#include "OutputStreamBuf.h"
#include <sys/socket.h>
#include <unistd.h>

OutputStreamBuf::OutputStreamBuf(int fd) // Constructor - receives file identifier of open socket
    : socket_fd(fd) {
    setp(buffer, buffer + BUFFER_SIZE);
}

int OutputStreamBuf::overflow(int ch) { // When buffer is full or when a single character needs to be written immediately
    if (sync() == -1) return traits_type::eof(); // Fail

    if (ch != traits_type::eof()) { 
        *pptr() = ch; // Write char into current point
        pbump(1); // Advance output pointer by 1, ready for the next char
    }

    return ch;
}

std::streamsize OutputStreamBuf::xsputn(const char* s, std::streamsize n) { // Handle writing a large sequence of char efficiently.
    ssize_t sent = send(socket_fd, s, n, 0); // Sending n bytes from incoming buffer `s` to socket
    if (sent < 0) return 0; // Fail
    return sent;
}

int OutputStreamBuf::sync() { // All data still in the internal buffer (and not sent) -immediately send to the socket
    ssize_t n = pptr() - pbase(); // Calculate no. of bytes sent using buffer pointers
    if (n > 0) { // There are things to send
        ssize_t sent = send(socket_fd, buffer, n, 0); // Send to socket
        if (sent != n) return -1; // Fail
        pbump(-n); // Reset the buffer 
    }
    return 0;
}
