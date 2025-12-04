#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <string>
#include <map>
// Forward declarations  ot the interfaces
class ICompress;
class Output;
//The purpose of the ICommand interface is to serve as the base class
//for all commands that will be executed in the app.

class ICommand {

protected:             
    inline static const std::map<int, std::string> status_codes{
        {200, "200 Ok\n"},
        {201, "201 Created"},
        {204, "204 No Content"},
        {400, "400 Bad Request"},
        {404, "404 Not Found"},
        {500, "500 Internal Server Error"}
    };

public:
    virtual ~ICommand() = default; // virtual destructor - prevents memory leaks
    virtual void execute(const std::string& file_info, ICompress* compressor, Output* output) = 0;
};

#endif
