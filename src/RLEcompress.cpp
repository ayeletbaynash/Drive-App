#include "RLEcompress.h" 
#include <sstream>      
#include <algorithm>
#include <string>
#include <stdexcept>    
#include <cctype>       

using namespace std; 

// Defining the Delimiter Character placed at the START of a count sequence.
const char ESCAPE_DELIMITER = '\\'; 
const char ESCAPE_CHAR = '%'; // New escape character for data

// Implementation of the COMPRESS function 
std::string RLECompression::compress(const std::string& raw_data) {
    if (raw_data.empty()) {
        return "";
    }

    stringstream ss;
    size_t n = raw_data.size();
    
    for (size_t i = 0; i < n; ++i) {
        int count = 1;
        
        // Count sequences: Counts consecutive identical characters
        while (i + 1 < n && raw_data[i] == raw_data[i + 1]) {
            count++;
            i++;
        }
        
        char character_to_encode = raw_data[i];
        
        ss << ESCAPE_DELIMITER;
        ss << count;

        // Double Escape Check: If the character is a digit, the delimiter itself,
        // or the escape marker itself (ESCAPE_CHAR) — escape it so decompressor
        // won't confuse data with control markers.
        if (std::isdigit(static_cast<unsigned char>(character_to_encode)) ||
            character_to_encode == ESCAPE_DELIMITER ||
            character_to_encode == ESCAPE_CHAR) {
            ss << ESCAPE_CHAR;
        }

        ss << character_to_encode;
    }
    
    return ss.str();
}

// Implementation of the DECOMPRESS function 
std::string RLECompression::decompress(const std::string& compressed_data) {
    if (compressed_data.empty()) {
        return "";
    }

    stringstream decompressed;
    int n = static_cast<int>(compressed_data.length());
    
    for (int i = 0; i < n; ) { 
        
        // Validate Delimiter: Must start with the ESCAPE_DELIMITER.
        if (compressed_data[i] != ESCAPE_DELIMITER) {
            return decompressed.str(); 
        }
        i++; 
        
        // Read the Count (Greedy): Extracts all contiguous digits as one integer count
        std::string count_str = "";
        int j = i;
        while (j < n && isdigit(static_cast<unsigned char>(compressed_data[j]))) {
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
        
        // Read Character or Escape Sequence
        if (j >= n) return decompressed.str();

        // Check if the next character is the data escape character ('%')
        if (compressed_data[j] == ESCAPE_CHAR) {
            j++; // Advance past the Data Escape Character ('%')
        }
        
        // Read the Data Character: 'j' is now pointing at the actual character
        if (j >= n) return decompressed.str(); 
        char character = compressed_data[j];
        
        // Build Output: Append the character 'count' times
        if (count > 0) {
            std::string repeated_chars(count, character); 
            decompressed << repeated_chars;
        }

        i = j + 1; 
    }
    
    return decompressed.str();
}