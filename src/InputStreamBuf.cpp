#include "InputStreamBuf.h"
#include <unistd.h>
#include <sys/socket.h>

InputStreamBuf::InputStreamBuf(int fd) // Constructor - receives file identifier of open socket
    : socket_fd(fd) {
    setg(buffer, buffer, buffer); // Start empty
}

int InputStreamBuf::underflow() { // Refill the buffer when empty
    ssize_t bytes = recv(socket_fd, buffer, BUFFER_SIZE, 0); // Reading and saving

    if (bytes <= 0) { 
        return traits_type::eof(); // Connection closed or error
    }

    setg(buffer, buffer, buffer + bytes); // Update buffer
    return traits_type::to_int_type(*gptr()); // Return first character
}
