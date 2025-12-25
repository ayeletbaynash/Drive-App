# Drive-App
Drive App is a comprehensive file management simulation. 
The system allows users to register, upload, get, edit and delete files, manage permissions (read/write/owner), and search for files by name or content.
It features a Node.js/Express REST API gateway that manages users, permissions, and file metadata, communicating with a robust C++ TCP Server for physical file storage and low-level operations.

# API Commands  
Since the application exposes a RESTful API, operations are performed via HTTP requests.  

**Register User:** POST /api/users - Creates a new user in the system.  
{Requires: username, password, emailAddress, image}  
**Login:** POST /api/tokens - Authenticates a user and returns their ID.  
{Requires: username, password}   
**Get User:** GET /api/users/:id - Retrieves public profile information for a specific user.  
**Get Root Files:** GET /api/files - Retrieves files and folders in the user's root directory.    
**Post File:**	POST	/api/files	- Creates a new file with the given name and content.  
{Requires in body: name, type (folder/file), parent_id (if exist) content (optional)}  
**Get File:**	GET	/api/files/:id	- Retrieves the content of the file specified by its numeric ID.  
**Update File:**  PATCH  /api/files/:id - Updates a file's name or content.  
{Requires in body: content/name/parentID (depending on what type of change you want to make}  
**Search:**	GET	/api/search/:query	- Searches all files for the given text (in name or content) and returns matching files.  
**Delete:**	DELETE	/api/files/:id	- Deletes the file and its content recursively by its numeric ID.   
**Get Permissions:**  GET /api/files/:id/permissions  - Lists all users who have permissions for a specific file.   
**Post Permission:**  POST /api/files/:id/permissions  - Grants 'read' or 'write' permission to another user.  
{Requires in body: userID, permission (read, write, owner)}  
**Edit Permission:**  PATCH /api/files/:id/permissions/:pId  - Updates an existing permission type.  
{Requires in body: permission (read, write, owner)}  
**Remove Permission:**  DELETE /api/files/:id/permissions/:pId  - Revokes a specific permission from a user.  
- Note: The user-id header must be included in every request, regardless of whether a body is present, excluding User Registration & Authentication requests.

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


