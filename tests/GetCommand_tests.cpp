#include <gtest/gtest.h>
#include "ICompress.h"
#include "Output.h"
#include "GetCommand.h"
#include <filesystem>
#include <fstream>
#include <string>

using std::string;
namespace fs = std::filesystem;

//creating mock objects without depending on the real implementations.
class MockCompress : public ICompress {
public:
    std::string compress(const std::string& file) override {
        return file; 
    }
    std::string decompress(const std::string& file) override {
        return file; 
    }
};

//The function creates files in the path that are sent to simulate files added in the application.
static void createTestFile(const fs::path& path, const string& content) {
    std::ofstream out(path);
    out << content;
}

//function that sets the PROJECT_DIR environment variable to the given path.
static void setProjectDir(const fs::path& path) {
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", path.string().c_str());
#else
    setenv("PROJECT_DIR", path.c_str(), 1);
#endif
}

// Function to prepare the enviorment for the test
static void PrepareTestEnv(fs::path tempDir){
    fs::create_directories(tempDir);

    // Create fake files in temp dir
    createTestFile(tempDir / "file1", "AAABBBCCC");  
    createTestFile(tempDir / "file2", "XYZ123");         
    createTestFile(tempDir / "file3", "Hello World!"); 

    setProjectDir(tempDir);  // Setting the environment variable - where get will look for files

}


//Should retrieve a file successfully
TEST(GetCommandTest, RetrieveAFileSuccessfully) {

     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_get_successfully";
    PrepareTestEnv(tempDir);


     GetCommand get; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    //check if the file retrieve successfully
    get.execute("file2", &compressor, &test_output);
    EXPECT_EQ(ss.str(), "XYZ123\n");

    //delete in the end
     fs::remove_all(tempDir);
}

//Should handle retrieving multiple files
TEST(GetCommandTest, RetrievingMultipleFiles) {

     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_get_multiple_files";
    PrepareTestEnv(tempDir);
     GetCommand get; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    //check if the files retrieve successfully
    get.execute("file1", &compressor, &test_output);
    get.execute("file2", &compressor, &test_output);
    get.execute("file3", &compressor, &test_output);
    EXPECT_EQ(ss.str(), "AAABBBCCC\nXYZ123\nHello World!\n");

    //delete in the end
     fs::remove_all(tempDir);
}
//Should return an empty result when the file is not found
TEST(GetCommandTest, ReturnEmptyWhenFileNotFound) {
     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_get_no_file";
    PrepareTestEnv(tempDir);
    GetCommand get; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    //check if the file not found
    get.execute("file", &compressor, &test_output);
    EXPECT_EQ(ss.str(), "");

     //delete in the end
     fs::remove_all(tempDir);
}
//Test command with missing arguments -will do nothing 
TEST(GetCommandTest, MissingArguments) {
     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_get_missing_argument";
    PrepareTestEnv(tempDir);
    GetCommand get; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

//check if the there is no result
    get.execute("", &compressor, &test_output);
    EXPECT_EQ(ss.str(), "");

     //delete in the end
     fs::remove_all(tempDir);
}

//should not get content if the file name start with space
TEST(GetCommandTest, FileNameStartWithSpace) {
     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_get_file_name_start_with_space";
    PrepareTestEnv(tempDir);
    GetCommand get; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

//check if the there is no result
    get.execute(" file1", &compressor, &test_output);
    EXPECT_EQ(ss.str(), "");

     //delete in the end
     fs::remove_all(tempDir);
}

//should not get content if the file name end with space
TEST(GetCommandTest, FileNameEndWithSpace) {
     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_get_file_name_end_with_space";
    PrepareTestEnv(tempDir);
    GetCommand get; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

//check if the there is no result
    get.execute("file1 ", &compressor, &test_output);
    EXPECT_EQ(ss.str(), "");

     //delete in the end
     fs::remove_all(tempDir);
}



//Test file reading in the directory specified by ENV VAR
TEST(GetCommandTest, SpecificDirectory) {
     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_get_specific_directory";
    PrepareTestEnv(tempDir);

    // Create a second temporary directory for a "wrong" location
    fs::path wrongDir = fs::temp_directory_path() / "wrong_dir";
    fs::create_directories(wrongDir);
    createTestFile(wrongDir / "file1", "wrong place");
    GetCommand get; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    //check if the command read only from the right directory
    get.execute("file1", &compressor, &test_output);
     EXPECT_EQ(ss.str(), "AAABBBCCC\n");

    //delete in the end
    fs::remove_all(tempDir);
    fs::remove_all(wrongDir);
}

//Test file reading fails if ENV VAR is missing
TEST(GetCommandTest, MissingENVVAR) {
     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_get_missing_ENV_VAR";
    PrepareTestEnv(tempDir);
    GetCommand get; 
    #ifdef _WIN32
    _putenv_s("PROJECT_DIR", "");
    #else
    unsetenv("PROJECT_DIR");
    #endif

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

//check if the there is no result
    get.execute("file3", &compressor, &test_output);
    EXPECT_EQ(ss.str(), "");

     //delete in the end
     fs::remove_all(tempDir);
}











