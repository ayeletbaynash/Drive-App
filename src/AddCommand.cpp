#include "ICommand.h"
#include "ICompress.h"
#include "Output.h"
#include "AddCommand.h"
#include <sstream>
#include <filesystem>
#include <fstream>
#include <cctype>
#include <vector>
#include "FileLocks.h"
using namespace std;
namespace fs = std::filesystem;


//the function responsible for adding new files with compress content to the system.

    std::string base64_decode(const std::string& in) {
    std::string out;
    std::vector<int> T(256, -1);
    for (int i = 0; i < 64; i++) T["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[i]] = i;

    int val = 0, valb = -8;
    for (unsigned char c : in) {
        if (T[c] == -1) break;
        val = (val << 6) + T[c];
        valb += 6;
        if (valb >= 0) {
            out.push_back(char((val >> valb) & 0xFF));
            valb -= 8;
        }
    }
    return out;
}

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
        string content64;
        getline(ss, content64);
        //lock specific to this file to prevent race conditions
        std::mutex& fileMutex = getFileMutex(filename);
        std::lock_guard<std::mutex> lock(fileMutex);
        //delete the space between that was after the first word
        if (!content64.empty() && content64[0] == ' ')
        content64.erase(0, 1);

        //change from base64 to text
        string content = base64_decode(content64);
        
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
        ofstream file(full_path, ios::out | ios::binary);
        file.write(content_compress.data(), content_compress.size());
        file.close();

        //sent the code that said the add command worked successfully
        output->write(status_codes.at(201));

    };