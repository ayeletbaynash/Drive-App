#include <string>
#include <sstream>
#include <algorithm> 
#include <cctype>
#include "App.h"


    // Constructor 
App::App(Input* i, Output* o, ICompress* c, std::map<std::string, ICommand*> cmds)
        : input(i), output(o), compressor(c), commands(std::move(cmds)) {}

void App::run() {
    while (true) {
        // reading input from the user
        std::string line = input->read();

        // Stop the loop when the input stream reaches EOF to prevent tests from hanging in an infinite loop
        if (!input->get_stream().good() || input->get_stream().eof()) {
            break; 
        }
        if (line.empty()) {
            if (!input->get_stream().good() || input->get_stream().eof()) break;
            continue; 
        }

        if (isspace(line[0])) continue; // Skip current run if line starts with space
        
        // split the string to command and file info
        std::stringstream ss(line);
        std::string command;
        ss >> command;
        // convert command to lowercase for case-insensitive handling
        std::transform(command.begin(), command.end(), command.begin(),
                       [](unsigned char c){ return std::tolower(c); }); 
        std::string file_info;
        getline(ss, file_info);
        if (!file_info.empty() && file_info[0] == ' ') file_info.erase(0, 1);

        // check if command exist - execute if so
        auto it = commands.find(command);
        if (it != commands.end()) {
            try {
                it->second->execute(file_info, this->compressor, this->output);
            } catch (...) {
                // ignore exceptions
            }
        } else {
            output->write("400 Bad Request");
        }
    }  
}