#ifndef APP_H
#define APP_H

#include <string>
#include <map>
#include "Input.h"
#include "Output.h"
#include "ICommand.h"
#include "ICompress.h"

class App {
public:
    // Constructor: inject dependencies
    App(Input* input, Output* output, ICompress* compressor, std::map<std::string, ICommand*> commands);

    // Main execution loop
    void Run();

private:
    Input* input;                    // pointer to input interface
    Output* output;                  // pointer to output interface
    ICompress* compressor;           // pointer to compression handler
    std::map<std::string, ICommand*> commands;  // map of command name → ICommand
};

#endif // APP_H
