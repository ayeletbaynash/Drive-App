# Drive-App
Drive App is a simple file management simulation. It allows you to:  
Post files with content, delete them, get files and search for text across files.  
In addition it supports multiple clients in both C++ and Python.

**Command	Description**  
post [file name] [text]	Posts a file with the given name and content.  

get [file name]	Retrieves the content of the specified file.  

search [text]	Searches all files for the given text in their name or content, returns file name.   

delete [file name] Deletes the file and its content.

**Example Usage**  
post file1 Hello World   // return: 201 Created  
get file1                // return: 200 OK \n\n Hello World   
search Hello             // return: 200 OK \n\n file1  
delete file1             // return: 204 No Content  


**How to Run the Application:**  
docker build -t myapp .  

![build command](https://github.com/user-attachments/assets/90873f7d-f86f-488c-95ae-98d8a9d0cdf8)
![build run](https://github.com/user-attachments/assets/eb6eb518-f011-46e7-818b-6c86a0adc9da)


**To run the app:**  
**1st terminal - server:**  
First open and enter the container:  
docker run -it --rm --name mycontainer myapp bash  
<img width="259" height="17" alt="docker_run" src="https://github.com/user-attachments/assets/b08d657b-7a28-4c33-95f1-09e6548867eb" />

Then run the server:  
./serverExec 5000  
<img width="329" height="17" alt="server_run" src="https://github.com/user-attachments/assets/7cecfebe-173a-4c78-b442-724ab0c81c6f" />

**2nd terminal - client in cpp**  
First enter the container:  
docker exec -it mycontainer bash  
<img width="329" height="17" alt="server_run" src="https://github.com/user-attachments/assets/f81dbf2d-9cca-44b1-b896-55072651f73d" />

Then run the cpp client:  
./clientCpp 127.0.0.1 5000  
<img width="380" height="13" alt="clientcpp" src="https://github.com/user-attachments/assets/ba693961-65f4-440a-85ea-63307dd628d2" />

**3rd terminal - client in python**  
Again enter the container:  
docker exec -it mycontainer bash  
<img width="187" height="16" alt="docker_exec" src="https://github.com/user-attachments/assets/6fd2b024-0b6f-4cd0-943f-9b13521434cb" />

Then run the python client:  
python3 Client_py.py  
<img width="343" height="14" alt="clientpy" src="https://github.com/user-attachments/assets/28e49cab-a33b-41a9-8658-d4cd0bc1eafc" />


**How to Run Tests:**  

docker run --rm -it myapp ./runTests  
![run tests command](https://github.com/user-attachments/assets/356cb904-858e-4148-9022-874474cd7bf2)
![tests run](https://github.com/user-attachments/assets/c108d447-0553-4d78-a545-0a9e6c39abf2)


**Design Decisions and How They Support the Open/Closed Principle**

**Renaming Existing Commands**
Renaming commands did not require any changes to the existing code. Since the system uses a map that links a command name to its corresponding action, all we needed to do was update the map so that the new name points to the same existing functionality. The underlying implementation remained untouched.

**Adding New Commands**
Adding a new command required only creating a new file that implements the command and registering it in the command map, just like the existing ones. No modifications to the old code were needed.

**Changing Command Output Format**
Adjusting the output format was slightly less convenient, but still did not require modifying existing implementations. We introduced an additional map for system codes, so each command’s response is processed through this map to translate codes into their desired representation. This allows future changes to the output format without altering the original command logic.

**Switching Input/Output to Work Over Sockets**
Supporting socket-based input/output required adding new wrapper classes around the previously implemented classes. These wrappers handle the communication layer, while the original classes remained unchanged. This design keeps the system closed for modification and open for extension, fully aligning with the Open/Closed Principle.
