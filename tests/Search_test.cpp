#include <gtest/gtest.h>
#include "SearchCommand.h"
#include <filesystem>
#include <fstream>
#include "ICompress.h"
#include "Output.h"

namespace fs = std::filesystem;

// Helper function- creates fake files in the tests only
static void createTestFile(const fs::path& path, const std::string& content) {
    std::ofstream out(path); 
    out << content; 
}

// Helper function- to define Environment Variable
static void setProjectDir(const fs::path& path) {
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", path.string().c_str());
#else
    setenv("PROJECT_DIR", path.c_str(), 1);
#endif
}

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

// Function to prepare the enviorment for the test
static void PrepareTestEnv(fs::path tempDir){
    fs::create_directories(tempDir);

    // Create fake files in temp dir
    createTestFile(tempDir / "file1", "AAABBBCCC");  
    createTestFile(tempDir / "file2", "XYZ 123 #%!");         
    createTestFile(tempDir / "notes1", "Hello World"); 
    createTestFile(tempDir / "notes2", "Cats or Dogs"); 

    setProjectDir(tempDir);  // Setting the environment variable - where SEARCH will look for files

}

//1. should return a file name when content is found in this file.
TEST(SearchCommandTests, ReturnFileNameCorrectly) { 

    fs::path tempDir = fs::temp_directory_path() / "search_test_1";     // Create temp dir
    PrepareTestEnv(tempDir); // Create test files

    SearchCommand search; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    search.execute("AAABBBCCC", &compressor, &test_output); // search for content
    
    EXPECT_EQ(ss.str(), "file1\n");

     fs::remove_all(tempDir);   // Delete in the end
}

// 2. should return an empty list when the content is not found in any file.
TEST(SearchCommandTests, ReturnsEmptyWhenNoMatches) {

    fs::path tempDir = fs::temp_directory_path() / "search_test_2";     // Create temp dir
    PrepareTestEnv(tempDir); // Create test files

    SearchCommand search; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    search.execute("not there", &compressor, &test_output); // search for content
    EXPECT_EQ(ss.str(), "\n");  // Return empty 
    fs::remove_all(tempDir);   // Delete in the end

}

// 3. should correctly handle searching for an empty string.
TEST(SearchCommandTests, HandlesEmptySearchString) {
    
    fs::path tempDir = fs::temp_directory_path() / "search_test_3";     // Create temp dir
    PrepareTestEnv(tempDir); // Create test files

    SearchCommand search; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    search.execute("", &compressor, &test_output); // search for content
    EXPECT_EQ(ss.str(), "\n");  // Return empty 
    fs::remove_all(tempDir);   // Delete in the end

}

// 4. should correctly handle content containing spaces.
TEST(SearchCommandTests, HandlesSearchWithSpaces) {
    fs::path tempDir = fs::temp_directory_path() / "search_test_4";     // Create temp dir
    PrepareTestEnv(tempDir); // Create test files

    SearchCommand search; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    search.execute(" ", &compressor, &test_output); // search for content
    // Return files that include " " witout order sensitivity
    std::string result = ss.str();
    EXPECT_TRUE(result == "file2 notes1 notes2\n" || result == "file2 notes2 notes1\n" 
                || result == "notes1 notes2 file2\n" || result == "notes1 file2 notes2 \n"
                  || result == "notes2 notes1 file2\n" || result == "notes2 file2 notes1\n" );
    fs::remove_all(tempDir);   // Delete in the end
}

// 5. should find all content in prefixes and suffixes correctly
TEST(SearchCommandTests, HandlesSearchOfPrefixAndSuffix) {
    fs::path tempDir = fs::temp_directory_path() / "search_test_5";     // Create temp dir
    PrepareTestEnv(tempDir); // Create test files

    SearchCommand search; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    search.execute("or", &compressor, &test_output); // search for content
    // Return files that include or: hello w(or)ld, Cats (or) Dogs witout order sensitivity
    std::string result = ss.str();
    EXPECT_TRUE(result == "notes1 notes2\n" || result == "notes2 notes1\n");
    fs::remove_all(tempDir);   // Delete in the end
}

// 6. should return nothing if dir is empty, not throw exception
TEST(SearchCommandTests, HandlesEmptyDir) {
    fs::path tempDir = fs::temp_directory_path() / "search_test_6";     // Create temp dir
    fs::create_directories(tempDir); // Create empty test files
    setProjectDir(tempDir);  // Setting the environment variable - where SEARCH will look for files
    SearchCommand search; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    search.execute("", &compressor, &test_output); // search for content
    EXPECT_EQ(ss.str(), "\n");  // Return empty 
    fs::remove_all(tempDir);   // Delete in the end
}

// 7. should find all content in prefixes and suffixes correctly including spaces
TEST(SearchCommandTests, HandlesSearchContainigSpace) {
    fs::path tempDir = fs::temp_directory_path() / "search_test_7";     // Create temp dir
    PrepareTestEnv(tempDir); // Create test files

    SearchCommand search; 

    //create the arguments of the function
    std::stringstream ss;       // Create an output string stream to mock a stream
    Output test_output(ss);     // Initialize an output with the mock stream
    MockCompress compressor;    // ICompress

    search.execute(" or", &compressor, &test_output); // search for content
    // Return files that include or: hello w(or)ld, Cats (or) Dogs witout order sensitivity
    std::string result = ss.str();
    EXPECT_TRUE(result == "notes2\n");
    fs::remove_all(tempDir);   // Delete in the end
}