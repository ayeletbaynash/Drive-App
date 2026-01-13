# Drive-App
Drive App is a comprehensive file management simulation. 
Awesome Drive is a user-friendly app for managing and storing your files. With this app, you can easily create or import files, organize them into folders, and manage different user permissions (Read, Write, or Owner). It also features a powerful search tool to find files by their name or content. The system works with a Node.js server that connects to a C++ TCP server, which handles the actual file storage safely.    
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

**1st terminal - server:**  
First open and enter the container:  
docker-compose up --build  
<img width="432" height="88" alt="image" src="https://github.com/user-attachments/assets/538a289b-fa2e-49aa-8121-d59d0a2a8a06" />
<img width="1600" height="813" alt="image" src="https://github.com/user-attachments/assets/adba96af-8583-4e4a-974a-0672bfdb8d3d" />


**2nd terminal - 'client'**  
Start running with the HTTP requests (works in CMD for windows and WSL to elustrate linux):

All variables in the fields can be changed. This is just a sample run.  
**User Registration & Authentication:**  
**1.** Register the first user ('admin') -> Returns HTTP 201 Created  
``` curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"1234\", \"emailAddress\": \"admin@gmail.com\", \"image\": \"admin.jpg\"}"  ```  
**2.** Get profile details for the user with ID 0 (admin)  
``` curl -i -X GET http://localhost:3000/api/users/0 ```  
**3.** Login as 'admin' -> Returns User ID (0) to confirm credentials  
```curl -i -X POST http://localhost:3000/api/tokens -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"1234\"}"```  
<img width="1600" height="953" alt="image" src="https://github.com/user-attachments/assets/3f56174d-3124-4cf2-bd72-3c47b2fcacb2" />


**File Operations & Permissions:**  
**4.** Create a root folder named 'Projects' for user 0 -> Gets ID 0  
```curl -i -X POST http://localhost:3000/api/files -H "user-id: 0" -H "Content-Type: application/json" -d "{\"name\":\"Projects\", \"type\":\"folder\", \"parent_id\": null}"```  
**5.** Create a file 'todo.txt' inside folder ID 0 -> Gets ID 1  
``` curl -i -X POST http://localhost:3000/api/files -H "user-id: 0" -H "Content-Type: application/json" -d "{\"name\":\"todo.txt\", \"type\":\"file\", \"parent_id\": 0, \"content\":\"Finish the Drive app project\"}" ```  
**6.** List all root files/folders for user 0  
```curl -i -X GET http://localhost:3000/api/files -H "user-id: 0"```  
**7.** Rename file ID 1 to 'urgent_tasks.txt' (PATCH request)  
```curl -i -X PATCH http://localhost:3000/api/files/1 -H "user-id: 0" -H "Content-Type: application/json" -d "{\"name\":\"urgent_tasks.txt\"}"```  
**8.** View specific details of file ID 1 to verify the rename  
```curl -i -X GET http://localhost:3000/api/files/1 -H "user-id: 0"```  
**9.** Delete file ID 1  
```curl -i -X DELETE http://localhost:3000/api/files/1 -H "user-id: 0"```  
**10.** Register a second user ('cat') -> Gets ID 1  
```curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"username\": \"cat\", \"password\": \"cat123\", \"emailAddress\": \"cat@gmail.com\", \"image\": \"cat.jpg\"}"```  
**11.** Create a new file 'new_document.txt' inside folder ID 0 -> Gets ID 2  
```curl -i -X POST http://localhost:3000/api/files -H "user-id: 0" -H "Content-Type: application/json" -d "{\"name\":\"new_document.txt\", \"type\":\"file\", \"parent_id\": 0, \"content\":\"Testing permissions\"}"```  
**12.** Grant 'read' permission to user ID 1 ('cat') on file ID 2  
```curl -i -X POST http://localhost:3000/api/files/2/permissions -H "user-id: 0" -H "Content-Type: application/json" -d "{\"userID\": \"1\", \"permission\": \"read\"}"```  
**13.** View all permissions for file ID 2  
```curl -i -X GET http://localhost:3000/api/files/2/permissions -H "user-id: 0"```  
**14** Update an existing permission (ID 3) for file ID 2 to 'write' (PATCH request)  
```curl -i -X PATCH http://localhost:3000/api/files/2/permissions/3 -H "user-id: 0" -H "Content-Type: application/json" -d "{\"permission\": \"write\"}"```  
**15** Delete a specific permission (ID 3) from file ID 2  
```curl -i -X DELETE http://localhost:3000/api/files/2/permissions/3 -H "user-id: 0"```  
**16** Search for files containing a specific query ('Testing') (GET request)  
```curl -i -X GET http://localhost:3000/api/search/Testing -H "user-id: 0"```  
<img width="1600" height="928" alt="image" src="https://github.com/user-attachments/assets/8602caf4-b9c7-4989-8a5e-5d8778481017" />


