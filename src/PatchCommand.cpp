#include "ICommand.h"
#include "PatchCommand.h"
#include "Output.h"
#include "FileLocks.h"
#include <filesystem>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <cctype>
#include <mutex>

namespace fs = std::filesystem;
using std::string;
using std::stringstream;

void PatchCommand::execute(const std::string& file_info, ICompress* /*compressor*/, Output* output) {
    // Check if ENV VAR exist, if not- return a code 500
    const char* dir = std::getenv("PROJECT_DIR");
    if (!dir) {
        output->write(status_codes.at(500));
        return;
    }
    // Check if file_info is not empty or starts with a whitespace character (space, tab, etc.). if yes- return code 400
    if (file_info.empty() || std::isspace(static_cast<unsigned char>(file_info[0]))) {
        output->write(status_codes.at(400));
        return;
    }

    // Split the filename and the new name from the input string
    stringstream ss(file_info);
    string filename;
    string newName;

    ss >> filename;
    ss >> newName;

    if (newName.empty()) {     // Dont allow empty name
        output->write(status_codes.at(400));
        return;
    }

    // Lock the specific file to prevent race conditions
    std::mutex& fileMutex = getFileMutex(filename);
    std::lock_guard<std::mutex> lock(fileMutex);

    // Build paths and check if the source file exists
    fs::path full_path = fs::path(dir) / filename;
    if (!fs::exists(full_path)) {
        output->write(status_codes.at(404));
        return;
    }

    // Execute the patch command
    fs::path new_path = fs::path(dir) / newName;
    try {
        fs::rename(full_path, new_path);
        output->write(status_codes.at(204));
    } catch (...) {
        // Handle filesystem errors (e.g., permissions, disk full)
        output->write(status_codes.at(500));
    }
}