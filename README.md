# Drive-App
Drive App is a simple file management simulation. It allows you to:
Add files with content, get files and search for text across files

**Command	Description**
add [file name] [text]	Adds a file with the given name and content.\n
get [file name]	Retrieves the content of the specified file.
search [text]	Searches all files for the given text. 

**Example Usage**
add file1 Hello World 
get file1         //return Hello World 
search Hello      // return file1


**How to Run the Application:**
docker build -t myapp .

![build command](https://github.com/user-attachments/assets/90873f7d-f86f-488c-95ae-98d8a9d0cdf8)
![build run](https://github.com/user-attachments/assets/eb6eb518-f011-46e7-818b-6c86a0adc9da)


**To run the app:**
docker run --rm -it -v mydata:/usr/src/mytest/app myapp

![run app command](https://github.com/user-attachments/assets/cbeae59b-8023-4229-b000-d36d13b115cf)
![example](https://github.com/user-attachments/assets/c3e81f1a-af08-4fbf-9cbf-fc3bbf6ba8ac)

**How to Run Tests:**

docker run --rm -it myapp ./runTests
![run tests command](https://github.com/user-attachments/assets/356cb904-858e-4148-9022-874474cd7bf2)
![tests run](https://github.com/user-attachments/assets/c108d447-0553-4d78-a545-0a9e6c39abf2)


