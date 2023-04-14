---
title: Bash pipes
description: Advanced reference on BaSh pipes and redirections.
---

Advanced reference on BaSh pipes and redirections.

# Introduction

> **Disclaimer**  Work in progress

Goal: after reading this page, you should be able to:

* Fork and join subprocesses
* Redirect to multiple streams
* Capture outputs to variable without blocking nor afecting the standard output


There are many tutorials on shell pipes on the net but most use the very basic syntax like the following [useless use of cat](https://en.wikipedia.org/wiki/Cat_%28Unix%29#Useless_use_of_cat).

```bash
cat file.txt | sed -i s/country/state/g'
```

There is some advanced content on redirections, but it is spread between the [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/) and [stackoverflow](https://stackoverflow.com/search?q=%5Bbash%5D+pipe), see for example:

* [How to get the output of a shell function without forking a sub shell?](https://stackoverflow.com/questions/7502981/how-to-get-the-output-of-a-shell-function-without-forking-a-sub-shell/75065137#75065137)
* [Bash: Capture output of command run in background]()
* [How to make a pipe loop in bash](https://stackoverflow.com/questions/40244/how-to-make-a-pipe-loop-in-bash?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa)
* [Non-blocking call for reading descriptor](https://stackoverflow.com/questions/5616092/non-blocking-call-for-reading-descriptor)


## History

### Timeline

* 1962: [Fork system call](https://en.wikipedia.org/wiki/Fork_%28system_call%29#History)
  * See [article on history of fork and join](https://ieeexplore.ieee.org/document/7548985)
* 1969: [UNIX first release](https://en.wikipedia.org/wiki/History_of_Unix)
* 1970: [The epoch](https://en.wikipedia.org/wiki/Unix_time#History)
* 1973: [Pipe system call](https://en.wikipedia.org/wiki/Pipeline_%28Unix%29#History)
* 1989: [Bash first beta release](https://en.wikipedia.org/wiki/Bash_%28Unix_shell%29#History)
* 1994: [Bash process substitution](https://en.wikipedia.org/wiki/Process_substitution#History)

Ref: For later changes, see [bash feature, version and changes at Greg's wiki](https://mywiki.wooledge.org/BashFAQ/061) or the more verbose [bash/CHANGES in the GNU source code inspector](https://git.savannah.gnu.org/cgit/bash.git/tree/CHANGES)

# Single pipe


# Forking pipe

```bash
```


# SubProcess control

```bash
# Define a worker function
worker(){
  : 'Special 12 and 13'
  local -i num=${1:-0} i=0
  local -i color=$((num % 5 + 30))
  if (( 12 == num )); then return 42; fi
  if (( 13 == num )); then while :; do echo -e "worker \e[1m\e[${color}m$num\e[0m: working $((i++))."; sleep 1; done; return 0; fi
  for i in {1..5}; do
    echo -e "worker \e[1m\e[${color}m$num\e[0m: working $i/5."
    sleep 0.1
  done
}
worker 1


multiwork(){
  declare id=''  # The key
  declare -gA d_pid=() d_ret=() d_out=() d_fd=()  # The process infos
  declare -i i_fd=0  # The process stdout filedescriptor

  # Fork
  for id; do
    exec {i_fd}< <(worker "$id")  # <----- 1.0 Here is the async fork
    d_pid[$id]=$!                 # <----- 1.1 Grab its PID
    d_fd[$id]=$i_fd               # <----- 1.2 Grab its FD
  done

  # Join
  for id; do
    wait "${d_pid[$id]}"          # <------ 2.0 Here is the async join
    d_ret[$id]=$?                 # <------ 2.1 Get the exit status
    d_out[$id]=$(cat <&"${d_fd[$id]}")  # < 2.2 Get the stdout
  done

  # Clean
  for id; do exec {d_fd[$id]}<&-; done
                                 # <------- 3.0 Close FD

  # Log
  >&2 echo "Summary: ${d_pid[*]} | Ret: ${d_ret[*]} | Out: ${d_out[*]//$'\n'/:}"
}
multiwork 1 12 2
```


# References and tips

## File descriptor operations

```bash
declare -i fd

exec {fd}<> /tmp/file  # Open fd
echo value >&"$fd"     # Write to fd
cat <&"$fd"            # Read from fd
exec {fd}>&-           # Close fd
```

### Tip: Catch the output of subcommands

```bash
declare -i fd

exec {fd}>&1
declare out=$(echo "Hello world" | tee "/dev/fd/$fd")
exec {fd}>&-
echo "$out"

shopt -s lastpipe; set +m  # permit last pipe command to execute in current shell; disable Monitor mode (i.e. job control)
{ echo -e "begin\ngrepme\nend" | tee /dev/fd/3 | sed -n '/grepme/p' | readarray -t a_filter; } 3>&1; echo "${a_filter[*]}"

# Or faster
{ echo "Hello world" | tee "/dev/fd/$fd"; } {fd}>&1

# Also:
echo "Hello world" | tee /dev/tty
echo "Hello world" | tee >(cat - >&{fd})
```

Ref: https://stackoverflow.com/a/16292136/2544873


### Tip: pipe one line

```bash
logger(){ for i in {1..100}; do echo "$i"; sleep 0.1; done; }

logger | xargs -I % echo -ne "\r" "%"

pipe_one_line(){
  {
    local line
    tput rmam
    while read -r line; do
      printf "\r\e[K%s" "$line"
    done < "${1:-/dev/stdin}"
    tput smam
  }
}
logger | pipe_one_line


while true; do date; sleep 1; done | stdbuf --output=0 tr '\n' '\r'
```

# Cheatsheet

```bash
# :from: https://catonmat.net/bash-redirections-cheat-sheet
cmd > file        # Redirect the standard output (stdout) ofcmdto a file.
cmd 1> file       # Same ascmd > file. 1 is the default file descriptor (fd) for stdout.
cmd 2> file       # Redirect the standard error (stderr) ofcmdto a file. 2 is the default fd for stderr.
cmd >> file       # Append stdout ofcmdto a file.
cmd 2>> file      # Append stderr ofcmdto a file.
cmd &> file       # Redirect stdout and stderr ofcmdto a file.
cmd > file 2>&1   # Another way to redirect both stdout and stderr ofascmd 2>&1 > file. Redirection order matters! cmdto a file. This is notthe same
cmd > /dev/null   # Discard stdout ofcmd.
cmd 2> /dev/null  # Discard stderr ofcmd.
cmd &> /dev/null  # Discard stdout and stderr ofcmd.
cmd < file        # Redirect the contents of the file to the standard input (stdin) ofcmd.

# Redirect a bunch of lines to the stdin. If'EOL'is quoted, text is treated literally. This is called a here-document.
cmd << EOL
line
line
EOL

# Redirect a bunch of lines to the stdin and strip the leading tabs.
cmd <<- EOL
<tab>foo
<tab><tab>bar
EOL

exec &> >(tee -a log.out)  # Redirect stdout and stderr to file
exec &> /dev/tty           # Reset stdout and stderr 

cmd <<< "string"  # Redirect a single line of text to the stdin ofcmd. This is called a here-string.
exec 2> file      # Redirect stderr of all commands to a file forever.
exec 3< file      # Open a file for reading using a custom file descriptor.
exec 3> file      # Open a file for writing using a custom file descriptor.
exec 3<> file     # Open a file for reading and writing using a custom file descriptor.
exec 3>&-         # Close a file descriptor.
exec 4>&3         # Make file descriptor 4 to be a copy of file descriptor 3. (Copy fd 3 to 4 .)
exec 4>&3-        # Copy file descriptor 3 to 4 and close file descriptor 3.
echo "foo" >&3    # Write to a custom file descriptor.
cat <&3           # Read from a custom file descriptor.
(cmd1; cmd2) > file  # Redirect stdout from multiple commands to a file (using a sub-shell).
{ cmd1; cmd2; } > file  # Redirect stdout from multiple commands to a file (faster; not using a sub-shell).
exec 3<> /dev/tcp/host/port  # Open a TCP connection tohost:port. (This is a bash feature, not Linux feature).
exec 3<> /dev/udp/host/port  # Open a UDP connection tohost:port. (This is a bash feature, not Linux feature).
cmd <(cmd1)       # Redirect stdout ofUseful whencmddoesn’t read from stdin directly.cmd1to an anonymous fifo, then pass the fifo tocmdas an argument.
cmd < <(cmd1)     # Redirect stdout ofBest example:diff <(find /path1 | sort) <(find /path2 | sort)cmd1to an anonymous fifo, then redirect the fifo to stdin of. cmd.
cmd <(cmd1) <(cmd2)  # Redirect stdout ofarguments tocmd. cmd1andcmd2to two anonymous fifos, then pass both fifos as
cmd1 >(cmd2)      # Runpipe as an argument tocmd2with its stdin connected to an anonymous fifo, and pass the filename of thecmd1.
cmd1 > >(cmd2)    # Runto this anonymous pipe.cmd2with its stdin connected to an anonymous fifo, then redirect stdout ofcmd
cmd1 | cmd2       # Redirect stdout ofsame ascmd2 < <(cmd1)cmd1to stdin of, same ascmd2> >(cmd2) cmd1. Pro-tip: This is the same as, same as< <(cmd1) cmd2cmd1 > >(cmd2). ,
cmd1 |& cmd2      #  Redirect stdout and stderr ofcmd1 2>&1 | cmd2for older bashes.cmd1 to stdin of cmd2 (bash 4.0+ only). Use
cmd | tee file    # Redirect stdout ofcmdto a file and print it to screen.
exec {filew}> file  # Open a file for writing using a named file descriptor called{filew}(bash 4.1+).
cmd 3>&1 1>&2 2>&3  # Swap stdout and stderr ofcmd.
cmd > >(cmd1) 2> >(cmd2)  # Send stdout ofcmdtocmd1and stderr ofcmdtocmd2.
cmd1 | cmd2 | cmd3 | cmd; echo ${PIPESTATUS[@]}  # Find out the exit codes of all piped commands.
```


# Links

* [Redirections in Bash Manual](https://www.gnu.org/software/bash/manual/html_node/Redirections.html)


