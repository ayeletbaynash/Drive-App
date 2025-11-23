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
class MockOutput : public Output {
public:
    MockOutput(std::ostream& out = std::cout) : Output(out) {}
    void write(std::string) { }  
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
//this is also a tst for- Test file creation in the directory specified by ENV VAR
TEST(AddCommandTest, FileIsCreated) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    MockOutput outputdest;     // output

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;
    add.execute("file AAA", &compressor, &outputdest);

    //check if the file was created successfully
    EXPECT_TRUE(fs::exists(tempDir / "file"));

    //delete in the end
    fs::remove_all(tempDir);
}

//should add a file withot a content
TEST(AddCommandTest, FileWithoutContent) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    MockOutput outputdest;     // Output

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_2";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;
    //chek for add a a file without a content
    add.execute("fileB", &compressor, &outputdest);

    //check if the file was created successfully
    EXPECT_TRUE(fs::exists(tempDir / "fileB"));

    //delete in the end
    fs::remove_all(tempDir);
}

//should handle adding multiple files
TEST(AddCommandTest, AddingMultipleFiles) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    MockOutput outputdest;     // Output

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_multiple";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //create multiple files
    add.execute("file1 AAAA", &compressor, &outputdest);
    add.execute("file2 BBB", &compressor, &outputdest);
    add.execute("file3 CCC", &compressor, &outputdest);
    add.execute("file4 DDDDD", &compressor, &outputdest);

    //check all files exist
    EXPECT_TRUE(fs::exists(tempDir / "file1"));
    EXPECT_TRUE(fs::exists(tempDir / "file2"));
    EXPECT_TRUE(fs::exists(tempDir / "file3"));
    EXPECT_TRUE(fs::exists(tempDir / "file4"));

    //delete in the end
    fs::remove_all(tempDir);
}

//should not add file if threre has missing arguments
TEST(AddCommandTest, MissingArguments) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    MockOutput outputdest;     // Output

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_missing_args";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //the command with missing argument
    add.execute("", &compressor, &outputdest);
    //check that nothing is add
    EXPECT_EQ(std::distance(fs::directory_iterator(tempDir), fs::directory_iterator{}), 0);

    //delete in the end
    fs::remove_all(tempDir);
}
//should not add file if the file name start with " "
TEST(AddCommandTest, NotAddSpace) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    MockOutput outputdest;     // Output

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_file_name_start_space";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //the command with missing argument
    add.execute(" file abcd", &compressor, &outputdest);
    //check that nothing is add
    EXPECT_EQ(std::distance(fs::directory_iterator(tempDir), fs::directory_iterator{}), 0);

    //delete in the end
    fs::remove_all(tempDir);
}
//should not add file  if ENV VAR is missing
TEST(AddCommandTest, FailIfEnvVarMissing) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    MockOutput outputdest;     // Output

    // Remove or unset PROJECT_DIR
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", "");
#else
    unsetenv("PROJECT_DIR");
#endif

    AddCommand add;

    // Try to execute the command without ENV VAR and check if the program continue
    SUCCEED();

}
//should not add file with the same name already exists
TEST(AddCommandTest, FileAlreadyExists) {
    //create the arguments of the function
    MockCompress compressor; // ICompress
    MockOutput outputdest;     // Output

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_existing";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //create the first file normally
    add.execute("file AAA", &compressor, &outputdest);
    EXPECT_TRUE(fs::exists(tempDir / "file")); //check it exists

    //try to create the same file again - should not do it
    EXPECT_EQ(std::distance(fs::directory_iterator(tempDir), fs::directory_iterator{}), 1);

    //delete in the end
    fs::remove_all(tempDir);
}



