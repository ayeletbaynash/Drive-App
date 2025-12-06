#include "InputStream.h"

/** Handles network read wrapping process:
 *  it receives the Socket ID,
 *  initializes our custom Buffer object (InputStreamBuf) with it,
 *  and then associates this Buffer with the standard C++ input interface (std::istream).
 */
InputStream::InputStream(int socket_fd)
    : std::istream(&buffer), buffer(socket_fd) {}
