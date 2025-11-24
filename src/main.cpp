#include "AddCommand.h"
#include "App.h"
#include "GetCommand.h"
#include "ICommand.h"
#include "ICompress.h"
#include "Input.h"
#include "Output.h"
#include "RLEcompress.h"
#include "SearchCommand.h"

#include <map>
#include <string>
using namespace std;

int main() {
    AddCommand addCmd;
    GetCommand getCmd;
    SearchCommand searchCmd;

    std::map<std::string, ICommand*> commands = {
        {"add", &addCmd},
        {"get", &getCmd},
        {"search", &searchCmd}
    };

    RLEcompress compressor;

    App app(commands);
    app.run;

    }
