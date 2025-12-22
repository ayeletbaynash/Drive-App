const net = require('net')
//defining a client object that opens a connection to the server when created.
class CppClient {
    constructor(host = '127.0.0.1', port = 5000) {
        this.host = host
        this.port = port
        this.socket = new net.Socket()
        this.buffer = ''
        //initialize connection to the server
        this.socket.connect(this.port, this.host)

        // Collect incoming data
        this.socket.on('data', (chunk) => {
            this.buffer += chunk.toString()
        })
    }

    
     //function that send a mmessage to the server
    send(message) {
        this.socket.write(`${message}\n`)
    }

     //Receive one response (until \n)
     //returns a Promise that resolves when a full line is available
    receive() {
        return new Promise((resolve) => {
            const checkBuffer = () => { //check if al the message arrived from the server
                const newlineIndex = this.buffer.indexOf('\n')
                if (newlineIndex !== -1) { //if all the answer from the server arrived (until \n)
                    // Extract the message and remove it from the buffer
                    const responseRaw = this.buffer.slice(0, newlineIndex)
                    this.buffer = this.buffer.slice(newlineIndex + 1)
                    // Convert placeholder back to newline
                    const response = responseRaw.replace(/\x04/g, '\n')
                    resolve(response)
                } else {
                    setTimeout(checkBuffer, 10)
                }
            }
            checkBuffer()
        })
    }

    //function that sent the message and return the answer from the server
    async sendAndReceive(message) {
        this.send(message)
        return await this.receive()
    }

    close() {
        this.socket.end()
    }
}

module.exports = CppClient
