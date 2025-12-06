# Base image with gcc and cmake
FROM gcc:latest

# Install CMake + Python in one contaner 
RUN apt-get update && apt-get install -y cmake python3 python3-pip

# Set working directory
WORKDIR /usr/src/mytest

# Copy C++ source and test files
COPY src/ ./src
COPY tests/ ./tests
COPY CMakeLists.txt ./CMakeLists.txt

# Copy Python scripts
#COPY python_scripts/ ./python_scripts    ->     when created- dont forget to take off # and change name

# Set environment variable
ENV PROJECT_DIR=/usr/src/mytest/app
RUN mkdir -p /usr/src/mytest/app

# Create build directory
RUN mkdir build
WORKDIR /usr/src/mytest/build

# Compile all code + create executables
RUN cmake .. && make

# Default command: run the main application
CMD ["./runTests"]