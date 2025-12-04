#include "ICommand.h"
#include "Output.h"
#include "DeleteCommand.h"
#include <filesystem>
#include <sstream>
#include <string>
#include <cstdlib>
namespace fs = std::filesystem;
using std::string;
using std::stringstream;


// the function is responsible for delete file according to file name
void DeleteCommand::execute(const std::string& file_info, ICompress* compressor, Output* output) {
    //check if ENV VAR exist, if not- return
    const char* dir = std::getenv("PROJECT_DIR");
    if (!dir){
        output->write(status_codes.at(500));
        return;
    } 
    
    // Check if file_info is empty or starts with a whitespace character (space, tab, etc.). if yes- return code 400
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
    //check if there is a whitespace character after the file name- if yes- return code 400
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

    // delete the file
    if (fs::remove(full_path)) {
        output->write(status_codes.at(204));  // file deleted successfully
    } 
    else {
        output->write(status_codes.at(500));  // failed to delete
    }
    }