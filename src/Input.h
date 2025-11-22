#ifndef INPUT_H
#define INPUT_H

#include <string>
#include <iostream>

// It is responsible for recieving new files to the system.
class Input {
public:
    Input() = delete;
    Input(std::istream& input_stream = std::cin);
    std::string read();
    std::istream& get_stream();
private:
    std::istream& stream;
};

#endif
