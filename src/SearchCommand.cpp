#include "SearchCommand.h"
#include "ICompress.h"
#include "Output.h"
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
    if (!dir) return;

    if (content_to_search.empty()) {     // Check if search string is empty
        output->write("");               // prints only '\n'
        return;
    }

    fs::path project_path = fs::path(dir); // Converts the string dir to a path object

    // Check directory exists
    if (!fs::exists(project_path) || !fs::is_directory(project_path)) {
        return; // silent fail
    }

    std::vector<std::string> matched_files; // Create dinamic list to hold all matches as strings

    // Iterate over all files in PROJECT_DIR
    for (const auto& entry : fs::directory_iterator(project_path)) {

        if (!entry.is_regular_file()) // Check to make sure file and not folder/link/ect.
            continue;                 // Skip and dont throw exception

        std::ifstream file(entry.path());    // open each file
        if (!file)                           // if doesnt open 
            continue;                        // skip and dont throw exception

        // Read all content into one string
        std::stringstream buffer;
        buffer << file.rdbuf();
        std::string file_content = buffer.str();

        file_content = compressor->decompress(file_content);               // Decompress the content to search inside
        if (file_content.find(content_to_search) != std::string::npos) {   // Check if the content appears in file
            matched_files.push_back(entry.path().filename().string());     // push only filename, not full path

        }
    }

    if (matched_files.empty()) {     // If nothing found 
        output->write("");           // Print empty line
        return;
    }

    // Creating result string as requierd:
    std::string result;                                     // Empty string to store all matches
    for (size_t i = 0; i < matched_files.size(); i++) {     // For every file found
        result += matched_files[i];
        if (i + 1 < matched_files.size())
            result += " ";                                  // add space between names
    }

    output->write(result);
}
