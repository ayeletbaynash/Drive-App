# Base image with gcc and cmake
FROM gcc:latest

# Install CMake
RUN apt-get update && apt-get install -y cmake

# Copy all source code into the container
COPY . /usr/src/mytest
WORKDIR /usr/src/mytest

# Set environment variable
ENV PROJECT_DIR=/usr/src/mytest/app
RUN mkdir -p /usr/src/mytest/app

# Create build directory
RUN mkdir build
WORKDIR /usr/src/mytest/build

# Compile all code + create executables
RUN cmake .. && make

# Default command: run the main application
CMD ["./appExec"]