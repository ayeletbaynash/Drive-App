#include "ICommand.h"
#include <string>
#include "ICompress.h"
#include "IOutput.h"

//The class AddCommand inherits from the ICommand interface.
//It is responsible for adding new files with compress content to the system.
class AddCommand : public ICommand {
public:
    AddCommand();
    void execute(std::string& f, ICompress* compressor, IOutput* output) override;

    };