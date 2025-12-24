#include <iostream>
#include <map>
#include <thread>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstdlib>

#include "TCPServer.h"
#include "App.h"
#include "Multithreading.h"
#include "ThreadPool.h"
#include "InputStreamBuf.h"
#include "InputStream.h"
#include "Input.h"
#include "OutputStreamBuf.h"
#include "OutputStream.h"
#include "Output.h"
#include "RLECompress.h"
#include "AddCommand.h"
#include "GetCommand.h"
#include "SearchCommand.h"
#include "DeleteCommand.h"

// Handles a single connected client: sets up input/output streams, creates the App instance,
// runs it until the client disconnects, and then cleans up all allocated resources.
void handleClient(int clientSocket)
{
    try {
        // Input
        InputStream inStream(clientSocket);
        Input          input(inStream);

        // Output
        OutputStream outStream(clientSocket);
        Output          output(outStream);

        // Compress and command
        AddCommand addCmd;
        GetCommand getCmd;
        SearchCommand searchCmd;
        DeleteCommand deleteCmd;

        std::map<std::string, ICommand*> commands = {
            {"post", &addCmd},
            {"get", &getCmd},
            {"search", &searchCmd},
            {"delete", &deleteCmd}
        };

        RLECompress compressor;

        // App
        App app(&input, &output, &compressor, commands); // gets pointers not instances
        app.run(); // running until client closes the connection 

        // clean everything
        close(clientSocket);

    } catch (...) {
        // Silently catch errors to comply with strict output requirements
    }

    close(clientSocket);
}

#ifndef TEST_MODE
// Main function: sets up the server socket, listens for incoming client connections,
// and launches a new thread to handle each client.
int main(int argc, char* argv[]) {
    
    if (argc < 2) {
        std::cerr << "Usage: ./server <port>\n";
        return 1;
    }

    int port = std::stoi(argv[1]);
    int serverSocket, clientSocket;

    struct sockaddr_in serverAddr{}, clientAddr{};
    socklen_t clientSize = sizeof(clientAddr);

    // Create socket 
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        perror("socket() failed");
        return 1;
    }

    // Bind
    serverAddr.sin_family      = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port        = htons(port);

    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("bind() failed");
        return 1;
    }

    // Listen
    if (listen(serverSocket, 10) < 0) {
        perror("listen() failed");
        return 1;
    }

    const char* env = std::getenv("THREAD_POOL_SIZE"); // Retrieves the thread pool size from the environment
    size_t poolSize = env ? std::stoul(env) : 4;
    IThreads* threadManager = new ThreadPool(poolSize); // Thread pool used to execute client-handling tasks

    // Accept
    while (true) {
        clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientSize);
        if (clientSocket < 0) {
            continue;
        }
        
        // creating new thread per client
        threadManager->launch([clientSocket]() {
            handleClient(clientSocket);
        });
    }

    delete threadManager;
    close(serverSocket);
    return 0;
}

#endif
