# Environment Setup and Deployment

This guide documents the process of compiling, building, and deploying the AweSoMe Drive ecosystem using Docker Compose.

## System Architecture and Compilation
The system is designed as a multi-container architecture. When the build command is executed, Docker handles the following:

* **C++ TCP Server:** The system automatically compiles the C++ code inside a Docker container to create the executable that manages the actual file storage.
* **Node.js Backend:** The server sets up all the necessary packages (using NPM) and starts the Express API, which acts as a bridge between the users, the C++ server, and the database.
* **Database:** A MongoDB container is launched to store all the "background" information like user details, folder names, and file permissions.
* **Frontend Clients:** Both the Web version (React) and the Mobile version (React Native) are started and connected to the backend.

  
## Prerequisites
To run the system, ensure the following tools are installed:
* **Docker Desktop:** installed and run.
* **Expo Go App:** Installed on a mobile device.
* **Network:** Both the host computer and the mobile device must be connected to the same Wi-Fi network.

## 3. Configuration (IP Address)
Before running the system, the mobile client must know the host machine's local IP address to communicate with the backend.
1. To find your IP address, run the following command based on your OS:
* **On Windows:** Run `ipconfig` in the Command Prompt and look for "IPv4 Address" under your Wi-Fi adapter.
* **On Linux / WSL:** Run `ifconfig` or `hostname -I` in the terminal and look for the `inet` address.
2. Update the configuration file located at `mobile/config.js`  with this IP.

## 4. Execution Commands
We use a single-command deployment strategy to lift the entire environment. This command sets the environment variables and executes `docker-compose`.

### For Windows (PowerShell):
* **For Windows (PowerShell):**
    ```powershell
    $env:MY_IP = (Get-NetRoute -DestinationPrefix 0.0.0.0/0 | Sort-Object RouteMetric | Get-NetIPAddress -AddressFamily IPv4 | Select-Object -First 1).IPAddress; Write-Host "Selected Network IP: $env:MY_IP"; docker-compose up --build
    ```

* **For Linux / WSL / macOS (Bash):**
    ```bash
    export MY_IP=$(hostname -I | awk '{print $1}'); echo "Selected Network IP: $MY_IP"; docker-compose up --build
    ```

## 5. Accessing the Applications
After running the command, the terminal will start building the environment and display a lot of logs. This is normal.

Once the process finishes, scroll up slightly in your terminal to find the **QR Code**. 
* Open the **Expo Go** app on your phone.
* Scan the QR code to be redirected directly to the **Login page**.

### Web Application
The web version will be available via your browser.
* Open your browser and go to: **`http://localhost:3001`**
* You will be directed to the **Login page** to access your account.
