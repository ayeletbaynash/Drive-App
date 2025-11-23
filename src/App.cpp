#include <string>
#include <sstream>
#include <map>
#include <iostream>
#include <stdexcept>
#include "Input.h"
#include "Output.h"
#include "ICommand.h"
#include "ICompress.h"
#include "App.h"

class App {
private:
    Input* input;
    Output* output;
    ICompress* compressor;
    std::map<std::string, ICommand*> commands;

public:
    // Constructor 
    App(Input* i, Output* o, ICompress* c, std::map<std::string, ICommand*> cmds)
        : input(i), output(o), compressor(c), commands(std::move(cmds)) {}

void run() {
    while (true) {
        // reading input from the user
        std::string line = input->read();

        // split the string to command and file info
        std::stringstream ss(line);
        std::string command;
        ss >> command; 
        std::string file_info; 
        getline(ss, file_info);
        if (!file_info.empty() && file_info[0] == ' ') file_info.erase(0, 1);

        // check if command exist - if so execute
        auto it = commands.find(command);
        if (it != commands.end()) {
            try {
                it->second->execute(file_info, this->compressor, this->output);
            } catch (...) {
                // ignore exceptions
            }
        // else: invalid commit -> ignore
    }
}}}