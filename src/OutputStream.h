#ifndef OUTPUT_STREAM_H
#define OUTPUT_STREAM_H

#include <ostream>
#include "OutputStreamBuf.h"

/**
 * @class OutputStream
 * @brief Provides a standard C++ output stream interface (std::ostream)
 * for writing data directly to a network socket (file descriptor).
 *
 * This class achieves network stream abstraction through **composition**
 * and **inheritance**:
 * 1. **Inheritance (std::ostream):** It inherits the high-level stream
 *    interface (like the insertion operator '<<' and the 'write' function).
 * 2. **Composition (OutputStreamBuf):** It holds an instance of the custom
 *    **OutputStreamBuf** class, which is a specialized **std::streambuf**.
 *
 * The `OutputStreamBuf` is responsible for handling the low-level communication
 * (performing the 'send' call on the socket) whenever the higher-level
 * std::ostream methods write data.
 *
 * This design pattern effectively treats a network connection as if it were a
 * standard console output or a file, enabling easy and familiar formatting
 * and transmission of network protocol data.
 */

class OutputStream : public std::ostream {
private:
    OutputStreamBuf buffer;

public:
    explicit OutputStream(int socket_fd);
};

#endif
