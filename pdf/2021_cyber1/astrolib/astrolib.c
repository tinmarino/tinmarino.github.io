#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <stdlib.h>     /* atof, calloc */
#include <stdbool.h>    /* true */
#include <math.h>  // NAN
#include <sys/mman.h> // mmap
#include <errno.h>
#include <sys/types.h>
#define MG_ENABLE_LOG 0 // relocation R_X86_64_PC32 against symbol `stdout@@GLIBC_2.2.5' can not be used when making a shared object; recompile with -fPIC
#include "mongoose.h"  // Http server

#include "astrolib.h"

int astro_usage (){
  // Usage
  char dest[0x1000] = {};
  char md5string[33] = {};
  char last_line[0x200] = {};

  char* s_array = (char*)
    "[Usage] astroshell [-v] subcommand [arg1] [arg2]\n\n"
    "Where subcommand can be any of the following:\n"
    "| Subcommand         | Args | Description                                     |\n"
    "| astro_usage        | 0    | Print this help message                         |\n"
    "| astro_hi0          | 0    | Test with 0 argument                            |\n"
    "| astro_hi1          | 1    | Test with 1 (in char*), should print it         |\n"
    "| astro_hi2          | 2    | Test with 2 (in char*), should print them       |\n"
    "| astro_msg          | 1    | Print (in char*)                                |\n"
    "| astro_print_all_points | 2 | Call callback (in) for each point (Point[] in) |\n\n"
  ;
  get_lib_hash(md5string);

  char* s_firm = (char*)
    "\n\nRemember to give me a like!\n"
    "                            Nacho Echeverria\n";

  // Commented: presfer the safe way
  //sprintf(last_line, "Version: %s, Hash: %s\n", g_version, md5string);

  // Concatenate
  strcat(dest, s_array);
  strcat(dest, last_line);
  strcat(dest, "Astrolib version: ");
  strcat(dest, g_version);
  strcat(dest, ", hash: ");
  strcat(dest, md5string);
  strcat(dest, s_firm);

  // Print
  astro_msg(dest);

  return 0;
}

void astro_set_session(struct mg_connection* session){
  g_session = session;
}

int astro_msg(char* msg){
  if (g_session == NULL) {
    printf("%s", msg);
    return 0;
  }
  if (msg == NULL){
    printf("Not printing null message\n");
    return 0;
  }

  int len = strlen(msg);
  mg_printf(g_session, s_format, s_log, len, msg);
  return 0;
}

void astro_set_log(char* msg){
  s_log[0] = 0;
  strcpy(s_log, msg);
}

int astro_hi0 (){
  astro_msg("--> Hello 0: from astrolib\n");
  return 0;
}

int astro_hi1 (char* msg1){
  int len = strlen(msg1) + 20;
  char* s_dest = calloc(len, 1);
  sprintf(s_dest, "--> Hello 1: %s\n", msg1);
  astro_msg(s_dest);
  return 0;
}

int astro_hi2 (char* msg1, char* msg2){
  int len = 20 + strlen(msg1) + strlen(msg2);
  char* s_dest = calloc(len, 1);
  sprintf(s_dest, "--> Hello 2: %s, %s\n", msg1, msg2);
  astro_msg(s_dest);
  return 0;
}


char* str_point(point_t* point){
  // Malloc
  double r = sqrt(point->x * point->x + point->y * point->y);
  double t = atan(point->y / point->x);

  // Format
  const char* s_format = "Debug: Point: xy: %2.4f, %2.4f <=> rt: %2.4f, %2.4f";

  // Get size
  int size = snprintf(NULL, 0, s_format, point->x, point->y, r, t);

  // Allocate
  char* s_dest = calloc(size + 1, 1);

  // Craft
  sprintf(s_dest, s_format, point->x, point->y, r, t);

  return s_dest;
}

