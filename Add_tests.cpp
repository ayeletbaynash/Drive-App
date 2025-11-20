#include <gtest/gtest.h>
#include "AddCommand.h"
#include "RLECompress.h"
#include "STDOutput.h"
#include <filesystem>

namespace fs = std::filesystem;

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
    RLECompress rleCompress;  // ICompress
    STDOutput outputdest;     // Ioutput

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;
    add.execute("file AAA", &rleCompress, &outputdest);

    //check if the file was created successfully
    EXPECT_TRUE(fs::exists(tempDir / "file"));

    //delete in the end
    fs::remove_all(tempDir);
}

//should add a file withot a content
TEST(AddCommandTest, FileWithoutContent) {
    //create the arguments of the function
    RLECompress rleCompress;
    STDOutput outputdest;

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_2";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;
    //chek for add a a file without a content
    add.execute("fileB", &rleCompress, &outputdest);

    //check if the file was created successfully
    EXPECT_TRUE(fs::exists(tempDir / "fileB"));

    //delete in the end
    fs::remove_all(tempDir);
}

//should handle adding multiple files
TEST(AddCommandTest, AddingMultipleFiles) {
    //create the arguments of the function
    RLECompress rleCompress;   // ICompress
    STDOutput outputdest;      // IOutput

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_multiple";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //create multiple files
    add.execute("file1 AAAA", &rleCompress, &outputdest);
    add.execute("file2 BBB", &rleCompress, &outputdest);
    add.execute("file3 CCC", &rleCompress, &outputdest);
    add.execute("file4 DDDDD", &rleCompress, &outputdest);

    //check all files exist
    EXPECT_TRUE(fs::exists(tempDir / "file1"));
    EXPECT_TRUE(fs::exists(tempDir / "file2"));
    EXPECT_TRUE(fs::exists(tempDir / "file3"));
    EXPECT_TRUE(fs::exists(tempDir / "file4"));

    //delete in the end
    fs::remove_all(tempDir);
}

//should send error if command with missing arguments
TEST(AddCommandTest, MissingArguments) {
    //create the arguments of the function
    RLECompress rleCompress;
    STDOutput outputdest;

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_missing_args";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //the command with missing argument
    EXPECT_THROW(add.execute("", &rleCompress, &outputdest), std::invalid_argument);

    //delete in the end
    fs::remove_all(tempDir);
}
//Test file creation fails if ENV VAR is missing
TEST(AddCommandTest, FailIfEnvVarMissing) {
    //create the arguments of the function
    RLECompress rleCompress;   // ICompress
    STDOutput outputdest;      // IOutput

    // Remove or unset PROJECT_DIR
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", "");  
#else
    unsetenv("PROJECT_DIR");      
#endif

    AddCommand add;

    // Try to execute the command and expect it to throw an exception
    EXPECT_THROW(
        add.execute("file.txt AAA", &rleCompress, &outputdest),
        std::runtime_error
    );
}
//should throw an error if a file with the same name already exists????---------
TEST(AddCommandTest, FileAlreadyExists) {
    //create the arguments of the function
    RLECompress rleCompress;   // ICompress
    STDOutput outputdest;      // IOutput

    //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_add_existing";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);

    AddCommand add;

    //create the first file normally
    add.execute("file AAA", &rleCompress, &outputdest);
    EXPECT_TRUE(fs::exists(tempDir / "file")); //check it exists

    //try to create the same file again - should throw an exception
    EXPECT_THROW(
        add.execute("file BBB", &rleCompress, &outputdest),
        std::runtime_error
    );

    //delete in the end
    fs::remove_all(tempDir);
}

