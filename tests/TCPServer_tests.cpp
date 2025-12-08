#include <gtest/gtest.h>
#include <thread>
#include <sys/socket.h>
#include <sys/time.h>
#include <unistd.h>
#include <string>
#include <cstring>
#include <cstdlib>
#include <iostream>
#include <vector>
#include "TCPServer.h" 

// Helper Functions

// Reads data from the socket
std::string readFromSocket(int sock) {
    char buffer[4096];
    memset(buffer, 0, sizeof(buffer));
    ssize_t bytesRead = read(sock, buffer, sizeof(buffer) - 1);
    if (bytesRead <= 0) return "";
    return std::string(buffer);
}

// Writes data to the socket
void sendToSocket(int sock, const std::string& msg) {
    std::string finalMsg = msg;
    if (finalMsg.back() != '\n') finalMsg += "\n";
    write(sock, finalMsg.c_str(), finalMsg.size());
}

// The Tests

// 1. POST and GET
// Should handle a single client correctly
TEST(ServerTest, StandardFlow_PostAndGet) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);
    // sv[0] is used by the server, sv[1] is used by the client (test).
    int serverSock = sv[0];
    int clientSock = sv[1];

    std::thread serverThread(handleClient, serverSock);

    sendToSocket(clientSock, "post testfile.txt my_content\n");
    
    // Check for success response (201 Created)
    std::string response = readFromSocket(clientSock);
    EXPECT_TRUE(response.find("201 Created") != std::string::npos);

    // File System Race Condition Fix
    // We sleep briefly to allow the OS to flush the written file to the disk
    // before we immediately try to read it back.
    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    sendToSocket(clientSock, "get testfile.txt\n");
    
    response = readFromSocket(clientSock);
    
    // Verify response headers and content
    EXPECT_TRUE(response.find("200 Ok") != std::string::npos) 
        << "Expected 200 Ok, got: " << response;
        
    EXPECT_TRUE(response.find("my_content") != std::string::npos) 
        << "File content is missing! Got: " << response;

    // Cleanup
    shutdown(clientSock, SHUT_WR);
    close(clientSock);
    serverThread.join();
}

// 2. Error Handling: Invalid Command
// Should reject malformed TCP messages safely
TEST(ServerTest, ErrorHandling_InvalidCommand) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);

    std::thread serverThread(handleClient, sv[0]);

    sendToSocket(sv[1], "INVALID_COMMAND something");
    std::string response = readFromSocket(sv[1]);
    
    EXPECT_EQ(response, "400 Bad Request\n");

    shutdown(sv[1], SHUT_WR);
    close(sv[1]);
    serverThread.join();
}

// 3. Error Handling: File Not Found (Delete)
// Should keep running/handling logic correctly
TEST(ServerTest, ErrorHandling_FileNotFound) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);

    std::thread serverThread(handleClient, sv[0]);

    // Try to delete a file that was never created
    sendToSocket(sv[1], "delete non_existent_file.txt");
    std::string response = readFromSocket(sv[1]);
    
    EXPECT_EQ(response, "404 Not Found\n");

    close(sv[1]);
    serverThread.join();
}

// 4. Concurrency: Two Clients
// Should handle multiple client connections concurrently
TEST(ServerTest, Concurrency_TwoClients) {
    int sv1[2], sv2[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv1), 0);
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv2), 0);

    // Launch TWO server threads
    std::thread t1(handleClient, sv1[0]);
    std::thread t2(handleClient, sv2[0]);

    // Client 1 posts data
    sendToSocket(sv1[1], "post file1.txt data1\n");
    // Client 2 posts data immediately
    sendToSocket(sv2[1], "post file2.txt data2\n");

    // Verify both got confirmation
    EXPECT_TRUE(readFromSocket(sv1[1]).find("201 Created") != std::string::npos);
    EXPECT_TRUE(readFromSocket(sv2[1]).find("201 Created") != std::string::npos);

    // Allow time for file persistence
    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    // Verify data separation - client 1
    sendToSocket(sv1[1], "get file1.txt");

    // Robust reading loop: Read until "data1" appears or timeout
    std::string resp1 = "";
    int retries = 10;
    while (resp1.find("data1") == std::string::npos && retries > 0) {
        resp1 += readFromSocket(sv1[1]);
        if (resp1.find("data1") != std::string::npos) break;
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
        retries--;
    }
    EXPECT_TRUE(resp1.find("data1") != std::string::npos) << "Client 1 got wrong data: " << resp1;

    // Verify data separation - Client 2
    sendToSocket(sv2[1], "get file2.txt\n");
    
    std::string resp2 = "";
    retries = 10;
    while (resp2.find("data2") == std::string::npos && retries > 0) {
        resp2 += readFromSocket(sv2[1]);
        if (resp2.find("data2") != std::string::npos) break;
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
        retries--;
    }
    EXPECT_TRUE(resp2.find("data2") != std::string::npos) << "Client 2 got wrong data: " << resp2;

    shutdown(sv1[1], SHUT_WR);
    shutdown(sv2[1], SHUT_WR);
    close(sv1[1]);
    close(sv2[1]);
    t1.join();
    t2.join();
}

