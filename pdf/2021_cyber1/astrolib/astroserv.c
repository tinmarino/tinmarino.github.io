#include <dlfcn.h>  // Call .so
#include <signal.h>  // Sigaction to survive
#include <stdio.h>  // sprintf
#include "mongoose.h"  // Http server


#include "astrolib.h"  // enum



// TODO from user argument
static char s_listening_address[0x100];
struct mg_mgr mgr;

// Lazy (just once)
void* handle = NULL;
func_c_t f_astro_set_log = NULL;

int mg_doc(struct mg_connection *c){
  // Serve Documentation
  const char * s_content =
    #include "html_doc.gen"
    ;
  int len = strlen(s_content);
  mg_printf(c, s_format, "AstroDoc", len, s_content);
  return 0;
}


int mg_head(struct mg_connection *c){
  // Serve Head (entry page)
  const char * s_content =
    #include "html_template.html"
    ;
  int len = strlen(s_content);
  mg_printf(c, s_format, "", len, s_content);
  return 0;
}

int mg_say (struct mg_connection *c, const char* format, ...){
  if (0 == g_verbose) {
    return 1;
  }
  // Prepate argument list
  va_list argptr;
  va_start(argptr, format);

  // Print to Mongoose client
  char* log = malloc(0x1000);
  vsprintf(log, format, argptr);
  f_astro_set_log(log);

  // End arglist
  va_end(argptr);

  return 0;
}


static void cb(struct mg_connection *c, int ev, void *ev_data, void *fn_data) {
  #pragma GCC diagnostic push
  #pragma GCC diagnostic ignored "-Wimplicit-function-declaration"
  #pragma GCC diagnostic ignored "-Wint-conversion"
  char* p_arg1 = NULL;
  char* p_arg2 = NULL;

  // Tmp
  int len;
  char* p_search = NULL;

  if (ev != MG_EV_HTTP_MSG) {
    printf("Warning: http bad event\n");
    return;
  }
  struct mg_http_message* data = (struct mg_http_message*) ev_data;

  // Get fct <- uri
  len = data->uri.len;
  char* s_fct = calloc(len + 100, 1);
  s_fct[0] = '\x00';
  if ( 1 < len ) {
    memcpy(s_fct, data->uri.ptr + 1, len-1);  // Pass the first /, copy the last zero
  }
  p_search = strstr (s_fct, "?");
  if (NULL != p_search) {
    *(p_search) = '\x00';
  }
  printf("Debug: Fct: %d, %s\n",len, s_fct);

  // Clause: Print doc
  if (0 == strcmp(s_fct, "doc")) {
    printf("Debug: Serving doc\n");
    mg_doc(c);
    return;
  }

  // Print head
  if (0 == strlen(s_fct)) {
    mg_head(c);
  }

  // Get params <- query
  len = data->query.len;
  char* s_query = calloc(len + 1, 1);
  memcpy(s_query, data->query.ptr, len);
  s_query[len] = '\x00';  // Null terminate
  printf("Debug: Received query: %s\n", s_query);

  // Decode
  int i_query = strlen(s_query);
  int i_decoded = i_query * 3;
  char* s_decoded = calloc(i_decoded * 2, 1);
  mg_url_decode(s_query, i_query, s_decoded, i_query * 3, 1);
  printf("Debug: Decoded query: %s\n", s_decoded);

  // Split with "&"
  char *tok, *saved;
  const char* delim= "&";
  for (
      tok = strtok_r(s_decoded, delim, &saved);
      tok;
      tok = strtok_r(NULL, delim, &saved)) {
    if (0 == strncmp(tok, "arg1=", 5)) {
      p_search = tok + 5;
      p_arg1 = calloc(i_decoded, 1);
      mg_url_decode(p_search, i_query, p_arg1, i_decoded, 1);
      printf("Debug: Arg1: %p, Len %d, Content: '%s'\n", p_arg1, i_decoded, p_arg1);
      
    }
    if (0 == strncmp(tok, "arg2=", 5)) {
      p_search = tok + 5;
      p_arg2 = calloc(i_decoded, 1);
      mg_url_decode(p_search, i_query, p_arg2, i_decoded, 1);
      printf("Debug: Arg2: %p, Len %d, Content: '%s'\n", p_arg2, i_decoded, p_arg2);
    }
	}

  // Argument number
  int i_arg = 0;
  if (NULL != p_arg1) { i_arg++; }
  if (NULL != p_arg1 && NULL != p_arg2) { i_arg++; }


  // Get output in http
  func_v_t astro_set_session = (func_v_t) dlsym(handle, "astro_set_session");
  if (0 == astro_set_session) {
    printf("Error: no set session\n");
    return;
  }
  astro_set_session(c);

  switch (i_arg) {
    case 0:
      ;
      func_t fct0 = (func_t) dlsym(handle, s_fct);
      if (NULL == fct0){
        printf("Error: NULL fct\n");
        return;
      }
      mg_say(c, "[Calling] %p <= %s", fct0, s_fct);
      fct0();
      break;

    case 1:
      ;
      func_c_t fct1 = (func_c_t) dlsym(handle, s_fct);
      if (NULL == fct1){
        printf("Error: NULL fct\n");
        return;
      }
      mg_say(c, "[Calling] %p <= %s", fct1, s_fct);
      fct1(p_arg1);
      break;

    case 2:
      ;
      func_cc_t fct2 = (func_cc_t) dlsym(handle, s_fct);
      if (NULL == fct2){
        printf("Error: NULL fct\n");
        return;
      }
      mg_say(c, "[Calling] %p <= %s", fct2, s_fct);
      fct2(p_arg1, p_arg2);
      break;

    default:
      ;
  }

  #pragma GCC diagnostic pop
}


void start_loop() {
  printf("Start listening %s\n", s_listening_address);
  mg_http_listen(&mgr, s_listening_address, cb, &mgr);
  for (;;) mg_mgr_poll(&mgr, 10000);
}

int main(int argc, char *argv[]) {
  g_verbose = 1;

  // Init MGR (all connections)
  mg_mgr_init(&mgr);

  // Get handle to lib
  char* error = NULL;
  dlerror();  // Clear error buffer;
  handle = dlopen(g_lib_path, RTLD_LAZY);
  if (NULL == handle) {
    if ((error = dlerror()) != NULL)  {
      printf("Error cannot open lib: %s\n", g_lib_path);
      return 1;
    }
    printf("Error NULL handle\n");
    return 1;
  }

  if (argc > 1) {
    sprintf(s_listening_address, "http://%s:8000", argv[1]);
  } else {
    sprintf(s_listening_address, "http://localhost:8000");
  }

  // Resolve set log
  f_astro_set_log = (func_c_t) dlsym(handle, "astro_set_log");
  if (0 == f_astro_set_log) {
    printf("Error: astro set log resolution\n");
    return 1;
  }

  // Trap segfault
  struct sigaction sa;
  memset(&sa, 0, sizeof(sigaction));
  sigemptyset(&sa.sa_mask);
  sa.sa_flags     = SA_NODEFER;
  sa.sa_sigaction = start_loop;
  sigaction(SIGSEGV, &sa, NULL); /* ignore whether it works or not */

  // Work
  start_loop(&mgr);

  // Ciao
  mg_mgr_free(&mgr);
  return 0;
}
