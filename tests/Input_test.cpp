#include <gtest/gtest.h> 
#include "../src/Input.h"
#include <iostream>

//1. should return user input correctly
TEST(InputTests, ReturnsUserInputCorrectly) {
    std::stringstream ss;       // Create an input string stream to mock a stream
    Input test_input(ss);       // Initialize an Input with the mock stream
    std::string data = "Hello World";
    ss << data;                 // Push "Hello World" to the mock stream
    
    EXPECT_EQ(test_input.read(), "Hello World");
}

//2. should preserve whitespace in the input
TEST(InputTests, PreservesWhitespace) {
    std::stringstream ss;      // Create an input string stream to mock a stream
    Input test_input(ss);       // Initialize an Input with the mock stream
    std::string data = "   spaced   input   \n";
    ss << data;
    
    EXPECT_EQ(test_input.read(), "   spaced   input   ");
}

//3. should handle special characters and numbers correctly
TEST(InputTests, HandlesSpecialCharsAndNumbers) {
    std::stringstream ss;      // Create an input string stream to mock a stream
    Input test_input(ss);       // Initialize an Input with the mock stream
    std::string data = "!@#$%^&*()_+12345\n";
    ss << data;
    
    EXPECT_EQ(test_input.read(), "!@#$%^&*()_+12345");
}

//4. should handle input errors or exceptions gracefully
TEST(InputTests, HandlesInputErrorsGracefully) {
    std::stringstream ss;      // Create an input string stream to mock a stream
    Input test_input(ss);       // Initialize an Input with the mock stream
    test_input.get_stream().setstate(std::ios::failbit); // simulate error

    EXPECT_NO_THROW(test_input.read());
    EXPECT_FALSE(test_input.get_stream().fail());
}