// 5. Stream Integrity: Sticky Packets
// Handling multiple commands in buffer
TEST(ServerTest, Stream_StickyPackets) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);
    std::thread serverThread(handleClient, sv[0]);

    // Send two commands AT ONCE (simulating sticky packet)
    std::string sticky = "post sticky.txt sticky_data\nget sticky.txt\n";
    write(sv[1], sticky.c_str(), sticky.size());

    // Accumulate response until we see the final data or timeout
    std::string fullResponse = "";
    int maxReads = 20; 
    
    while (fullResponse.find("sticky_data") == std::string::npos && maxReads > 0) {
        std::string chunk = readFromSocket(sv[1]);
        if (chunk.empty()) {
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
        }
        fullResponse += chunk;
        maxReads--;
    }

    // Verify that BOTH responses are present in the stream
    EXPECT_TRUE(fullResponse.find("201 Created") != std::string::npos);
    EXPECT_TRUE(fullResponse.find("200 Ok") != std::string::npos);
    EXPECT_TRUE(fullResponse.find("sticky_data") != std::string::npos);

    shutdown(sv[1], SHUT_WR);
    close(sv[1]);
    serverThread.join();
}

// 6. Graceful Shutdown
// Should close a client session gracefully
TEST(ServerTest, GracefulShutdown_ClientDisconnect) {
    int sv[2];
    socketpair(AF_UNIX, SOCK_STREAM, 0, sv);
    
    std::thread serverThread(handleClient, sv[0]);
    
    // Just close the connection without sending anything
    close(sv[1]);
    
    // If server hangs here, it means it didn't detect the disconnection
    serverThread.join(); 
}

// 7. Logic: Delete Success
// Removing a file successfully (204)
TEST(ServerTest, Logic_DeleteSuccess) {
    int sv[2];
    socketpair(AF_UNIX, SOCK_STREAM, 0, sv);
    std::thread serverThread(handleClient, sv[0]);

    // Create a file first
    sendToSocket(sv[1], "post to_delete.txt junk");
    readFromSocket(sv[1]); // Clear buffer (201)

    // Delete it
    sendToSocket(sv[1], "delete to_delete.txt");
    std::string response = readFromSocket(sv[1]);
    EXPECT_EQ(response, "204 No Content\n");

    close(sv[1]);
    serverThread.join();
}

// 8. Logic: Search Command
// The explicit requirement for SEARCH command
TEST(ServerTest, Logic_SearchCommand) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);

    setenv("PROJECT_DIR", ".", 1);
    struct timeval tv;
    tv.tv_sec = 2;  
    tv.tv_usec = 0;
    setsockopt(sv[1], SOL_SOCKET, SO_RCVTIMEO, (const char*)&tv, sizeof tv);

    std::thread serverThread(handleClient, sv[0]);

    // Setup: Create a file to search for
    sendToSocket(sv[1], "post visible.txt some_content\n");
    //readFromSocket(sv[1]); // Read 201
    std::string postResp = readFromSocket(sv[1]);

    // Action: Search
    // Note: Adjust the search logic expectation based on your specific implementation
    sendToSocket(sv[1], "search visible\n"); 
    std::string response = readFromSocket(sv[1]);
    
    EXPECT_FALSE(response.empty()) << "Server returned NOTHING for search command!";
    EXPECT_TRUE(response.find("200 Ok") != std::string::npos);
    // Assuming search returns file names found:
    EXPECT_TRUE(response.find("visible.txt") != std::string::npos);

    shutdown(sv[1], SHUT_WR);
    close(sv[1]);
    serverThread.join();

    unsetenv("PROJECT_DIR");
}

// 9. Edge Case: Empty Line / Just Newline
// Robustness against empty inputs
TEST(ServerTest, EdgeCase_EmptyInput) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);
    
    // Set socket timeout to prevent the test from hanging if the server is unresponsive
    struct timeval tv;
    tv.tv_sec = 2;
    tv.tv_usec = 0;
    setsockopt(sv[1], SOL_SOCKET, SO_RCVTIMEO, (const char*)&tv, sizeof tv);

    std::thread serverThread(handleClient, sv[0]);

    // Send an empty line (newline only)
    write(sv[1], "\n", 1);
    // Send a follow-up command to verify server is still alive
    sendToSocket(sv[1], "CHECK_ALIVE\n");

    std::string response = readFromSocket(sv[1]);
    
    // If we get a response, the server successfully survived the empty input
    EXPECT_TRUE(response.find("400 Bad Request") != std::string::npos) 
        << "Server got stuck or crashed on empty input";

    shutdown(sv[1], SHUT_WR);
    close(sv[1]);
    serverThread.join();
}