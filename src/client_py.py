#Importing the required libraries
import socket


def main(ip_server, port_server):
    #Creating a socket by passing the constants AF= IPU version and SOCK_SR=TREAM= indicating that it is a TCP transport
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    #connect to the server at the specified IP and port
    s.connect((ip_server, port_server))
    #Ask from the user to input the first message to send
    msg = input()
    #Infinite loop
    while (True):
        #Sending the user input message to the server
        s.sendall(bytes(msg, 'utf-8'))
        #initialize an empty list to store incoming message parts
        parts = []
        #Receive the first part from the server
        part = s.recv(4096)
        #loop as long as there is data in 'part'
        while part:
            #join the received part to the list
            parts.append(part)
            #if it is the last part of the message get out from the loop
            if len(part) < 4096:
                break
            #receive the next part from the server
            part = s.recv(4096)

        # Combine all parts into a single byte string representing the full message
        data = b"".join(parts)
        #Print the response received from the server
        print(data.decode('utf-8'))
        #ask from the user to input the message to send
        msg = input()
    #close the socket
    s.close()