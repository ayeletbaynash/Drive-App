#include "ICommand.h"
#include "ICompress.h"
#include "Output.h"
#include "AddCommand.h"
#include <sstream>
#include <filesystem>
#include <fstream>
using namespace std;
namespace fs = std::filesystem;


//the function responsible for adding new files with compress content to the system.

    void AddCommand::execute(const std::string& file_info, ICompress* compressor, Output* output) {
        //check if ENV VAR exist, if not- return
        const char* dir = std::getenv("PROJECT_DIR");
        if (!dir) return;
        
        //check if file_info is not empty or start with " " . if yes- return
        if (file_info.empty() ||file_info[0] == ' ') {
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

        //build path with ENV VAR
         fs::path full_path = fs::path(dir) / filename;

         //check if the file is exist, if yes- return
         if (fs::exists(full_path)) {
            return;
        }
        //add the content
        ofstream file(full_path);
        file << content_compress;
        file.close();

    };