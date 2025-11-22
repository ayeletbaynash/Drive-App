#include "Input.h"
#include <fstream>

Input::Input(std::istream& input_stream) : stream(input_stream) {}; //constructor

// reads a full line from standard input and returns it as a string
std::string Input::read() {
    std::string user_input;
    std::getline(this->stream, user_input);

    if (this->stream.fail() && !this->stream.eof()) { //if thee is a fail (not from ending)
        this->stream.clear(); //clear to continue
    }

    return user_input;
};

// getter for internal stream
std::istream& Input::get_stream() {
    return this->stream;
}