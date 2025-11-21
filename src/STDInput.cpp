#include "IInput.h"
#include "STDInput.h"
#include <string>
#include <iostream>
using namespace std;

    STDInput::STDInput(){} //constructor

    //reads a full line from standard input and returns it as a string
    string STDInput::Get_input() {
        string input;
        getline(cin, input);

        if (cin.fail() && !cin.eof()) { //if thee is a fail (not from ending)
            cin.clear(); //clear to continue
        }

        return input;
    };