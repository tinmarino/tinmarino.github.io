#include <dlfcn.h>
#include <string.h>
#include <stdio.h>  // Printf not complaining
#include "astrolib.h"


void print_usage(void* handle){
  if (NULL == handle) {
    return;
  }
  func_t fct = (func_t) dlsym(handle, "astro_usage");
  fct();
}

int say (const char* format, ...){
  if (0 == g_verbose) {
    return 1;
  }
  va_list argptr;
  va_start(argptr, format);

  // Append newline
  char dest[strlen(format)+10];
  strcpy(dest, "INFO: ");
  strcat(dest, format);
  strcat(dest, "\n");
  vfprintf(stderr, dest, argptr);
  va_end(argptr);
  return 0;
}

int main(int argc, char **argv) {
  int res = 0;
  int i_arg = argc-2;
  char* error = NULL;
  int id0 = 1;  // First index of argument (function name)


  // Get handle to lib
  dlerror();  // Clear error buffer;
  void* handle = dlopen(g_lib_path, RTLD_LAZY);
  if (NULL == handle) {
    printf("Error cannot dynamically link to astrolib in current path\n");
    if ((error = dlerror()) != NULL)  {
      printf("Error: %s\n", error);
      return 81;
    }
    print_usage(handle);
    return 82;
  }

  // Clause: at least one argument
  if (argc <= id0) {
    printf("AstroShell, command line for common labor\n\n");
    print_usage(handle);
    return 83;
  }

  // Set the verbosity if asked
  if (!strcmp(argv[id0], "-v")) {
      g_verbose=1;
      id0++;
      i_arg--;
  }

  // Check still on
  if (argc <= id0) {
    printf("Error: %s need at least one function argument\n", argv[0]);
    print_usage(handle);
    return 85;
  }

  // Print help if asked
  if (!strcmp(argv[id0], "-h")) {
      printf("AstroShell, command line for common labor\n\n");
      print_usage(handle);

      return 86;
  }


  // Get fct name to call
  char* s_fct = argv[id0];

  say("[Get] Handle: 0x%lx", (size_t) handle);
  say("[Callback] %s <- will be called", s_fct);

  //int i = 42 / 0;

  // Dispatch
  switch (i_arg) {
    case 0:
      say("[Arg 0]");
      int (*fct0)();
      fct0 = (int (*)()) dlsym(handle, s_fct);
      if (NULL == fct0){
        say("Error (0 arg) no function named %s in astrolib", s_fct);
        return 22;
      }
      say("[Calling] %p <= %s", fct0, s_fct);
      res = fct0();
      break;

    case 1:
      say("[Arg 1]: %s", argv[id0+1]);
      int (*fct1)(char*);
      fct1 = (int (*)(char*)) dlsym(handle, s_fct);
      if (NULL == fct1){
        say("Error (1 arg) no function named %s in astrolib", s_fct);
        return 23;
      }
      say("[Calling] %p <= %s", fct1, s_fct);
      res = fct1(argv[id0+1]);
      break;

    case 2:
      say("[Arg 2]: %s %s", argv[id0+1], argv[id0+2]);
      int (*fct2)(char*, char*);
      fct2 = (int (*)(char*, char*)) dlsym(handle, s_fct);
      if (NULL == fct2){
        say("Error (2 arg) no function named %s in astrolib", s_fct);
        return 24;
      }
      say("[Calling] %p <= %s", fct2, s_fct);
      res = fct2(argv[id0+1], argv[id0+2]);
      break;

    default:
      printf("Error: You gave me more than 2 arguments for the function call\n");
  }

  return res;
}
