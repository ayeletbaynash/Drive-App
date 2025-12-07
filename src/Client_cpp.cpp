//Importing the required libraries
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

using namespace std;

int main(int argc, char* argv[]) {
    const char* ip_server = argv[1];
    int port_server = atoi(argv[2]);
//Create a socket by passing the constants AF= IPU version and SOCK_STREAM= indicating that it is a TCP transport
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
    }
//Creating a structure
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin)); //Reset memory at the sin address
     //Define the structure fields
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_server);
    sin.sin_port = htons(port_server);
// Connect to the server
    if (connect(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error connecting to server");
        close(sock);
        return 1;
    }
    //Infinite loop
    while (true){
// get msg from user
    string data_addr;
    getline(cin, data_addr);
     // Send data to the server
    
    int total_sent = 0;
    int msg_len = data_addr.size();

    while (total_sent < msg_len) {
        int sent = send(sock,
                        data_addr.c_str() + total_sent, //bits that need to be sent
                        msg_len - total_sent,           //how much bits left
                        0);

        if (sent < 0) {
            perror("send error");
            close(sock);
            return 1;
        }

        total_sent += sent;  //count how much was sent until now
}
// receive data from server 
    const int BUFFER_SIZE = 4096; //size of max buffer
    char buffer[BUFFER_SIZE];
    string full_msg = ""; 

    while (true) { //Infinite loop
        memset(buffer, 0, BUFFER_SIZE);//all buffer to zero
        int bytes_received = recv(sock, buffer, BUFFER_SIZE, 0);

        if (bytes_received < 0) { //if there is a problem with the receive it will return -1
            perror("recv error");
            close(sock);
            return 1;
    }

        if (bytes_received == 0) { //if server closed
            cout << "Server closed connection." << endl;
            close(sock);
            return 0;
        }

        // append received part
        full_msg.append(buffer, bytes_received);

        // if this part was smaller than 4096, this is the end of the message
        if (bytes_received < BUFFER_SIZE) {
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