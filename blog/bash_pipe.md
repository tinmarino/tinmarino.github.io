---
title: Bash pipes
description: Advanced reference on Bash pipes and redirections
keywords: shell, bash, pipe, redirection, tutorial, cheatsheet
author: tinmarino
---

Advanced reference on BaSh pipes and redirections.

# Introduction

After reading this page, you should be able to:

* Fork and join subprocesses
* Redirect to multiple streams
* Capture outputs to variable without blocking nor afecting the standard output

There are many tutorials on shell pipes on the net but most use the very basic syntax
like the following [useless use of cat](https://en.wikipedia.org/wiki/Cat_%28Unix%29#Useless_use_of_cat).

```bash
cat file.txt | sed -i s/country/state/g'
```

There is some advanced content on redirections, but it is spread between
the [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
and [stackoverflow](https://stackoverflow.com/search?q=%5Bbash%5D+pipe),
see for example:

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

## Debug

TODO

If you want to go futher, inspect the current state of your shell while running the examples:

```bash
ls -l /proc/self/fd  # or /proc/$$/fd/
for fd in $(ls /proc/$$/fd| grep -v [012]); do exec {fd}>&-; done  # Close fd except std streams
exec bash  # Renew, shell but fd are kept
```

# Single pipeline

## Manual

From: __man bash / SHELL GRAMMAR / Pipeline__
From: __man 7 pipe__

A pipeline is a sequence of one or more commands separated by one of the control operators | or |&.  The format for a pipeline is:

```text
[time [-p]] [ ! ] command [ [|⎪|&] command2 ... ]
```

The standard output of command is connected via a pipe to the standard input of command2. This connection is performed before any redirections specified by the command (see REDIRECTION below). If |& is used, command's standard error, in addition to its standard output, is connected to command2's standard input through the pipe; it is shorthand for 2>&1 |. This implicit redirection of the standard error to the standard output is performed after any redirections specified by the command.


## Examples

```bash
# Replace recursive
find . -type f -print0 | xargs -0 sed -i -e 's/foo/bar/g'

# Sed colorize match
echo "color test" | sed 's,color,\x1b[31m&\x1b[0m,'

# Remove duplicate lines while keeping the order of the lines
cat -n out.txt | sort -k2 -k1n  | uniq -f1 | sort -nk1,1 | cut -f2-
```


## Helpfull commands


### 1/ Produce

* find
  * `find . -type f -print0 | xargs -0 sed -i -e 's/\bart\b/dispatch/g'`
* ls
  * `ls -1 | xargs -l echo`
* cat, tac
* yes
* seq
  * `seq 10 | xargs -l echo "hello"`
* for

### 2/ Filter

* grep
  * -o: print only match
  * -nri: prefix with line number, recurse, ignore case
* sed
* awk
  * `awk '$2 ~ /[-.0-9]*/ {n++;sum+=$2} END {print n?sum/n:0}'  # Get column 2 average`
* head
  * `head -n 20  # Line`
* tail
  * `tail -n +1 file1.txt file2.txt file3.txt  # Cat all files, including filename`
* cut
  * `cut -f1,3 -d":" /etc/passwd`
* sort
  * `sort -nr -t '|' -k 2`
  * -h: human: read k as kilo
  * -n: numeric: put 4 before 10
  * -k -t: specify column and delimiter
* uniq
* tr
  * `tr '()' '[]'`

### 3/ Consume

* xargs
  * -l: one command per line (usually what you want)
  * -0: from null terminated (use with find -print0)
* bash
* tee
* while
* od
* mv, cp
* read, readarray
  * `read -r -t 0.001 -d '' msg < <(echo -e "toto\ntiti")  # Slurp to whole file`


# Forking pipeline

In order to have multiple consumers, it can be usefull to fork the pipeline with, at your choice:

1. embeded redirections
2. command substitution
3. command 'tee'
3. internal 'exec'

Let's define simple producer and cosumer

```bash
producer(){ echo "Producer ${*:-0}!"; }
consumer(){ sed "s/.*/Consumer ${*:-0}: &/"; }
```

## Left fork

Serves to redirect the input from multiple commands

```text
+------------+
| Producer 1 |
+------------+
              \     +----------+
               |--> | Consumer |
              /     +----------+
+------------+
| Producer 2 |
+------------+
```

__Simply__: use curly braces `{}` to join them

```bash
{ producer 1; producer 2; } | consumer
```

__Permanently__: use exec and process substitution
(if you want an open shell with the consumer in background)

```bash
exec > >(consumer)
producer 1
producer 2
```

Note: the consumer is writting to stdout and the stdout was overwritten by the consumer. But this is OK because the consumer copied the initial stdout which was, at this moment, pointing to the tty.

Note: the consumer is in a process substitution, so in a child process. modifying the consumer function in the parent shell (your terminal) have no effect anymore, you would have to create a new redirection to see the change applied.

The terminal lost its normal stdout. It would be nice to see it in parallel. For that, we must spawn multiple consumer => see next section: right fork.


## Right fork

Serves to redirect the output to multiple commands

```text
                +------------+
                | Consumer 1 |
                +------------+
+----------+   /
| Producer |--|
+----------+   \
                +------------+
                | Consumer 2 |
                +------------+
```

__Simply__: use tee and process substitution

```bash
producer | tee >(consumer 1) >(consumer 2) > /dev/null
```

__Permanently__: use exec, tee and process substitution

```bash
exec > >(tee >(consumer 1) >(consumer 2) > /dev/null)
producer
```

__Canonically__:

```bash
exec {fd}> >(:)  # Open fd to avoid redirection failure
exec > >(tee >(cat >&"$fd"))  # Writing to 1 will also write to 3
producer
```


## Complex fork

This real world example is using forked redirection to permit Inter-Process Communication between Child and Parent.
This old technique is often used with named pipes (aka fifo), but I find anonymous pipes more elegants.

```text
         Child space        '         Parent space
----------------------------'----------------------------
+---------+                 '
| Child 1 |                 '
+---------+                 '
           \    +--------+  '   +--------+
+---------+ \   | fd_msg | -'-> | fd_msg |     +--------+
| Child 2 | --> +--------+  '   +--------+ --> | Parent |
+---------+ /   | Stdout | -'-> | fd_out |     +--------+
           /    +--------+  '   +--------+
+---------+                 '
| Child 3 |                 '
+---------+                 '
```

```bash
# Declare used function
child(){
  echo "Child ${*:-0} working"
  [[ -v fd_msg ]] && echo "Child ${*:-0}: messaging parent" >&"$fd_msg"
}
slurp_fd(){
  IFS= read -r -t 0.001 -d '' msg <&"$1"
  echo "${msg%$'\n'}"
}

exec {fd_save_stdout}>&1 # Backup standard output fd
exec {fd_msg}<> >(:)  # Create dummy fd for special message
exec {fd_stdout}<> >(:)  # Create dummy fd for all

exec > >(tee >(cat >&"$fd_stdout"))  # Redirect stdout

child 1& child 2& child 3 # Fork them

exec >&"$fd_save_stdout"  # Restore stdout (before wait or wait blocks)

wait  # Wait for children

echo -e "Stdout grabbed:\n$(slurp_fd "$fd_stdout")"  # Read stdout from children
echo -e "Message grabbed:\n$(slurp_fd "$fd_msg")"  # Read message from children
```


# SubProcess control

## Capture output

TODO

## Fork join

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

* [GNU: Redirections in Bash Manual](https://www.gnu.org/software/bash/manual/html_node/Redirections.html)
* [Tinmarino: bash wiki](https://tinmarino.github.io/markdown_viewer.html?page=https://raw.githubusercontent.com/tinmarino/wiki/master/Bash.md)


