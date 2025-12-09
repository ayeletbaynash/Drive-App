import sys
import socket

def main(ip_server="127.0.0.1", port_server=5000):
    # Create TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    sock.connect((ip_server, port_server))
    sock_file = sock.makefile("r") #wrap the socket in a file-like object for easy read one line everytime
    while True:
        #get user input
        message = input()

        #send data to the server
        sock.sendall(f"{message}\n".encode("utf-8"))

        #receive response
        data = sock_file.readline()#read until \n= when output finish
        
        data = data.replace('\x04', '\n')  # We decided to use \x04 as placeholder for \n
        print(data, end="")

    
    sock.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        main()
    else:
        main(sys.argv[1], int(sys.argv[2]))