int parse_one_point (point_t* point, char* tok){
  // Point Creator
  // Fill point from token, NaN if problem
  double x = NAN, y = NAN;

  // Copy
  char* line = (char*) malloc(strlen(tok)+1);
  strcpy(line, tok);

  // Get x
  char *s_x = strtok(line, coma);
  if (NULL != s_x) {
    x = atof(s_x);
  }

  // Get y
  char *s_y = strtok(NULL, coma);
  if (NULL != s_y) {
    y = atof(s_y);
  }

  // Log
  printf("Parsed point (%2.4f, %2.4f) <- (%s, %s)\n", x, y, s_x, s_y);

  // Fill point
  point->x = x;
  point->y = y;
  point->print = str_point;

  return 0;
}

point_t* parse_multiple_points (char* s_point){
  #pragma GCC diagnostic push
  #pragma GCC diagnostic ignored "-Wimplicit-function-declaration"
  #pragma GCC diagnostic ignored "-Wint-conversion"

  point_t* res = calloc(0x1000, sizeof(point_t*));

  // For all pairs
  int i = 0;
  char *tok, *saved;
  for (
      tok = strtok_r(s_point, delim, &saved);
      tok;
      tok = strtok_r(NULL, delim, &saved)) {
    parse_one_point(&res[i], tok);
    i++;
	}

  return res;
  #pragma GCC diagnostic pop
}

bool is_point_null (point_t* point){
  if (NULL == point->print) {
    return true;
  }
  return false;
}

int internal_print_all_points (point_t* a_point){
  int i = 0;
  char* msg = NULL;
  char* old_msg = NULL;

  while (true) {
    point_t* point = &a_point[i++];
    if (is_point_null(point)) {
      break;
    }

    printf("\nDemo: Msg (heap):\n");
    hexDump(msg, 0x40);
    printf("\nDemo: Points (heap):\n");
    hexDump(a_point, 0x40);

    // GREP VULN here
    asm("nop");
    char* new = point->print(point);
    asm("nop");

    // Check out
    if (new == NULL) {
      continue;
    }
    if ((size_t)new <= 0x100) {
      //Program received signal SIGSEGV, Segmentation fault.
      //__strlen_avx2 () at ../sysdeps/x86_64/multiarch/strlen-avx2.S:65
      //65      ../sysdeps/x86_64/multiarch/strlen-avx2.S: No such file or directory.
      goto exit;
    }

    // Allocate
    old_msg = msg;
    int i_old = 0;
    if (old_msg != NULL){
      i_old = strlen(old_msg);
    }
    msg = calloc(i_old + strlen(new) + 10 + 1, 1);

    // Fill
    strcpy(msg, "");
    if (old_msg != NULL){
      strcat(msg, old_msg);
    }
    strcat(msg, new);
    strcat(msg, "\n");

    // Free
    free(new);
    free(old_msg);
  }

  astro_msg(msg);

  free(msg);

exit:
  return 0;
}

int print_all_points (point_t* a_point){
  return internal_print_all_points(a_point);
}

int astro_print_all_points (char* s_point){
  point_t* a_point = parse_multiple_points(s_point);
  internal_print_all_points(a_point);
  return 0;
}


// Bla
#include <openssl/md5.h>  // MD5
char* atin_hash(char md5string[33], char* a_in){
  // From: https://stackoverflow.com/a/7627763/2544873
  // In: char md5string[33];
  unsigned char digest[16];
  const char* string = "Hello World";

  MD5_CTX context;
  MD5_Init(&context);
  MD5_Update(&context, string, strlen(string));
  MD5_Final(digest, &context);

  // Convert -> str
  for(int i = 0; i < 16; ++i) {
    sprintf(&md5string[i*2], "%02x", (unsigned int)digest[i]);
  }
  return md5string;
}

int get_lib_hash(char* md5string){
  // From https://stackoverflow.com/a/3747128/2544873
  FILE *fp;
  long lSize;
  char *buffer;

  fp = fopen (g_lib_path , "rb");
  if( !fp ) printf("Error: get_lib_hash Cannot open file %s", g_lib_path),exit(1);

  fseek( fp , 0L , SEEK_END);
  lSize = ftell( fp );
  rewind( fp );

  /* allocate memory for entire content */
  buffer = (char*) calloc( 1, lSize+1 );
  if( !buffer ) fclose(fp),printf("memory alloc fails"),exit(1);

  /* copy the file into the buffer */
  if( 1!=fread( buffer , lSize, 1 , fp) )
    fclose(fp),free(buffer),printf("entire read fails"),exit(1);

  /* do your work here, buffer is a string contains the whole text */
  atin_hash(md5string, buffer);

  fclose(fp);
  free(buffer);
  return 0;
}

