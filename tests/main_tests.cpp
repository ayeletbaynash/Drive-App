#include <gtest/gtest.h>
#include "Input.h"
#include "ICompress.h"
#include "Output.h"
#include "RLEcompress.h"
#include "App.h"
#include "GetCommand.h"
#include "SearchCommand.h"

#include "AddCommand.h"


namespace fs = std::filesystem;

//function that sets the PROJECT_DIR environment variable to the given path.
static void setProjectDir(const fs::path& path) {
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", path.string().c_str());
#else
    setenv("PROJECT_DIR", path.c_str(), 1);
#endif
}

//The function creates files in the path that are sent to simulate files added in the application.
static void createTestFile(const fs::path& path, const string& content) {
    std::ofstream out(path);
    out << content;
}
//Should execute the ADD command and add a file to the system.
TEST(MainIntegration, ShouldExecuteAddCommandCorrectly) {
  
   //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_main_add";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);
    
    //create argument for App
    std::stringstream fakeInput;
    fakeInput << "add file1 hello\n";
    Input input(fakeInput);

    std::stringstream fakeOutput;
    Output output(fakeOutput);

    RLEcompress compressor;
    
    AddCommand addCmd;
    GetCommand getCmd;
    SearchCommand searchCmd;
std::map<std::string, ICommand*> commands = {
    {"add", &addCmd},
    {"get", &getCmd},
    {"search", &searchCmd}
    };

    //create app
    App app(&input, &output, &compressor, commands);
    app.Run();

    //check if the file was created successfully
    EXPECT_TRUE(fs::exists(tempDir / "file1"));

    //delete in the end
    fs::remove_all(tempDir);

}
//Should execute the GET command and return the original file content
TEST(MainIntegration, ShouldExecuteGetCommandCorrectly) {
    //create temporary directory and set environment variable
        fs::path tempDir = fs::temp_directory_path() / "test_main_get";
        fs::create_directories(tempDir);
        setProjectDir(tempDir);

    //create argument for App
        std::stringstream fakeInput;
        fakeInput << "get file2\n";
        Input input(fakeInput);

        std::stringstream fakeOutput;
        Output output(fakeOutput);

        RLEcompress compressor;

    //create file in the diractory with compress content
    std::string content = "XYZ123";
    std::string compressed = compressor.compress(content);

    createTestFile(tempDir / "file2", compressed);  
        
    AddCommand addCmd;
    GetCommand getCmd;
    SearchCommand searchCmd;
    std::map<std::string, ICommand*> commands = {
        {"add", &addCmd},
        {"get", &getCmd},
        {"search", &searchCmd}
        };

    //create app
    App app(&input, &output, &compressor, commands);
    app.Run();
//check if the content return successfully
    EXPECT_EQ(fakeOutput.str(), "XYZ123\n");

    //delete in the end
     fs::remove_all(tempDir);
}

//Should execute the SEARCH command and return matching file names.
TEST(MainIntegration, ShouldExecuteSearchCommandCorrectly) {
    //create temporary directory and set environment variable
        fs::path tempDir = fs::temp_directory_path() / "test_main_search";
        fs::create_directories(tempDir);
        setProjectDir(tempDir);

    //create argument for App
        std::stringstream fakeInput;
        fakeInput << "search shi\n";
        Input input(fakeInput);

        std::stringstream fakeOutput;
        Output output(fakeOutput);

    RLEcompress compressor;

    //create file in the diractory with compress content
    std::string content = "hello world";
    std::string compressed = compressor.compress(content);
    std::string content2 = "shir hello ";
    std::string compressed2 = compressor.compress(content2);
    std::string content3 = "bye ";
    std::string compressed3 = compressor.compress(content3);
    createTestFile(tempDir / "file2", compressed);
    createTestFile(tempDir / "file1", compressed2);
    createTestFile(tempDir / "file3", compressed3);
      
        
    AddCommand addCmd;
    GetCommand getCmd;
    SearchCommand searchCmd;
    std::map<std::string, ICommand*> commands = {
        {"add", &addCmd},
        {"get", &getCmd},
        {"search", &searchCmd}
        };

    //create app
    App app(&input, &output, &compressor, commands);
    app.Run();
//check if the file return successfully
    EXPECT_EQ(fakeOutput.str(), "file1\n");

    //delete in the end
     fs::remove_all(tempDir);
}

//Should use the Compressor to correctly compress and decompress content.
//we can check it in the same time with "Should handle multiple sequential commands and maintain proper state. "
TEST(MainIntegration, MultipleSequentialCommands) {
  
   //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_main_multiple";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);
    
    //create argument for App
    std::stringstream fakeInput;
    fakeInput << "add file1 hello hello\n";
    fakeInput << "search o\n";
    fakeInput << "get file1\n";
    Input input(fakeInput);

    std::stringstream fakeOutput;
    Output output(fakeOutput);

    RLEcompress compressor;
    
    AddCommand addCmd;
    GetCommand getCmd;
    SearchCommand searchCmd;
std::map<std::string, ICommand*> commands = {
    {"add", &addCmd},
    {"get", &getCmd},
    {"search", &searchCmd}
    };

    //create app
    App app(&input, &output, &compressor, commands);
    app.Run();

    //check if the output is correct
    EXPECT_EQ(fakeOutput.str(), "file1\nhello hello\n");

    //delete in the end
     fs::remove_all(tempDir);
}

//Should do nothing when receiving invalid input or unknown commands.
TEST(MainIntegration, InvalidInput) {
  
   //create temporary directory and set environment variable
    fs::path tempDir = fs::temp_directory_path() / "test_main_invalid_input";
    fs::create_directories(tempDir);
    setProjectDir(tempDir);
    
    //create argument for App
    std::stringstream fakeInput;
    fakeInput << "HI file1 hello hello\n";
    fakeInput << " search o\n";
    fakeInput << "add  file2 abc\n";
    fakeInput << "get file2\n";
    Input input(fakeInput);

    std::stringstream fakeOutput;
    Output output(fakeOutput);

    RLEcompress compressor;
    
    AddCommand addCmd;
    GetCommand getCmd;
    SearchCommand searchCmd;
std::map<std::string, ICommand*> commands = {
    {"add", &addCmd},
    {"get", &getCmd},
    {"search", &searchCmd}
    };

    //create app
    App app(&input, &output, &compressor, commands);
    app.Run();

    //check if the output is correct
    EXPECT_EQ(fakeOutput.str(), "");

    //delete in the end
     fs::remove_all(tempDir);
    
}
