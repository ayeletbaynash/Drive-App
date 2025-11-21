#ifndef STDINPUT_H
#define STDINPUT_H

#include "IInput.h"
#include <string>

// STDinput implements the IInput interface
class STDinput : public IInput {
public:
    // Reads a full line from standard input (cin)
    std::string Get_input() override;
};

#endif
