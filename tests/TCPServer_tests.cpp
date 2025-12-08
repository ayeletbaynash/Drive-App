#include <gtest/gtest.h>
#include <thread>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string>
#include <cstring>
#include <cstdlib>
#include <future>
#include <filesystem>
#include <fstream>

namespace fs = std::filesystem;

// Helper function

// Function to set the environment variable
static void setProjectDir(const fs::path& path) {
#ifdef _WIN32
    _putenv_s("PROJECT_DIR", path.string().c_str());
#else
    setenv("PROJECT_DIR", path.c_str(), 1);
#endif
}

// function to communicate with the real server
std::string sendToRealServer(int port, const std::string& message) {
    // Create socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return "ERROR_SOCKET";

    struct sockaddr_in serv_addr;
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(port);
    inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr);

    // Try to connect (small delay to ensure server is ready)
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    
    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
        close(sock);
        return "ERROR_CONNECT";
    }

    // Send message
    send(sock, message.c_str(), message.size(), 0);
    // Send newline because the server expects it to end the command
    send(sock, "\n", 1, 0); 

    // Read response
    char buffer[4096] = {0};
    int valread = read(sock, buffer, 4096);
    
    close(sock);
    
    if (valread > 0) {
        return std::string(buffer);
    }
    return "";
}

// Test Fixture: Setup & Teardown
class ServerIntegrationTest : public ::testing::Test {
protected:
    const int port = 5555;
    fs::path tempDir;

    // Runs before every test
    void SetUp() override {
        // Create a unique temporary directory for each test
        // Use TestInfo to generate a unique folder name based on the test case name
        const testing::TestInfo* const test_info = 
            testing::UnitTest::GetInstance()->current_test_info();
        
        std::string testName = std::string(test_info->test_case_name()) + "_" + test_info->name();
        tempDir = fs::temp_directory_path() / testName;
        
        // Clean up if exists and create new
        if (fs::exists(tempDir)) fs::remove_all(tempDir);
        fs::create_directories(tempDir);

        // Set the environment variable that the server will read
        setProjectDir(tempDir);

        // Run the server in the background
        // The server inherits PROJECT_DIR from this process
        std::system("./appExec 5555 > /dev/null 2>&1 &");
        // Wait a bit for the server to bind and listen
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }

    // Runs after every test
    void TearDown() override {
        // Kill the server process
        std::system("pkill appExec");
        std::this_thread::sleep_for(std::chrono::milliseconds(100));

        // Cleanup temporary files
        if (fs::exists(tempDir)) {
           fs::remove_all(tempDir);
        }
    }
};

// TEST POST - Should create file and return 201
TEST_F(ServerIntegrationTest, ShouldExecutePostCommandCorrectly) {
    // Send command to server
    std::string response = sendToRealServer(port, "POST file1.txt hello");
    
    // Check protocol response
    EXPECT_NE(response.find("201 Created"), std::string::npos);

    // Physical check: Verify the file was created in the temp directory
    EXPECT_TRUE(fs::exists(tempDir / "file1.txt"));
}

// TEST GET - Should return 200 and content
TEST_F(ServerIntegrationTest, ShouldExecuteGetCommandCorrectly) {
    // First, create a file via the server
    sendToRealServer(port, "POST file2.txt XYZ123");

    // Now request it
    std::string response = sendToRealServer(port, "GET file2.txt");

    // Check protocol response + content
    EXPECT_NE(response.find("200 Ok"), std::string::npos);
    EXPECT_NE(response.find("XYZ123"), std::string::npos);
}

// TEST DELETE - Should remove file and return 204
TEST_F(ServerIntegrationTest, ShouldExecuteDeleteCommandCorrectly) {
    // Setup: Create a file first
    sendToRealServer(port, "POST file_to_del.txt content");
    ASSERT_TRUE(fs::exists(tempDir / "file_to_del.txt")); // Verify it exists

    // Delete
    std::string response = sendToRealServer(port, "DELETE file_to_del.txt");

    // Check protocol response
    EXPECT_NE(response.find("204 No Content"), std::string::npos);

    // Physical check: Verify the file was deleted
    EXPECT_FALSE(fs::exists(tempDir / "file_to_del.txt"));
}

// TEST SEARCH - Should return filename
TEST_F(ServerIntegrationTest, ShouldExecuteSearchCommandCorrectly) {
    // Create files with different content
    sendToRealServer(port, "POST fileA.txt shalom");
    sendToRealServer(port, "POST fileB.txt bye");
    sendToRealServer(port, "POST fileC.txt shalom_world");

    // Search
    std::string response = sendToRealServer(port, "SEARCH shal");

    // Check that we found the relevant files
    EXPECT_NE(response.find("200 Ok"), std::string::npos);
    EXPECT_NE(response.find("fileA.txt"), std::string::npos);
    EXPECT_NE(response.find("fileC.txt"), std::string::npos);
    // Ensure we didn't find the unrelated file
    EXPECT_EQ(response.find("fileB.txt"), std::string::npos);
}

// TEST INVALID INPUT - Should return 400
TEST_F(ServerIntegrationTest, ShouldHandleInvalidInput) {
    std::string response = sendToRealServer(port, "INVALID_CMD something");
    EXPECT_NE(response.find("400 Bad Request"), std::string::npos);
}

// TEST 6: CONCURRENCY
TEST_F(ServerIntegrationTest, ShouldHandleMultipleClientsConcurrently) {
    auto client1 = std::async(std::launch::async, [this]() {
        return sendToRealServer(port, "POST thread1.txt A");
    });
    
    auto client2 = std::async(std::launch::async, [this]() {
        return sendToRealServer(port, "POST thread2.txt B");
    });

    std::string resp1 = client1.get();
    std::string resp2 = client2.get();

    EXPECT_NE(resp1.find("201 Created"), std::string::npos);
    EXPECT_NE(resp2.find("201 Created"), std::string::npos);
    
    // Verify that both files were created
    EXPECT_TRUE(fs::exists(tempDir / "thread1.txt"));
    EXPECT_TRUE(fs::exists(tempDir / "thread2.txt"));
}