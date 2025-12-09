#ifndef INPUT_STREAM_H
#define INPUT_STREAM_H

#include <istream>
#include "InputStreamBuf.h"

/**
 * InputStream class provides a standard C++ input stream interface (std::istream)
 * for reading data directly from a network socket (file descriptor).
 *
 * This class achieves network stream abstraction by composition: it holds
 * an instance of the custom **InputStreamBuf** class, which is a
 * specialized **std::streambuf**.
 *
 * The InputStreamBuf handles the low-level communication (performing
 * the 'recv' call on the socket) whenever the higher-level std::istream
 * methods (like the extraction operator '>>' or 'getline') require new data.
 *
 * This design pattern effectively treats a network connection as if it were a
 * file or a standard console input, enabling easy and familiar parsing of
 * network protocol data.
 */

class InputStream : public std::istream {

public:
    explicit InputStream(int socket_fd);
private:
    InputStreamBuf buffer;
};

#endif
