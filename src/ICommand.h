#ifndef ICOMMAND_H
#define ICOMMAND_H

//The purpose of the ICommand interface is to serve as the base class
//for all commands that will be executed in the app.

class ICommand {
public:
    virtual ~ICommand() = default; // virtual destructor - prevents memory leaks
    virtual void execute() = 0;
};

#endif
