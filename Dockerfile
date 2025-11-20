FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /

COPY . /

#to compile
RUN cmake .. && make 

#Run tests
CMD ["./runTests"]

