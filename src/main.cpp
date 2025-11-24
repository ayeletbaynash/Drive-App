#include "AddCommand.h"
#include "GetCommand.h"
#include "SearchCommand.h"
#include "RLECompress.h"
#include "App.h"
#include "Input.h"
#include "Output.h"

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
    RLECompress compressor;
    Input inputStd;
    Output outputStd;

    // Create app
    App app(&inputStd, &outputStd, &compressor, commands);

    // Run program
    app.run();

    return 0;

}
