// Importing the required libraries
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include "InputStream.h"
#include "Input.h"
#include "OutputStream.h"
#include "Output.h"

using namespace std;

int main(int argc, char *argv[])
{
    const char *ip_server = argv[1];
    int port_server = atoi(argv[2]);
    // Create a socket by passing the constants AF= IPU version and SOCK_STREAM= indicating that it is a TCP transport
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        perror("error creating socket");
    }
    // Creating a structure
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin)); // Reset memory at the sin address
                                  // Define the structure fields
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_server);
    sin.sin_port = htons(port_server);
    // Connect to the server
    if (connect(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0)
    {
        perror("error connecting to server");
        close(sock);
        return 1;
    }
    InputStream inStream(sock);
    Input          input(inStream);

    OutputStream outStream(sock);
    Output          output(outStream);
    // Infinite loop
    while (true)
    {
        // get msg from user
        string data_addr;
        getline(cin, data_addr);
        // Send data to the server

        int total_sent = 0;
        int msg_len = data_addr.size();
        output.write(data_addr);
        // receive data from server
        const int BUFFER_SIZE = 4096; // size of max buffer
        string full_msg = "";
        while (true)
        {                                   // Infinite loop
            // memset(buffer, 0, BUFFER_SIZE); // all buffer to zero
            std::string res = input.read();
            // We defined that $ is a placeholder for \n
            size_t pos = 0;
            while ((pos = res.find('$', pos)) != std::string::npos) {
                res.replace(pos, 1, "\n");  // replace '$' with newline
                pos += 1; // move past the replacement
            }

            // int bytes_received = recv(sock, buffer, BUFFER_SIZE, 0);
            if (res.size() < 0)
            { // if there is a problem with the receive it will return -1
                perror("recv error");
                close(sock);
                return 1;
            }

            if (res.size() == 0)
            { // if server closed
                cout << "Server closed connection." << endl;
                close(sock);
                return 0;
            }

            // append received part
            full_msg.append(res);

            // if this part was smaller than 4096, this is the end of the message
            if (res.size() < BUFFER_SIZE)
            {
                break;
            }
        }
        // print the full response
        cout << full_msg << endl;
    }

    // Close the socket
    close(sock);
    return 0;
}