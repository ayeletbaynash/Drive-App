#include "gtest/gtest.h"
#include "RLEcompress.h" 
#include <string>

// Defining the Escape Delimiter as a constant for the tests
const char ESCAPE_DELIMITER = '\\';

// Test Fixture Setup
class RLECompressionTest : public ::testing::Test {
protected:
    // Instance of the class under test (RLECompression)
    RLECompression rle_compressor; 
};

// Test Core Functionality (Letters-Only and Integration Check)
TEST_F(RLECompressionTest, ShouldCompressAndDecompressLettersOnly) {
    // The raw input string
    std::string raw_data = "AAAABBCDDDD"; 
    // The expected compressed output: \4A\2B\1C\4D
    std::string expected_compressed = "\\4A\\2B\\1C\\4D"; 

    // Compression
    std::string compressed = rle_compressor.compress(raw_data);
    EXPECT_EQ(expected_compressed, compressed) << "Compression failed on letters-only input."; 

    // Decompression
    std::string decompressed = rle_compressor.decompress(compressed);
    // Verify that decompression restores the original exactly (No Data Loss)
    EXPECT_EQ(raw_data, decompressed) << "Decompression failed to restore original text.";
}

// Test edge Case - Empty Input
TEST_F(RLECompressionTest, ShouldHandleEmptyString) {
    // Compressing an empty string should return an empty string
    EXPECT_EQ("", rle_compressor.compress("")) << "Compression of empty string failed.";

    // Decompressing an empty string should return an empty string
    EXPECT_EQ("", rle_compressor.decompress("")) << "Decompression of empty string failed.";
}

// Test edge Case - Single Character
TEST_F(RLECompressionTest, ShouldHandleSingleCharacterInput) {
    std::string raw_data = "X";
    std::string expected_compressed = "\\1X";
    std::string compressed = rle_compressor.compress(raw_data);
    
    // Verify a single character is compressed as 1X.
    EXPECT_EQ(expected_compressed, compressed) << "Compression of single character failed.";

    // Verify decompression restores the original.
    EXPECT_EQ(raw_data, rle_compressor.decompress(compressed)) << "Decompression of single character failed.";
}

// Test for Multi-Digit Count Parsing
TEST_F(RLECompressionTest, ShouldHandleAllMultiDigitCounts) {
    // Test 1: Double-digit count (10+)
    std::string raw_data_double(10, 'A'); 
    raw_data_double += "B";
    EXPECT_EQ("\\10A\\1B", rle_compressor.compress(raw_data_double));
    EXPECT_EQ(raw_data_double, rle_compressor.decompress("\\10A\\1B"));

    // Test 2: Triple-digit count (100+)
    std::string raw_data_triple(100, 'X'); 
    raw_data_triple += "Y";
    EXPECT_EQ("\\100X\\1Y", rle_compressor.compress(raw_data_triple));
    EXPECT_EQ(raw_data_triple, rle_compressor.decompress("\\100X\\1Y"));

    // Test 3: Upper boundary (999)
    std::string raw_data_max(999, '9'); 
    raw_data_max += "Z";
    std::string expected_compressed = "\\999%9\\1Z";
    // Note: The '9' is treated as a data character being counted 999 times.
    EXPECT_EQ(expected_compressed, rle_compressor.compress(raw_data_max)); 
    EXPECT_EQ(raw_data_max, rle_compressor.decompress(expected_compressed));
}

// Test edge Case - No Repetition
TEST_F(RLECompressionTest, ShouldHandleInputWithNoRepetition) {
    std::string raw_data = "ABCDEFG"; 
    std::string expected_compressed = "\\1A\\1B\\1C\\1D\\1E\\1F\\1G";
    std::string compressed = rle_compressor.compress(raw_data);
    
    // Verify the algorithm returns the 1X1Y1Z... sequence.
    EXPECT_EQ(expected_compressed, compressed) << "Compression failed on non-repeating sequence.";

    // Verify decompression restores the original.
    EXPECT_EQ(raw_data, rle_compressor.decompress(compressed)) << "Decompression failed on non-repeating sequence.";
}

