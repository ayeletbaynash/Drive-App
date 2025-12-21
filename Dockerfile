# Base image with gcc and cmake
FROM gcc:latest

# Install CMake + Python in one contaner 
RUN apt-get update && apt-get install -y cmake python3 python3-pip

# Set working directory
WORKDIR /usr/src/mytest

# Copy C++ and python source and test files
COPY src/ ./src
COPY tests/ ./tests
COPY CMakeLists.txt ./CMakeLists.txt

# Set environment variable
ENV PROJECT_DIR=/usr/src/mytest/app
RUN mkdir -p /usr/src/mytest/app
ENV THREAD_POOL_SIZE=8

# Create build directory
RUN mkdir build
WORKDIR /usr/src/mytest/build
COPY src_py/ .

# Compile all code + create executables
RUN cmake .. && make
