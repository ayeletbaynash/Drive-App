#include "RLECompress.h" 
#include <sstream>      
#include <algorithm>
#include <string>
#include <stdexcept>    
#include <cctype>       

using namespace std; 

// Defining the Delimiter Character placed at the START of a count sequence.
const char ESCAPE_DELIMITER = '\\'; 

// Implementation of the COMPRESS function 
std::string RLECompression::compress(const std::string& raw_data) {
    if (raw_data.empty()) {
        return "";
    }

    stringstream ss;
    int n = raw_data.length();
    
    for (int i = 0; i < n; ++i) {
        int count = 1;
        
        // Count sequences: Counts consecutive identical characters
        while (i + 1 < n && raw_data[i] == raw_data[i + 1]) {
            count++;
            i++;
        }
        
        // The compressed data 
        ss << ESCAPE_DELIMITER << count << raw_data[i];
    }
    
    return ss.str();
}

// Implementation of the DECOMPRESS function 
std::string RLECompression::decompress(const std::string& compressed_data) {
    if (compressed_data.empty()) {
        return "";
    }

    stringstream decompressed;
    int n = compressed_data.length();
    
    for (int i = 0; i < n; ) { 
        
        // Validate Delimiter: Must start with the ESCAPE_DELIMITER.
        if (compressed_data[i] != ESCAPE_DELIMITER) {
            return decompressed.str(); 
        }
        i++; 
        
        // Read the Count (Greedy): Extracts all contiguous digits as one integer count
        std::string count_str = "";
        int j = i;
        while (j < n && isdigit(compressed_data[j])) {
            count_str += compressed_data[j];
            j++;
        }

        // Error Check: If no count is found after the delimiter, stop.
        if (count_str.empty()) {
            return decompressed.str(); 
        }

        // Convert Count: Convert the digit string to an integer
        int count;
        try {
            count = std::stoi(count_str);
        } catch (const std::exception& e) {
            return decompressed.str(); 
        }
        
        // Read the Character (Must be at index j)
        if (j >= n){
            return decompressed.str(); // return partial result
            // throw std::invalid_argument("Malformed RLE input: missing character after count");
        }

        char character = compressed_data[j];
        
        // Build Output: Append the character 'count' times
        if (count > 0) {
            decompressed.append(count, character);
        }

        i = j + 1; 
    }
    
    return decompressed.str();
}