// Test Edge Case - Newline Characters
TEST_F(RLECompressionTest, ShouldHandleInputWithNewlineCharacters) {
    std::string raw_data = "A\n\nB"; 
    std::string expected_compressed = "\\1A\\2\n\\1B";
    
    std::string compressed = rle_compressor.compress(raw_data);
    // Verify that '\n' characters are counted and preserved.
    EXPECT_EQ(expected_compressed, compressed) << "Compression failed to handle newline characters.";

    std::string decompressed = rle_compressor.decompress(compressed);
    EXPECT_EQ(raw_data, decompressed) << "Decompression failed to restore newline characters.";
}

// Test Error Handling - Malformed RLE Input
TEST_F(RLECompressionTest, ShouldHandleMalformedRLEInputGracefully) {
    // Input missing character after count (leads to unexpected termination)
    std::string malformed_input_1 = "\\3A\\2"; 
    // Expect partial success (AAA) and stop, as the trailing '2' has no char following.
    EXPECT_EQ("AAA", rle_compressor.decompress(malformed_input_1)) 
        << "Decompression failed to handle missing character after count.";
    
    // Input starts with a character (not a digit count)
    // Expect empty string as parsing failed at the start.
    std::string malformed_input_2 = "\\A3\\B"; 
    EXPECT_EQ("", rle_compressor.decompress(malformed_input_2))
        << "Decompression must return empty string when format violation occurs at start.";
    
    // Contiguous digits parsed as a single count 
    std::string malformed_input_3 = "\\3A\\12B"; 
    EXPECT_EQ("AAABBBBBBBBBBBB", rle_compressor.decompress(malformed_input_3)) 
        << "Decompression failed to read contiguous digits as one count.";

    // Input that does not start with a delimiter (Initial Format Violation)
    // The code should return empty, because the format is required to start with '\'.
    std::string malformed_input_4 = "3A\\2B"; 
    EXPECT_EQ("", rle_compressor.decompress(malformed_input_4)) 
    << "Decompression must stop and return empty when input does not start with delimiter.";
}

// Test Correct Count/Character Consumption
TEST_F(RLECompressionTest, ShouldConsumeOnlyOneCharacterAfterCount) {
    std::string compressed_data = "\\3A\\2B";
    
    std::string expected_decompressed = "AAABB"; 

    std::string decompressed = rle_compressor.decompress(compressed_data);
    EXPECT_EQ(expected_decompressed, decompressed) << "Decompression failed to parse multiple sequences correctly.";
}

// Test for Non-Alpha/Numeric Characters
TEST_F(RLECompressionTest, ShouldHandleAllValidCharacterTypes) {
    // Input contains letters, spaces, digits as data, and symbols.
    std::string raw_data = "AA B##C$$!!@888"; 
    std::string expected_compressed = "\\2A\\1 \\1B\\2#\\1C\\2$\\2!\\1@\\3%8"; 

    std::string compressed = rle_compressor.compress(raw_data);
    EXPECT_EQ(expected_compressed, compressed) << "Compression failed on mixed special characters.";

    std::string decompressed = rle_compressor.decompress(compressed);
    EXPECT_EQ(raw_data, decompressed) << "Decompression failed on restoring mixed characters.";
}

// Test for Numeric Characters
TEST_F(RLECompressionTest, ShouldHandleAllNumericCharacterTypes) {
    // Input contains letters, spaces, digits as data, and symbols.
    std::string raw_data = "AA888999914"; 
    std::string expected_compressed = "\\2A\\3%8\\4%9\\1%1\\1%4"; 

    std::string compressed = rle_compressor.compress(raw_data);
    EXPECT_EQ(expected_compressed, compressed) << "Compression failed on mixed numeric characters.";

    std::string decompressed = rle_compressor.decompress(compressed);
    EXPECT_EQ(raw_data, decompressed) << "Decompression failed on restoring numeric characters.";
}