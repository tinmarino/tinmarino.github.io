---
title: "AI skills I wrote for my pentest workflow"
subtitle: "Reusable skills and scripts that teach the agent my house rules"
description: "A tour of the OpenCode / Claude skills and helper scripts I use: IP logging, shell-command logging, LLM-command logging, a Python writer, and an async IP-rotating HTTP fetcher."
keywords: opencode, claude, ai, skills, pentest, logging, python, http, ip-rotation, bash, vim
author: Tinmarino
date: 25 june 2026
---

This page collects the **skills** and **helper scripts** I built to monitor and code faster with [Opencode](https://opencode.ai/).

## Contents

- [0. Prompt tips](#0-prompt-tips)
- [1. Log my IP](#1-log-my-ip)
- [2. Log my shell commands](#2-log-my-shell-commands)
- [3. Log the LLM shell commands](#3-log-the-llm-shell-commands)
- [4. A Python writer skill](#4-a-python-writer-skill)
- [5. An async IP-rotating HTTP skill](#5-an-async-ip-rotating-http-skill)


# Prompt tips

## Master

```bash
alias master="cd ~/Software/Python/AI/OpenCodeMaster/"
```

Problem: Work with LLM across directory and projects.  
Solution: Create a master LLM project.


## (Open|Claude)Code


```bash
# Fast
ln -s AGENTS.md CLAUDE.md

# Global
ln -s ~/.config/opencode/AGENTS.md ~/.claude/CLAUDE.md
ln -s ~/.config/opencode/commands ~/.claude/commands
ln -s ~/.config/opencode/skills ~/.claude/skills
```

Problem: Claude uses CLAUDE.md, the convension is AGENTS.md.  
Solution: Keep one master and one dependant with symlink or update script.

# Log my IP

Log my public IP every minute with Cron. Yes preofesionals use Cron.

```embed
https://raw.githubusercontent.com/tinmarino/vimfiles/refs/heads/master/scripts/pentest/install-ip-logger.sh
```


# Log my shell commands

Append `history` imediatly and not at gracefull close of shell. Moreover, append by hand to another backup file.

```bash
# History
# Append instead of overwrite
export HISTSIZE=1000000
export HISTFILESIZE=2000000
export HISTTIMEFORMAT='%Y-%m-%dT%H:%M:%S '
shopt -s histappend

# Helper Trim Spaces
trim_space(){  # {{{2
  ### Usage: echo "   example   string    " | trim_space
  ### From: https://github.com/dylanaraps/pure-bash-bible
  local s=${1:-$(</dev/stdin)}
  s=${s#"${s%%[![:space:]]*}"}
  s=${s%"${s##*[![:space:]]}"}
  printf '%s\n' "$s"
}
export -f trim_space

# PROMPT
# Save history after each executed line
[[ -n "$PROMPT_COMMAND" ]] && [[ "${PROMPT_COMMAND: -1}" != ";" ]] && PROMPT_COMMAND+=";" # Alma fix
export PROMPT_COMMAND+='history -a;'
PROMPT_COMMAND+='fc -ln -1 | trim_space >> ~/.bash_history_save;'
```


# Plugin: Log the LLM shell commands

Log every command run by LLM to avoid surprises.

```embed
https://raw.githubusercontent.com/tinmarino/vimfiles/refs/heads/master/dotfile/opencode/plugins/command-logger.ts
```


# Skill: Write Python code

Write Python code like self.

```embed
https://github.com/tinmarino/vimfiles/blob/master/dotfile/opencode/skills/python-writer/SKILL.md
```


# Skill: HTTP parallel canon

```embed
https://github.com/tinmarino/vimfiles/blob/master/dotfile/opencode/skills/python-writer/SKILL.md
```

```embed
https://github.com/tinmarino/vimfiles/blob/master/dotfile/opencode/skills/http-async-rotate/reference.py
```

```embed
https://github.com/tinmarino/vimfiles/blob/master/dotfile/opencode/skills/http-async-rotate/rut.py
```
