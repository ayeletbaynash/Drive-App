#ifndef IINPUT_H
#define IINPUT_H

#include <string>

// Abstract interface for receiving input in the system.
// implements Get_input(), which returns user input as string.
class IInput {
public:
    virtual ~IInput() = default; //for destructor

    virtual std::string Get_input() = 0; // Receives input from input source and returns it as a string.
};

#endif
