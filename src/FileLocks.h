#ifndef FILELOCKS_H
#define FILELOCKS_H
#include <unordered_map>
#include <mutex>
#include <string>

//global map that stores a mutex for each file
inline std::unordered_map<std::string, std::mutex> fileLocks;


//ennsures that creating or accessing a mutex for a file is thread-safe akso
inline std::mutex mapLock;   

// Returns a reference to the mutex for a given filename and if the mutex does not exist yet, it is create automatically
inline std::mutex& getFileMutex(const std::string& filename) {
    std::lock_guard<std::mutex> guard(mapLock); // Lock the map while accessing the file mutex
    return fileLocks[filename];  // creates a new mutex if it does not exist
}

#endif