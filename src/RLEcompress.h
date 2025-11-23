#ifndef RLECOMPRESS_H
#define RLECOMPRESS_H

#include "ICompress.h"
#include <string>

// RLECompression is a class that inherits from the ICompress interface.
// It is responsible for providing the core logic (Strategy) for compression and decompression of data within the system.
class RLECompression : public ICompress {
public:
    std::string compress(const std::string& raw_data) override;
    std::string decompress(const std::string& compressed_data) override;
};

#endif // RLECOMPRESS_H