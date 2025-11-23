#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H

#include "ICommand.h"
#include <string>
// forward declarations
class ICompress;
class Output;

// AddCommand is a class that inherits from the ICommand interface.
// It is responsible for adding new files to the system.
class AddCommand : public ICommand {
public:
    AddCommand() = default; //constructor
    ~AddCommand() override = default; //destructor - prevents memory leaks
    void execute(const std::string& file_info, ICompress* compressor, Output* output) override;

    };
    #endif