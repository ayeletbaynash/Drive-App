#ifndef SEARCHCOMMAND_H
#define SEARCHCOMMAND_H

#include "ICommand.h"
#include <string>
// forward declarations
class ICompress;
class Output;

// SearchCommand is a class that inherits from the ICommand interface.
// It is responsible for searching content inside project files.
class SearchCommand : public ICommand {
public:
    SearchCommand() = default;             // constructor
    ~SearchCommand() override = default;   // destructor

    // Executes the search command.
    // content_to_search: the text the user wants to find inside files.
    // compressor: used only to decompress files before searching (mocked in tests).
    // output: where matched file names will be printed.
    void execute(const std::string& content_to_search,
                 ICompress* compressor,
                 Output* output) override;
};

#endif // SEARCHCOMMAND_H
