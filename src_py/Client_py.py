import sys
import socket

def main(ip_server="127.0.0.1", port_server=5000):
    # Create TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_address = (ip_server, port_server)
    sock.connect(server_address)
    print("Connected to", server_address)

    try:
        while True:
            # Get user input
            message = input()

            # Send data
            sock.sendall(f"{message}\n".encode("utf-8"))

            # Receive response
            data = sock.recv(4096)
            if not data:
                print("Server closed connection.")
                break
            data = data.decode("utf-8")
            data = data.replace('\x04', '\n')  # We decided to use \x04 as placeholder for \n
            print(data)

    except:
        sock.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        main()
    else:
        main(sys.argv[1], int(sys.argv[2]))