#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <string>
// Forward declarations  ot the interfaces
class ICompress;
class Output;
//The purpose of the ICommand interface is to serve as the base class
//for all commands that will be executed in the app.

class ICommand {
public:
    virtual ~ICommand() = default; // virtual destructor - prevents memory leaks
    virtual void execute(const std::string& file_info, ICompress* compressor, Output* output) = 0;
};

#endif
