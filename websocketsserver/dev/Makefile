INCLUDE_PATHS := -I../resources/seasocks-master/src/main/c -I../resources/json/

LIBRARY_PATHS := -L../resources/seasocks-master/build/src/main/c

LIBRARIES := -lseasocks

server: server.cpp
	clang++ -std=c++11 -pthread -o server server.cpp $(INCLUDE_PATHS) $(LIBRARY_PATHS) $(LIBRARIES)
