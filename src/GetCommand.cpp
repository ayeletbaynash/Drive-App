#include "ICommand.h"
#include "ICompress.h"
#include "Output.h"
#include "GetCommand.h"
#include <sstream>
#include <filesystem>
#include <fstream>
#include <cctype>
using namespace std;
namespace fs = std::filesystem;

// the function is responsible for returning the decompress content acoording to file name
void GetCommand::execute(const std::string& file_info, ICompress* compressor, Output* output) {
        //check if ENV VAR exist, if not- return code 500
        const char* dir = std::getenv("PROJECT_DIR");
        if (!dir){
            output->write(status_codes.at(500));
            return;
        }
        //check if file_info is not empty or start with " " . if yes- return code 400
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
        //check if there is a space after the file name- if yes- return code 400
        if (!content.empty() && std::isspace(content[0])){
            output->write(status_codes.at(400));
            return;
        }
        

        //build path with ENV VAR
        fs::path full_path = fs::path(dir) / filename;

        //check if the file is exist, if no- return code 404
         if (!fs::exists(full_path)) {
            output->write(status_codes.at(404));
            return;
        }
        //open the file for reading
        std::ifstream file(full_path);
        if (!file){//if i cant read the file- return code 500
            output->write(status_codes.at(500));
            return;
        }  
        //read content from the file
        std::stringstream buffer;
        buffer << file.rdbuf();
        string content_compress = buffer.str();//convert all to string
        file.close();
        //decompress the content
        string full_content = compressor->decompress(content_compress);
        //print the content by using Output
        output->write(status_codes.at(200));
        output->write(full_content);
        return;
    }



