#include "ICommand.h"
#include "ICompress.h"
#include "Output.h"
#include "AddCommand.h"
#include <sstream>
#include <filesystem>
#include <fstream>
#include <cctype>
#include "FileLocks.h"
using namespace std;
namespace fs = std::filesystem;


//the function responsible for adding new files with compress content to the system.

    void AddCommand::execute(const std::string& file_info, ICompress* compressor, Output* output) {
        //check if ENV VAR exist, if not- return a code 500
        const char* dir = std::getenv("PROJECT_DIR");
        if (!dir) {
            output->write(status_codes.at(500));
            return;
        }
        //check if file_info is not empty or starts with a whitespace character (space, tab, etc.). if yes- return code 400
        if (file_info.empty() ||std::isspace(file_info[0])) {
            output->write(status_codes.at(400));
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
        //lock specific to this file to prevent race conditions
        std::mutex& fileMutex = getFileMutex(filename);
        std::lock_guard<std::mutex> lock(fileMutex);
        //delete the space between that was after the first word
        if (!content.empty() && content[0] == ' ')
        content.erase(0, 1);
        
        //compress the content
        string content_compress = compressor->compress(content);

        //build path with ENV VAR
         fs::path full_path = fs::path(dir) / filename;

         //check if the file is exist, if yes- return code 400
         if (fs::exists(full_path)) {
            output->write(status_codes.at(400));
            return;
        }
        //add the content
        ofstream file(full_path);
        file << content_compress;
        file.close();

        //sent the code that said the add command worked successfully
        output->write(status_codes.at(201));

    };