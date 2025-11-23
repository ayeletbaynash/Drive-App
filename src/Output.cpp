#include "Output.h"

Output::Output(std::ostream& output_stream) : stream(output_stream) {}; //constructor

//returns the string to the standard output 
void Output::write(std::string output) {
    this->stream << output << '\n';

    if (this->stream.fail()) { // if there is a failure
        this->stream.clear();  
    }
};