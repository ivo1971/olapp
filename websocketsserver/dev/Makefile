CFLAGS := 

CPPFLAGS := -std=c++11 -pthread

CXX = clang++

COMPILE.cpp = $(CXX) $(INCLUDE_PATHS) $(CFLAGS) $(CPPFLAGS) -c

SOURCES := $(shell find . -type f -iname '*.cpp')

HEADERS := $(shell find . -type f -iname '*.h')

OBJECTS := $(foreach x, $(basename $(SOURCES)), $(x).o)

INCLUDE_PATHS := -I../resources/seasocks-master/src/main/c -I../resources/json/

LIBRARY_PATHS := -L../resources/seasocks-master/build/src/main/c

LIBRARIES := -lseasocks

%.o : %.cpp  $(HEADERS)
	$(COMPILE.cpp) $<

server: $(OBJECTS)
	$(CXX) -o server $(CFLAGS) $(CPPFLAGS) $(OBJECTS) $(LIBRARY_PATHS) $(LIBRARIES)

clean:
	rm -f server $(OBJECTS)



