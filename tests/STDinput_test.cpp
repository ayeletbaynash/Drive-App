#include <gtest/gtest.h> 
#include "../src/IInput.h"
//#include "STDinput.h"
#include <iostream>

using namespace std;

//helper func- moc cin to read from string instead 
int mockCin(string mock_input) {
    //streambuf* orig = cin.rdbuf(); 
    istringstream input(mock_input);
    cin.rdbuf(input.rdbuf());
    // tests go here
    //cin.rdbuf(orig);
}

//1. should return user input correctly
TEST(InputTests, ReturnsUserInputCorrectly) {
    STDinput inputProvider; //create instance
    setStdin("hello world\n"); //input

    EXPECT_EQ(inputProvider.Get_input(), "hello world");
}

//2. should preserve whitespace in the input
TEST(InputTests, PreservesWhitespace) {
    STDinput inputProvider;
    setStdin("   spaced   input   \n");

    EXPECT_EQ(inputProvider.Get_input(), "   spaced   input   ");
}

//3. should handle special characters and numbers correctly
TEST(InputTests, HandlesSpecialCharsAndNumbers) {
    STDinput inputProvider;
    setStdin("!@#$%^&*()_+12345\n");

    EXPECT_EQ(inputProvider.Get_input(), "!@#$%^&*()_+12345");
}

//4. should handle input errors or exceptions gracefully
TEST(InputTests, HandlesInputErrorsGracefully) {
    STDinput inputProvider;

    std::cin.setstate(std::ios::failbit); // simulate error

    EXPECT_THROW({
        inputProvider.Get_input();
    }, std::runtime_error);

    std::cin.clear(); // reset for other tests
}

