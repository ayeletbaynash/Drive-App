#ifndef PATCHCOMMAND_H
#define PATCHCOMMAND_H

#include "ICommand.h"
#include <string>

// forward declarations
class ICompress;
class Output;

// PatchCommand is a class that inherits from the ICommand interface.
// It is responsible for applying partial updates to existing files.
class PatchCommand : public ICommand {
public:
    PatchCommand() = default;            // constructor
    ~PatchCommand() override = default;  // destructor - prevents memory leaks
    void execute(const std::string& file_info, ICompress* compressor, Output* output) override;
};

#endif
