# Drive-App
Drive App is a comprehensive file management simulation. 
Awesome Drive is a user-friendly app for managing and storing your files. With this app, you can easily create or import files, organize them into folders, and manage different user permissions (Read, Write, or Owner). It also features a powerful search tool to find files by their name or content. The system works with a Node.js server that connects to a C++ TCP server, which handles the actual file storage safely.    
<img width="1282" height="1008" alt="image" src="https://github.com/user-attachments/assets/5bd43656-0f25-4ca4-b85a-68e3354657bc" />

 # File & Folder Operations: 
    
**New Folder:** Create a new folder with a custom name to organize your files.

**New Text File:** Create a new text file by choosing a name and writing its content.

**Upload File:** Upload PDF, text, or image files from your computer directly to the app.

**Search:** Search for specific terms within file names or even inside the file content.

**View Content:** Double-click any item to view its content (view text for files, or see all items inside a folder).

**Add to Favorites (Star):** Mark files as favorites to easily find them in the "Starred" tab.

**Download:** Download a single file or an entire folder (including all its content) to your computer.

**Rename:** Change the name of any file or folder at any time.

**Remove:** Move files or folders to the "Trash." They can be restored later or deleted permanently.

**Permanent Delete:** Fully remove a file or folder from the system (available only for items already in the Trash).

**Restore:** Move an item out of the Trash and back to its original location.

**Edit Content:** Update the text inside an existing text file.

**Edit Image:** Replace an existing image with a new one from your computer.

**File Details:** View metadata such as name, ID, creation time, last update, owner, and permissions.

**Make a Copy:** Create an exact copy of a file with the same content (labeled as "Copy").

**Share:** Owners can manage permissions and share access with other users.

**Move To**: Move a file or folder into a different folder by selecting from a list of available locations.
 # App Pages:

**Home:** Displays all items you have access to, including your own files and those shared with you.

**My Drive:** Displays only the files and folders that you own.

**Shared with Me:** Displays files and folders that others have given you permission to access.

**Recent:** Shows files sorted by their last update time, with the most recent ones at the top.

**Starred:** A quick view of all items you have marked with a star.

**Trash:** Displays all items that have been deleted but not yet permanently removed
# How to Run the Application:    
**Getting Started**  
Follow these steps to get the application up and running on your local machine:
**1. Run the Application**  
The entire system is containerized using Docker. To build and start all services (Frontend, Node.js API, and C++ TCP Server), run the following command in your terminal:  
docker-compose up --build -d  
**2. Access the App**  
Once the containers are running, open your browser and navigate to: http://localhost:3001 
**3. Registration & Login**    
You will be greeted by the Login page.    
If you don't have an account yet, click the "Register here" link at the bottom of the page.  
Fill in your details (name, username, email, password, and profile image) to create an account.  
After registering, log in with your credentials to start managing your files.
![registration](https://github.com/user-attachments/assets/0d2fead2-363d-4011-9cc4-7d3c528459e7)
![login](https://github.com/user-attachments/assets/2d0ccfaf-0f77-4e1e-acea-21dfb5db2bc9)
**4. Start Exploring**  
Once logged in, you can perform all file operations, manage permissions, and organize your drive.  

**We hope you enjoy using Awesome Drive!**



