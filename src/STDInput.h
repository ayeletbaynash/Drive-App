#ifndef STDINPUT_H
#define STDINPUT_H

#include "IInput.h"
#include <string>

// STDInput is a class that inherits from the IInput interface.
// It is responsible for recieving new files to the system.
class STDInput : public IInput {
public:
    // Reads a full line from standard input (cin)
    std::string Get_input() override;
};

#endif
