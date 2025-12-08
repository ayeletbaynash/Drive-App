#include <iostream>
#include <map>
#include <thread>
#include <arpa/inet.h>
#include <unistd.h>

#include "TCPServer.h"
#include "App.h"
#include "Multithreading.h"
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
        std::cout << "Handling new client..." << std::endl;

        // Input
        //InputStreamBuf inBuf(clientSocket); //delete
        //InputStream    inStream(&inBuf);
        InputStream inStream(clientSocket);
        Input          input(inStream);

        // Output
        //OutputStreamBuf outBuf(clientSocket); //delete
        //OutputStream    outStream(&outBuf);
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

        std::cout << "Client disconnected\n";

    } catch (...) {
        std::cerr << "Error in client handler\n";
        close(clientSocket);
    }
}


// Main function: sets up the server socket, listens for incoming client connections,
// and launches a new thread to handle each client.
int main(int argc, char* argv[])
{
    // //adition- for tests
    // if (argc == 1 && std::string(argv[0]).find("runTests") != std::string::npos) {
    //     return 0;
    // }

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

    std::cout << "Server is listening on port " << port << "...\n";

    // Multithreading manager: handles launching and managing threads for each connected client.
    IThreads* threadManager = new Multithreading();

    // Accept
    while (true) {
        clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientSize);
        if (clientSocket < 0) {
            perror("accept() failed");
            continue;
        }

        std::cout << "New connection from "
                  << inet_ntoa(clientAddr.sin_addr)
                  << ":" << ntohs(clientAddr.sin_port) << std::endl;

        // creating new thread per client
        threadManager->launch([clientSocket]() {
            handleClient(clientSocket);
        });
    }

    delete threadManager;
    close(serverSocket);
    return 0;
}
