####################################################################################
#
# Can be improved further with make build-in rules
#
# Auto-dependencies according to:
# - http://bruno.defraine.net/techtips/makefile-auto-dependencies-with-gcc/
# - http://make.mad-scientist.net/papers/advanced-auto-dependency-generation/
#
#
####################################################################################

CXX           := clang++

CFLAGS        := 
CPPFLAGS      := -std=c++11 -pthread
DEPFLAGS      := -MMD -MP -o $@

COMPILE.cpp   := $(CXX) $(DEPFLAGS) $(INCLUDE_PATHS) $(CFLAGS) $(CPPFLAGS) -c

SOURCES       := $(shell find . -type f -iname '*.cpp')
HEADERS       := $(shell find . -type f -iname '*.h')
OBJECTS       := $(foreach x, $(basename $(SOURCES)), $(x).o)
DEPENDENCIES  := $(foreach x, $(basename $(SOURCES)), $(x).d)

INCLUDE_PATHS := -I../resources/seasocks-master/src/main/c -I../resources/json/
LIBRARY_PATHS := -L../resources/seasocks-master/build/src/main/c
LIBRARIES     := -lseasocks

.PHONY: clean

%.o : %.cpp  $.d $(HEADERS)
	$(COMPILE.cpp) $<

server: $(OBJECTS)
	$(CXX) -o server $(CFLAGS) $(CPPFLAGS) $(OBJECTS) $(LIBRARY_PATHS) $(LIBRARIES)

clean:
	rm -f server $(OBJECTS) $(DEPENDENCIES)

#should be at the end of the makefile
-include $(DEPENDENCIES)


