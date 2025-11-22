#ifndef OUTPUT_H
#define OUTPUT_H

#include <string>
#include <iostream>

// It is responsible for printing the right file from the system.
class Output {
public:
    Output() = delete;
    Output(std::ostream& output_stream = std::cout);
    void write(std::string output);
private:
    std::ostream& stream;
};

#endif