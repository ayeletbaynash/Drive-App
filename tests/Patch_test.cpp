#include <gtest/gtest.h>
#include "PatchCommand.h"
#include <filesystem>
#include <fstream>
#include <sstream>
#include "ICompress.h"
#include "Output.h"

namespace fs = std::filesystem;

// helper function to read file content and make sure it changed
static std::string readFile(const fs::path& path) {
    std::ifstream in(path);
    std::stringstream buffer;
    buffer << in.rdbuf();
    return buffer.str();
}

// Helper function - creates fake files in the tests only
static void createTestFile(const fs::path& path, const std::string& content) {
    std::ofstream out(path);
    out << content;
}

// Helper function - to define Environment Variable (Cross-platform)
static void setProjectDir(const fs::path& path) {
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", path.string().c_str());
#else
    setenv("PROJECT_DIR", path.c_str(), 1);
#endif
}

// Creating mock objects without depending on the real implementations.
class MockCompress : public ICompress {
public:
    std::string compress(const std::string& file) override { return file; }
    std::string decompress(const std::string& file) override { return file; }
};

// Helper function to prepare the environment for the test
static void PreparePatchEnv(fs::path tempDir) {
    fs::create_directories(tempDir);
    createTestFile(tempDir / "file1", "original content");  // Create fake file in temp dir
    setProjectDir(tempDir); // Setting the environment variable
}

// 1. Should successfully rename a file and return 204 No Content
TEST(PatchCommandTests, Return204OnSuccessfuPatch){
    fs::path tempDir = fs::temp_directory_path() / "patch_test_1";
    PreparePatchEnv(tempDir);

    PatchCommand patch;
    std::stringstream ss;
    Output test_output(ss);
    MockCompress compressor;

    // Update: file1 -> new content
    patch.execute("file1 new content", &compressor, &test_output);

    EXPECT_EQ(ss.str(), "204 No Content\n"); // Right system code
    EXPECT_TRUE(fs::exists(tempDir / "file1")); // Same file name still there
    EXPECT_EQ(readFile(tempDir / "file1"), "new content"); // New content 

    fs::remove_all(tempDir); // Cleanup
}

// 2. Should return 404 when the source file does not exist
TEST(PatchCommandTests, Returns404WhenFileNotFound) {
    fs::path tempDir = fs::temp_directory_path() / "patch_test_2";
    PreparePatchEnv(tempDir);

    PatchCommand patch;
    std::stringstream ss;
    Output test_output(ss);
    MockCompress compressor;

    // Try to change a non-existing file
    patch.execute("non_existing new content", &compressor, &test_output);

    EXPECT_EQ(ss.str(), "404 Not Found\n");
    
    fs::remove_all(tempDir); // Cleanup
}

// 3. Should return 400 when missing parameters
TEST(PatchCommandTests, Returns400OnMissingParameters) {
    fs::path tempDir = fs::temp_directory_path() / "patch_test_3";
    PreparePatchEnv(tempDir);

    PatchCommand patch;
    std::stringstream ss;
    Output test_output(ss);
    MockCompress compressor;

    // Only provide the source name without the new content
    patch.execute("file1", &compressor, &test_output);

    EXPECT_EQ(ss.str(), "400 Bad Request\n");

    fs::remove_all(tempDir); // Cleanup
}

// 4. Should return 400 on empty input
TEST(PatchCommandTests, Returns400OnEmptyInput) {
    fs::path tempDir = fs::temp_directory_path() / "patch_test_4";
    PreparePatchEnv(tempDir);

    PatchCommand patch;
    std::stringstream ss;
    Output test_output(ss);
    MockCompress compressor;

    patch.execute("", &compressor, &test_output);

    EXPECT_EQ(ss.str(), "400 Bad Request\n");

    fs::remove_all(tempDir); // Cleanup
}