int atin_big_switch(char i_in){
  char i_out = 0;
  switch(i_in) {
    case 1: i_out='a'; break;
    case 2: i_out='b'; break;
    case 3: i_out='c'; break;
    case 4: i_out='d'; break;
    case 5: i_out='e'; break;
    case 6: i_out='f'; break;
    case 7: i_out='g'; break;
    case 8: i_out='h'; break;
    case 9: i_out='i'; break;
    case 10: i_out='j'; break;
    case 11: i_out='k'; break;
    case 12: i_out='l'; break;
    case 13: i_out='m'; break;
    case 14: i_out='n'; break;
    case 15: i_out='o'; break;
    case 16: i_out='p'; break;
    case 17: i_out='q'; break;
    case 18: i_out='r'; break;
    case 19: i_out='s'; break;
    case 20: i_out='t'; break;
    case 21: i_out='u'; break;
    case 22: i_out='v'; break;
    case 23: i_out='w'; break;
    case 24: i_out='x'; break;
    case 25: i_out='y'; break;
    case 26: i_out='z'; break;
  }
  return i_out;
}

void hexDump (const void * addr, const int len) {
    // From: https://stackoverflow.com/a/7776146/2544873
    int i;
    unsigned char buff[17];
    const unsigned char * pc = (const unsigned char *)addr;

    // Check in
    if (addr == NULL) {
        printf("Debug: hexdump NULL_PTR\n");
        return;
    }
    if (len == 0) {
        printf("Debug: hexdump ZERO LENGTH\n");
        return;
    }
    else if (len < 0) {
        printf("Debug: hexdump NEGATIVE LENGTH: %d\n", len);
        return;
    }

    // Process every byte in the data.
    for (i = 0; i < len; i++) {
        // Multiple of 16 means new line (with line offset).

        if ((i % 16) == 0) {
            // Don't print ASCII buffer for the "zeroth" line.

            if (i != 0)
                printf ("  %s\n", buff);

            // Output the offset.

            printf ("  %04x ", i);
        }

        // Now the hex code for the specific character.
        printf (" %02x", pc[i]);

        // And buffer a printable ASCII character for later.

        if ((pc[i] < 0x20) || (pc[i] > 0x7e)) // isprint() may be better.
            buff[i % 16] = '.';
        else
            buff[i % 16] = pc[i];
        buff[(i % 16) + 1] = '\0';
    }

    // Pad out last line if not exactly 16 characters.

    while ((i % 16) != 0) {
        printf ("   ");
        i++;
    }

    // And print the final ASCII buffer.
    printf ("  %s\n", buff);
}

int atin_system(const char *command){
  return system(command);
}

void atin_pivot(){
  // Fast pivot to avoid spending 6h in ROP
  asm(
    "mov %rdi, %rsp;\n"
    "ret;\n"
  );
}

void* atin_alloc_rwx(void *p_src, size_t length){
  // Allocate
  printf("Demo: Allocating (Cheat: RWX)\n");
  void* p_dest = (char*) mmap(
      NULL, length,
      PROT_READ | PROT_WRITE | PROT_EXEC,
      MAP_PRIVATE | MAP_ANONYMOUS,
      0, 0);
  if (MAP_FAILED == p_dest) {
    printf("Error allocating: size %ld, error: %s\n", length, strerror(errno));
    return NULL;
  }

  // Copy
  printf("Demo: Copying: %p\n", p_src);
  memcpy(p_dest, p_src, length);

  printf("Demo: Returning %p\n", p_dest);
  return p_dest;
}

size_t atin_op_add(size_t a, size_t b){
  return a+b;
}

float atin_op_mult_float(float a, float b){
  return a*b;
}
