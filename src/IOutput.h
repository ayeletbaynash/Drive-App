#ifndef IOUTPUT_H
#define IOUTPUT_H

#include <string>

// Abstract interface for printing output in the system.
// Classes implementing this interface must provide a concrete
// implementation for Print(string), which prints the string to
// the appropriate destination (console, file, network, etc.)
class IOutput {
public:
    virtual ~IOutput() = default; //for destructor
    virtual void Print(const std::string& text) = 0; // Prints the given string to the output destination
};

#endif
