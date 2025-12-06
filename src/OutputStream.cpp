#include "OutputStream.h"

/** Handles network write wrapping process:
 *  it receives the Socket ID,
 *  initializes our custom Buffer object (OutputStreamBuf) with it,
 *  and then associates this Buffer with the standard C++ output interface (std::ostream).
 */

OutputStream::OutputStream(int socket_fd)
    : std::ostream(&buffer), buffer(socket_fd) {}
