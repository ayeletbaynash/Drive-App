#include <gtest/gtest.h>
#include <vector>
#include <map>
#include <algorithm>
#include <string>
#include <thread>
#include <functional>

// FakeSocket class
class FakeSocket {
public:
bool socketCalled = false;
bool bindCalled = false;
bool listenCalled = false;

int bindPort = -1;         
int listenBacklog = -1;      

std::vector<int> clientFds;          // Fake file descriptors for clients
std::map<int, std::string> recvData; // Simulated received data from clients
std::map<int, std::string> sentData; // Data sent to clients

int nextClientFd = 100; // Next fake client FD

// Basic socket operations
int socket(int domain, int type, int protocol) { socketCalled = true; return 1; }
int bind(int fd, int port) { bindCalled = true; bindPort = port; return 0; }
int listen(int fd, int backlog) { listenCalled = true; listenBacklog = backlog; return 0; }

int accept() {
    int fd = nextClientFd++;
    clientFds.push_back(fd);
    return fd;
}

int send(int fd, const std::string& data) {
    sentData[fd] += data;
    return data.size();
}

std::string recv(int fd) {
    if(recvData.find(fd) != recvData.end()) {
        std::string data = recvData[fd];
        recvData[fd] = ""; // Clear after reading
        return data;
    }
    return "";
}

void close(int fd) {
    clientFds.erase(std::remove(clientFds.begin(), clientFds.end(), fd), clientFds.end());
}
};

// TCPServer class using FakeSocket
class TCPServer {
FakeSocket* sock;
int port;

public:
TCPServer(int p, FakeSocket* s) : port(p), sock(s) {}

void start() {
    int fd = sock->socket(0, 0, 0); // Create a socket
    sock->bind(fd, port);           // Bind to the port
    sock->listen(fd, 5);            // Start listening with backlog=5
}
};

// FakeApp class for testing
class FakeApp {
public:
std::vector[std::string](std::string) receivedCommands; // Store commands received by the App
std::map<std::string, std::string> responses; 

std::string process(const std::string& cmd) {
    receivedCommands.push_back(cmd);
    if(responses.find(cmd) != responses.end())
        return responses[cmd];
    return "OK";
}
};

// handleClient function
void handleClient(int clientFd, FakeSocket* sock, FakeApp* app) {
std::string msg;
while (!(msg = sock->recv(clientFd)).empty()) {
std::string response = app->process(msg);
sock->send(clientFd, response);
}
sock->close(clientFd);
}

// Helper functions
int connectClient(FakeSocket& sock, const std::string& msg) {
int fd = sock.accept();
sock.recvData[fd] = msg;
return fd;
}

std::thread startClientThread(FakeSocket& sock, FakeApp& app, int fd) {
return std::thread([&sock, &app, fd]() {
handleClient(fd, &sock, &app);
});
}

void verifyClientHandled(FakeSocket& sock, FakeApp& app, const std::vector<int>& fds) {
for(int fd : fds) {
EXPECT_EQ(sock.sentData[fd], "OK") << "Each client should receive OK response";
}
EXPECT_TRUE(sock.clientFds.empty()) << "All client connections should be closed";
}

// Test Fixture
class TCPServerTest : public ::testing::Test {
protected:
FakeSocket sock;
FakeApp app;
TCPServer server{5555, &sock};
};

// First test: start listening
TEST_F(TCPServerTest, ShouldStartListeningOnConfiguredPort) {
ASSERT_NO_THROW(server.start());
ASSERT_TRUE(sock.socketCalled);
ASSERT_TRUE(sock.bindCalled);
ASSERT_EQ(sock.bindPort, 5555);
ASSERT_TRUE(sock.listenCalled);
ASSERT_EQ(sock.listenBacklog, 5);
}

// Second test: accept single client
TEST_F(TCPServerTest, ShouldAcceptSingleClientConnection) {
server.start();
int fd = sock.accept();
ASSERT_GE(fd, 100);
ASSERT_EQ(sock.clientFds.size(), 1);
ASSERT_EQ(sock.clientFds[0], fd);
}

// Third test: handle single client
TEST_F(TCPServerTest, HandleClientSingle) {
int fd = connectClient(sock, "HELLO");
handleClient(fd, &sock, &app);

ASSERT_EQ(app.receivedCommands.size(), 1);
EXPECT_EQ(app.receivedCommands[0], "HELLO");
EXPECT_EQ(sock.sentData[fd], "OK");
EXPECT_TRUE(sock.clientFds.empty());

}

// Fourth test: multiple clients concurrently
TEST_F(TCPServerTest, HandleMultipleClientsConcurrently) {
const int NUM_CLIENTS = 3;
std::vector<int> fds;
std::vector[std::thread](std::thread) threads;

for(int i = 0; i < NUM_CLIENTS; ++i)
    fds.push_back(connectClient(sock, "MSG_" + std::to_string(i)));

for(int fd : fds)
    threads.push_back(startClientThread(sock, app, fd));

for(auto& t : threads) t.join();

ASSERT_EQ(app.receivedCommands.size(), NUM_CLIENTS);
for(int i = 0; i < NUM_CLIENTS; ++i)
    EXPECT_EQ(app.receivedCommands[i], "MSG_" + std::to_string(i));

verifyClientHandled(sock, app, fds);

}

// Fifth test: keep running after client disconnects/invalid data
TEST_F(TCPServerTest, ShouldKeepRunningAfterClientDisconnectOrInvalidData) {
int fd1 = connectClient(sock, "");
handleClient(fd1, &sock, &app);
EXPECT_TRUE(std::find(sock.clientFds.begin(), sock.clientFds.end(), fd1) == sock.clientFds.end());

int fd2 = connectClient(sock, "VALID_CMD");
handleClient(fd2, &sock, &app);
ASSERT_EQ(app.receivedCommands.size(), 1);
EXPECT_EQ(app.receivedCommands[0], "VALID_CMD");
EXPECT_EQ(sock.sentData[fd2], "OK");
EXPECT_TRUE(sock.clientFds.empty());

}

// Sixth test: reject malformed messages
TEST_F(TCPServerTest, ShouldRejectMalformedTCPMessages) {
std::vector[std::string](std::string) malformedMessages = {"INVALID_CMD", "", "GET\nSEARCH"};
for(const auto& msg : malformedMessages) {
int fd = connectClient(sock, msg);
handleClient(fd, &sock, &app);
EXPECT_TRUE(std::find(sock.clientFds.begin(), sock.clientFds.end(), fd) == sock.clientFds.end());
}
EXPECT_TRUE(app.receivedCommands.empty());
}

// Seventh test: ensure new thread per client
TEST_F(TCPServerTest, ShouldCreateNewThreadPerClient) {
const int NUM_CLIENTS = 3;
std::vector<int> fds;
std::vector[std::thread](std::thread) threads;

for(int i = 0; i < NUM_CLIENTS; ++i)
    fds.push_back(connectClient(sock, "CMD_" + std::to_string(i)));

for(int fd : fds)
    threads.push_back(startClientThread(sock, app, fd));

for(auto& t : threads) t.join();

ASSERT_EQ(app.receivedCommands.size(), NUM_CLIENTS);
for(int i = 0; i < NUM_CLIENTS; ++i) {
    EXPECT_EQ(app.receivedCommands[i], "CMD_" + std::to_string(i));
    EXPECT_EQ(sock.sentData[fds[i]], "OK");
}

verifyClientHandled(sock, app, fds);
}
