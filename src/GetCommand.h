#ifndef GETCOMMAND_H
#define GETCOMMAND_H

#include "ICommand.h"
#include <string>
// forward declarations
class ICompress;
class Output;

// GetCommand is a class that inherits from the ICommand interface.
// It is responsible for returning the decompress content acoording to file name
class GetCommand : public ICommand {
public:
    GetCommand() = default; //constructor
    ~GetCommand() override = default; //destructor - prevents memory leaks
    void execute(const std::string& file_info, ICompress* compressor, Output* output) override;

    };
#endif