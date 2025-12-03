#include <gtest/gtest.h>
#include "DeleteCommand.h"
#include "ICompress.h"
#include "Output.h"
#include <filesystem>
#include <fstream>
#include <sstream>
namespace fs = std::filesystem;
using std::string;



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

//should delete an existing file successfully +should send a confirmation message after the deletion command is successful
TEST(DeleteCommandTest, DeleteFileSuccessfully) {

     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_delete_successfully";
    PrepareTestEnv(tempDir);


     DeleteCommand deletecommand; 
    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    //ensure that the file exist before the delete command
    EXPECT_TRUE(fs::exists(tempDir / "file2"));
    //check if the file delete successfully and the message was printed
    deletecommand.execute("file2", &compressor, &test_output);
    EXPECT_FALSE(fs::exists(tempDir / "file2"));
    EXPECT_EQ(ss.str(), "204 No Content\n");
    //delete in the end
     fs::remove_all(tempDir);
}

//should return 404 if the file does not exist
TEST(DeleteCommandTest, FileDoesNotExist) {

     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "delete_file_not_exist";
    PrepareTestEnv(tempDir);


     DeleteCommand deletecommand; 
    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    //check the mmessage when file does not exist
    deletecommand.execute("file", &compressor, &test_output);
    EXPECT_EQ(ss.str(), "404 Not Found\n");
    //delete in the end
     fs::remove_all(tempDir);
}

//should return 400 for invalid commands
TEST(DeleteCommandTest, InvalidDeleteCommands) {

     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "invalid delete commands";
    PrepareTestEnv(tempDir);


     DeleteCommand deletecommand; 
    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    //check the mmessage when file does not exist
    deletecommand.execute("file2 bbb", &compressor, &test_output); //more than file name
    EXPECT_EQ(ss.str(), "400 Bad Request\n");
    ss.str("");//clean the output print

    deletecommand.execute("file2 ", &compressor, &test_output);// space after file name
    EXPECT_EQ(ss.str(), "400 Bad Request\n");
    ss.str("");

    deletecommand.execute(" file2", &compressor, &test_output);//space before
    EXPECT_EQ(ss.str(), "400 Bad Request\n");
    ss.str("");

    deletecommand.execute("", &compressor, &test_output);// withot file name
    EXPECT_EQ(ss.str(), "400 Bad Request\n");
    
    //delete in the end
    fs::remove_all(tempDir);
}

//should allow multiple delete commands in the same session
TEST(DeleteCommandTest, DeleteMultiSuccessfully) {

     //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_delete_multi_successfully";
    PrepareTestEnv(tempDir);

     DeleteCommand deletecommand; 
    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    //ensure that the files exist before the delete command
    EXPECT_TRUE(fs::exists(tempDir / "file1"));
    EXPECT_TRUE(fs::exists(tempDir / "file2"));
    EXPECT_TRUE(fs::exists(tempDir / "file3"));

    //check if the files were deleted successfully and the messages were printed
    deletecommand.execute("file1", &compressor, &test_output);
    EXPECT_FALSE(fs::exists(tempDir / "file1"));
    EXPECT_EQ(ss.str(), "204 No Content\n");
    ss.str("");
    deletecommand.execute("file2", &compressor, &test_output);
    EXPECT_FALSE(fs::exists(tempDir / "file2"));
    EXPECT_EQ(ss.str(), "204 No Content\n");
    ss.str("");
    deletecommand.execute("file3", &compressor, &test_output);
    EXPECT_FALSE(fs::exists(tempDir / "file3"));
    EXPECT_EQ(ss.str(), "204 No Content\n");

    //delete in the end
     fs::remove_all(tempDir);
}