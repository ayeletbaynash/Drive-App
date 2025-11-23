#include <gtest/gtest.h> 
#include "Output.h"
#include <iostream>

using namespace std;

//1. should output the correct string to the console
TEST(OutputTests, OutputCorrectString) {
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    std::string data = "Hello World";
    test_output.write(data);    // Write to the output
    
    EXPECT_EQ(ss.str(), data + '\n');
}

//2. should handle empty strings without errors
TEST(OutputTests, HandlesEmptyStrings) {
    std::stringstream ss;
    Output test_output(ss);
    std::string data = "";

    EXPECT_NO_THROW(test_output.write(data)); // shouldnt throw exception
    EXPECT_EQ(ss.str(), data + '\n');   // Stream should contain an empty string
}

//3. should correctly print strings containing special characters, numbers, or symbols
TEST(OutputTests, HandlesSpecialCharsAndNumbers) {
    std::stringstream ss;
    Output test_output(ss);
    std::string data = "!@#$%^&*()_+12345";

    test_output.write(data);
    EXPECT_EQ(ss.str(), data + '\n');   // Stream should contain exactly the string with special chars
}