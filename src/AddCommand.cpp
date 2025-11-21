#include "ICommand.h"
#include "ICompress.h"
#include <sstream>
using namespace std;

//The class AddCommand inherits from the ICommand interface.
//It is responsible for adding new files with compress content to the system.
class AddCommand : public ICommand {
public:
    AddCommand();
    void execute(std::string& file_info, ICompress* compressor, IOutput* output) {
        //check if ENV VAR exist, if not- return
        const char* dir = std::getenv("PROJECT_DIR");
        if (!dir) return;
        
        //check if file_info is not empty. if yes- return
        if (file_info.empty()) {
        return;
        }
        //split between file name and
        //take file name
        stringstream ss(file_info);
        string filename;
        ss >> filename;
        //take content
        string content;
        getline(ss, content);
        //delete the space between that was after the first word
        if (!content.empty() && content[0] == ' ')
        content.erase(0, 1);
        
        //compress the content
        string content_compress = compressor->compress(content);

    }

    };