# Welcome to AweSoMe Drive! 

**AweSoMe Drive** is a user-friendly app for managing and storing your files. We built this to be a comprehensive file management simulation where you can easily organize your digital life.

###  Main Features
* **File Organization:** Create, edit, and delete files or folders with an intuitive UI.
* **Permission Management:** Sophisticated access control with Read, Write, and Owner permissions.
* **Powerful Search:** Find files instantly by name or content using our search tool.

###  How it works
The system is powered by a **Node.js** server that connects to a **C++ TCP server** for safe and efficient storage of the **actual file content**, while **MongoDB** manages every other detail "behind the scenes," such as user accounts, folder structures, and permissions.

###  Tech Stack
* **Frontend:** React Native for the mobile app and React for the web browser client.
* **Backend:** Node.js & C++ TCP Server.
* **Database:** MongoDB.
* **Environment:** Docker Compose.

# How to Run the Application:    
#### **Prerequisites**
Before you begin, make sure you have the following:
* **Docker Desktop** installed and running.
* **Expo Go** app installed on your mobile phone (available on App Store/Play Store).
* **Important:** Your phone and computer **must be connected to the same Wi-Fi network**.

  **1. Configure IP:** Find your computer's local IP address (using `ipconfig` on Windows or `ifconfig` on Linux/WSL). 
**Update this IP address in the "config" file located under the **`mobile/`** folder.**

**2. Launch the System:**
Run the following command in your terminal to automatically set your IP environment variable and start all components (servers, database, and clients):

* **For Windows (PowerShell):**
    ```powershell
    $env:MY_IP = (Get-NetRoute -DestinationPrefix 0.0.0.0/0 | Sort-Object RouteMetric | Get-NetIPAddress -AddressFamily IPv4 | Select-Object -First 1).IPAddress; Write-Host "Selected Network IP: $env:MY_IP"; docker-compose up --build
    ```

* **For Linux / WSL / macOS (Bash):**
    ```bash
    export MY_IP=$(hostname -I | awk '{print $1}'); echo "Selected Network IP: $MY_IP"; docker-compose up --build
    ``
  **3. Explore:** * **Web App:** Open your browser and go to **`http://localhost:3001`**.
* **Mobile App:** Scan the QR code appearing in the terminal using the **Expo Go** app to start exploring!

* ###  Project Documentation
For a more detailed look at the project, including screenshots of the app in action, and step-by-step guides, check out our local Wiki:

👉 **[View the Wiki Directory](./wiki/index.md)**

  
