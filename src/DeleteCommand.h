#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H

#include "ICommand.h"
#include <string>
// forward declarations
class ICompress;
class Output;

// DeleteCommand is a class that inherits from the ICommand interface.
// It is responsible for deleting file according to file name
class DeleteCommand : public ICommand {
public:
    DeleteCommand() = default; //constructor
    ~DeleteCommand() override = default; //destructor - prevents memory leaks
    void execute(const std::string& file_info, ICompress* compressor, Output* output) override;

    };
#endif