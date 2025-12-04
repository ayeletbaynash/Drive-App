#include <gtest/gtest.h>
#include "AddCommand.h"
#include "ICompress.h"
#include "Output.h"
#include <filesystem>


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



//function that sets the PROJECT_DIR environment variable to the given path.
static void setProjectDir(const fs::path& path) {
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", path.string().c_str());
#else
    setenv("PROJECT_DIR", path.c_str(), 1);
#endif
}

//should add a file successfully
//this is also a test for- Test file creation in the directory specified by ENV VAR
//should print "201 Created" after a successful ADD
TEST(AddCommandTest, FileIsCreated) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output outputdest(ss);     // Initialize an output with the mock stream
    

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;
    add.execute("file AAA", &compressor, &outputdest);

    //check if the file was created successfully
    EXPECT_TRUE(fs::exists(tempDir / "file"));
    //check the message that was printed
    EXPECT_EQ(ss.str(), "201 Created\n");

    //delete in the end
    fs::remove_all(tempDir);
}

//should add a file withot a content
TEST(AddCommandTest, FileWithoutContent) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output outputdest(ss);     // Initialize an output with the mock stream

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_2";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;
    //chek for add a a file without a content
    add.execute("fileB", &compressor, &outputdest);

    //check if the file was created successfully
    EXPECT_TRUE(fs::exists(tempDir / "fileB"));
    //check the message that was printed
    EXPECT_EQ(ss.str(), "201 Created\n");

    //delete in the end
    fs::remove_all(tempDir);
}

//should handle adding multiple files
TEST(AddCommandTest, AddingMultipleFiles) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output outputdest(ss);     // Initialize an output with the mock stream

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_multiple";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //create multiple files+check the message that was printed for each time
    add.execute("file1 AAAA", &compressor, &outputdest);
    EXPECT_EQ(ss.str(), "201 Created\n");
    ss.str("");//clean the output print
    ss.clear();
    add.execute("file2 BBB", &compressor, &outputdest);
    EXPECT_EQ(ss.str(), "201 Created\n");
    ss.str("");//clean the output print
    ss.clear();
    add.execute("file3 CCC", &compressor, &outputdest);
    EXPECT_EQ(ss.str(), "201 Created\n");
    ss.str("");//clean the output print
    ss.clear();
    add.execute("file4 DDDDD", &compressor, &outputdest);
    EXPECT_EQ(ss.str(), "201 Created\n");

    //check all files exist
    EXPECT_TRUE(fs::exists(tempDir / "file1"));
    EXPECT_TRUE(fs::exists(tempDir / "file2"));
    EXPECT_TRUE(fs::exists(tempDir / "file3"));
    EXPECT_TRUE(fs::exists(tempDir / "file4"));

    //delete in the end
    fs::remove_all(tempDir);
}

//should not add file if threre has missing arguments
//should print "400 Bad Request" for an invalid ADD command
TEST(AddCommandTest, MissingArguments) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output outputdest(ss);     // Initialize an output with the mock stream

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_missing_args";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //the command with missing argument
    add.execute("", &compressor, &outputdest);
    //check that nothing is add
    EXPECT_EQ(std::distance(fs::directory_iterator(tempDir), fs::directory_iterator{}), 0);
    //check the message that was printed
    EXPECT_EQ(ss.str(), "400 Bad Request\n");
    //delete in the end
    fs::remove_all(tempDir);
}
//should not add file if the file name start with " "
TEST(AddCommandTest, NotAddSpace) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output outputdest(ss);     // Initialize an output with the mock stream

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_file_name_start_space";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //the command with missing argument
    add.execute(" file abcd", &compressor, &outputdest);
    //check that nothing is add
    EXPECT_EQ(std::distance(fs::directory_iterator(tempDir), fs::directory_iterator{}), 0);
    //check the message that was printed
    EXPECT_EQ(ss.str(), "400 Bad Request\n");

    //delete in the end
    fs::remove_all(tempDir);
}
//should not add file  if ENV VAR is missing
TEST(AddCommandTest, FailIfEnvVarMissing) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output outputdest(ss);     // Initialize an output with the mock stream

    // Remove or unset PROJECT_DIR
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", "");
#else
    unsetenv("PROJECT_DIR");
#endif

    AddCommand add;

    // Try to execute the command without ENV VAR and check if the program print 500
    add.execute("file1", &compressor, &outputdest);
    EXPECT_EQ(ss.str(), "500 Internal Server Error\n");

}
//should not add file with the same name already exists
//should print "400 Bad Request" for an invalid ADD command
TEST(AddCommandTest, FileAlreadyExists) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output outputdest(ss);     // Initialize an output with the mock stream

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_existing";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //create the first file normally
    add.execute("file AAA", &compressor, &outputdest);
    EXPECT_TRUE(fs::exists(tempDir / "file")); //check it exists

    //try to create the same file again - should not do it
    ss.str("");
    ss.clear();
    add.execute("file AAA", &compressor, &outputdest);
    EXPECT_EQ(std::distance(fs::directory_iterator(tempDir), fs::directory_iterator{}), 1);
    //check the message that was printed
    EXPECT_EQ(ss.str(), "400 Bad Request\n");

    //delete in the end
    fs::remove_all(tempDir);
}



