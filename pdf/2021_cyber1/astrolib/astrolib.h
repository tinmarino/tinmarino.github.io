#pragma once
#include "mongoose.h"  // Http server
/* All functions return int
  The type, and numbre of parameters is in the _cc_ if func_cc_t
*/

// Globals
const char* g_version = (char*) "1.0";
const char* g_lib_path = "./astrolib.so";
struct mg_connection* g_session = NULL;
char s_log[0x1000] = {};
const char* s_format =
  "HTTP/1.1 200 OK\r\n"
  "Content-Type: text/html; charset=utf-8\r\n"
  "Warning: %s\r\n"
  "Content-Length: %04d       \r\n\r\n"
  "%s"
  ;
int g_verbose = 0;
const char* delim = ":\n";
const char* coma = ",";

// Typedef
typedef int (*func_t)(void);
typedef int (*func_i_t)(int);
typedef int (*func_c_t)(char*);
typedef int (*func_v_t)(void*);
typedef int (*func_cc_t)(char*, char*);
struct point_t;
typedef int (*func_p_t)(struct point_t*);
typedef char* (*func_p_s_t)(struct point_t*);
typedef struct point_t {
  double x;
  double y;
  func_p_s_t print;
} point_t;

// Declare
int get_lib_hash(char* md5string);
void hexDump (const void * addr, const int len);

// Util
__attribute__ ((visibility ("default"))) void astro_set_log(char* msg);
__attribute__ ((visibility ("default"))) void astro_set_session(struct mg_connection* session);

// Export
__attribute__ ((visibility ("default"))) int astro_usage();

__attribute__ ((visibility ("default"))) int astro_hi0 ();
__attribute__ ((visibility ("default"))) int astro_hi1 (char* msg1);
__attribute__ ((visibility ("default"))) int astro_hi2 (char* msg1, char* msg2);

__attribute__ ((visibility ("default"))) int astro_msg(char* msg);
__attribute__ ((visibility ("default"))) int astro_print_all_points (char* s_point);

// Wrongly exported
__attribute__ ((visibility ("default"))) int print_all_points (point_t* point_t);
