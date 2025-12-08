#include "SearchCommand.h"
#include "ICompress.h"
#include "Output.h"
#include "FileLocks.h"
#include <filesystem>
#include <fstream>
#include <sstream>
#include <vector>

using namespace std;
namespace fs = std::filesystem;

// The function is responsible for searching content inside existing project files.
void SearchCommand::execute(const std::string& content_to_search,
                            ICompress* compressor,
                            Output* output) 
{
    const char* dir = std::getenv("PROJECT_DIR");    // Check if env var exists - saving the env var
    if (!dir) {
         output->write(status_codes.at(500));       // If not exists- return code 500
         return;
    }

    if (content_to_search.empty()) {            // Check if search string is empty
        output->write(status_codes.at(400));    // return code 400
        return;
    }

    fs::path project_path = fs::path(dir); // Converts the string dir to a path object

    // Check directory exists
    if (!fs::exists(project_path) || !fs::is_directory(project_path)) {
        output->write(status_codes.at(500));    // return code 500
        return; // silent fail
    }

    std::vector<std::string> matched_files; // Create dinamic list to hold all matches as strings

    // Iterate over all files in PROJECT_DIR
    for (const auto& entry : fs::directory_iterator(project_path)) {

        if (!entry.is_regular_file()) // Check to make sure file and not folder/link/ect.
            continue;                 // Skip and dont throw exception

        std::string filename = entry.path().filename().string();
        //lock specific to this file to prevent race conditions
        std::mutex& fileMutex = getFileMutex(filename);
        std::lock_guard<std::mutex> lock(fileMutex);

        std::ifstream file(entry.path());    // open each file
        if (!file)                           // if doesnt open 
            continue;                        // skip and dont throw exception

        // Read all content into one string
        std::stringstream buffer;
        buffer << file.rdbuf();
        std::string file_content = buffer.str();

        std::string filename = entry.path().filename().string();           // Save file name as string to look through
        file_content = compressor->decompress(file_content);               // Decompress the content to search inside
        if (file_content.find(content_to_search) != std::string::npos      // Check if the content appears in file
            || filename.find(content_to_search) != std::string::npos) {    // or in the file name
            matched_files.push_back(filename);                             // push only filename, not full path
        }
    }

    if (matched_files.empty()) {                // If nothing found 
        output->write(status_codes.at(404));    // Return not found
        return;
    }

    // Creating result string as requierd:
    std::string result;                                     // Empty string to store all matches
    for (size_t i = 0; i < matched_files.size(); i++) {     // For every file found
        result += matched_files[i];
        if (i + 1 < matched_files.size())
            result += " ";                                  // add space between names
    }

    //output->write(result);
    //print the content by using Output
    std::stringstream output_ss;
    output_ss << status_codes.at(200) << "\x04\x04" << result;
    output->write(output_ss.str());
    return;
}
