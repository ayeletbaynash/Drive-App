#ifndef ICOMPRESS_H
#define ICOMPRESS_H

#include <string>

// Abstract Base Class (Interface) defining the contract for all compression strategies
class ICompress {
public:
    virtual ~ICompress() = default; // for destructor
    virtual std::string compress(const std::string& raw_data) = 0; // Receives raw data and returns its compressed form.
    virtual std::string decompress(const std::string& compressed_data) = 0; // Receives compressed data and returns the original uncompressed form.
};

#endif