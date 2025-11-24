#include "AddCommand.h"
#include "GetCommand.h"
#include "SearchCommand.h"
#include "RLECompress.h"
#include "App.h"
#include "Input.h"
#include "Output.h"
#include "ICompress.h"

#include <map>
#include <string>


int main() {
    // Create command objects
    AddCommand addCmd;
    GetCommand getCmd;
    SearchCommand searchCmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &addCmd},
        {"get", &getCmd},
        {"search", &searchCmd}
    };

    // Create compressor, input, and output
    RLEcompress compressor;
    Input inputStd(std::cin);
    Output outputStd(std::cout);

    // Create app
    App app(&inputStd, &outputStd, &compressor, commands);

    // Run program
    app.run();

    return 0;

}
