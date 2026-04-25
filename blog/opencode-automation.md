---
title: "Automating OpenCode"
subtitle: "Communicate with IA through task files as rendez-vous points"
description: "OpenCode is the best LLM TUI in the sandbox (earth) in 2026 and lets me create a `/work` command that reads tasks from `todo.md`, moves them to `done.md`, and feeds back to the user in `feedback.md`"
keywords: opencode, claude, ai, productivity, tmux, slash-command, automation, permissions
author: Tinmarino
date: 24 april 2026
---

This page explains my current workflow for communicating with [Opencode](https://github.com/anomalyco/opencode)
with __files__ as rendez-vous points and only the `/work` instruction in the prompt.



![OpenCode TUI, the starting point](/img/blog/opencode/opencode-interface-13-public-slash-command.png)


# 0. Why does that matter to me?

## Summary

I thought I was losing a lot of time copy-pasting between the prompt ([ShellGPT](https://github.com/ther1d/shell_gpt) TUI) and my documents (files in Vim).

## Why documenting it?

I write this blog for my coworkers at SEK Chile, to share the implementation details in a place they can find again. Ona may say it this configuration is "easy", but it is even easier to just say it. In short, it took me time and friends to gather the info and find the best implementation, so ... "explicit is better than implicit".


## History

When Sir PV showed me OpenCode, two (2) days ago, I understood this was it! I finally could recover the one year delay I accumulated this year with IA user interfaces. To be honest, Sir JP repeated two weeks ago that the Model Context Protocol was the thing to look for. But I guess I am too rusted to search the web and always fall into some advertising trap by Google, a company selling a proxy to convert JSON whatever.

The tool lets me read and write files, which was enough for me. Furthermore, it allows some configuration that I still need to study. For example, I have a human todo list to implement some `skills` for IA to report vulnerabilities in my format, and I still need to think about my virtual desktops (aka GNOME workspace) because I relied on 4 and ... yep, not enough. Either I create a 3x3 matrix or I ask AI to implement a 3D workspace switcher to rivalize the workspace matrix plugin I use. Now every code path I delayed will be filled.

But before that, as usual, sharpen the saw, or better connect it to the tools I have been sharpening for 15 years, i.e. Vim (and its slaves like Git Bash, tmux). Note that they are all available on Windows even without the Linux subsystem.


# 1. A custom `/work` slash-command

OpenCode lets you save a prompt as a reusable slash-command in `~/.config`.

Path:

```bash
~/.config/opencode/commands/work.md   # Global /work command
.opencode/commands/work.md            # Per-repo /work command
```

Content:

```markdown
---
description: "Work through every [ ] task in doc/ai-todo.md § # AI, treating the file as a live stream"
---
Work through every `[ ]` item in `@doc/ai-todo.md`, one at a time, following `@CLAUDE.md` (which overrides this prompt on any conflict). For each task:

1. Re-read `@doc/ai-todo.md` FIRST — the file is a live stream, not a snapshot: I may append new tasks while you work. Any new `[ ]` after the last one you did is fair game and must be processed before stopping.
2. Execute the task, run the test suite when code changes.
3. Mark it `* [X]`, cut the line and move it to `@doc/ai-done.md`.
4. Commit with a message prefixed by your assistant name, e.g.  `Claude: <one-line summary>`. Never `git push`.
5. If the task is blocked by a question only I can answer, write it as `[ ] <question>` in `@doc/ai-pending.md` and move on.
6. After committing, go back to step 1. Only stop when `# AI` is empty across TWO consecutive reads.

Append any product / process insight to `@doc/ai-feedback.md`. Respond
in Spanish; commit messages and code comments in English.
```


# 2. Permissions: stop the "allow?" prompts

By default OpenCode prompts before running any `bash` command, any `edit`, any file read outside the workspace. Great for a first session, painful after the tenth `git status` or `cat test > /tmp/long-filename.py`.

Path:

```bash
~/.config/opencode/opencode.json
```

Content:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",

    "read":  {
      "*": "allow",
      "*.env": "deny",
      "*secret*": "deny",
      "**/.ssh/**": "deny"
    },
    "edit":  "allow",

    "bash": {
      "*": "ask",
      "ls *": "allow",           "pwd": "allow",
      "cat *": "allow",          "grep *": "allow",
      "rg *": "allow",           "find *": "allow",
      "git status *": "allow",   "git diff *": "allow",
      "git log *": "allow",      "git show *": "allow",
      "python *": "allow",       "python3 *": "allow",
      "pylint *": "allow",
      "pytest *": "allow",       "make *": "allow",
      "docker compose exec *": "allow",
      "mkdir -p *": "allow",     "mv /tmp/* *": "allow",

      "rm -rf *": "deny",
      "sudo rm *": "deny",
      "git push *": "deny",
      "git push --force*": "deny"
    },

    "external_directory": {
      "/tmp/**": "allow"
    }
  }
}
```

The rules are glob-matched, last-match-wins. My mental model:

- `"*": "ask"` at the top is the safety net.
- Allow-list the ~20 commands I actually run. Anything outside still prompts.
- Explicit `"deny"` on destructive commands, even if I fat-finger a `rm -rf`, nothing runs.
- `external_directory` is for `/tmp/` scratch writes; without it every `cp foo /tmp/bar` prompts.

After this, a typical "write a test, run it, commit" cycle goes zero-prompt.

![Permissive config in action, no prompts between the run and the commit](../res/opencode-interface-03.png)


# 3. A tmux layout in one command

I work with four tmux windows:

![The four-window tmux layout, window "prompt" focused on the todo split](/img/blog/opencode/opencode-interface-14-four-windows.png)

1. **shell**: git, make, docker compose.
2. **vim**: ad-hoc editing.
3. **opencode**: the AI agent.
4. **prompt**: a vim session with three vim-tabs for the tracking
   files (`doc/ia-todo.md`, `doc/ia-done.md`, `doc/ia-feedback.md`).

A single bash script rebuilds the whole layout:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Create the tracking files if they don't exist yet
mkdir -p doc
touch doc/idea.md doc/ia-todo.md doc/ia-done.md doc/ia-feedback.md

ensure_window() {
  : "Helper: create the window only if one with that name doesn't exist yet"
  local name="$1"
  local cmd="$2"
  if tmux list-windows -F '#{window_name}' | grep -qx "$name"; then
    return 0        # already there → no-op
  fi
  tmux new-window -n "$name" "$cmd"
}

PROMPT_VIM="vim \
    -c 'edit doc/idea.md | vsplit doc/ia-todo.md' \
    -c 'tabnew doc/ia-done.md' \
    -c 'tabnew doc/ia-feedback.md' \
    -c 'tabfirst'"

# Rename the current window (index 0) to SHELL. rename-window with the same
# name is a silent no-op, so this is idempotent by itself.
tmux rename-window -t 1 SHELL

# Create windows
ensure_window VIM      "vim"
ensure_window IA       "opencode"
ensure_window PROMPT   "$PROMPT_VIM"

# Go to first window
tmux select-window -t  1
```

Bind it in `~/.tmux.conf` for a keystroke:

```tmux
bind-key I run-shell "bash ~/bin/start-ia-tmux-session.sh"
```

Now `prefix + I` spawns the whole layout, keyed by the current directory's basename.



# The combined loop

With those three pieces in place, a session looks like:

```bash
cd ~/code/myproject                # 1. enter the project
prefix+I                            # 2. tmux layout comes up
# switch to the "opencode" window (Ctrl-B 3)
/fill-todo                          # 3. OpenCode starts processing
```

The agent reads `doc/ia-todo.md`, executes tasks, commits them one by
one, updates `doc/ia-done.md` and `doc/ia-feedback.md`. If I think of
a new task mid-session, I just open the `PROMPT` tmux window, type it into
the todo file within Vim, save, and the agent picks it up at the next iteration because of the "live stream" rule.

![Two tasks processed back-to-back, commits visible in git log](/img/blog/opencode/opencode-interface-15-public-done.png)

What I get out of this loop:

- **Feel at home**: I can work with tmux, Vim and `doc/ia-todo.md` as I used to do.
- **No boilerplate**: `/work` replaces an 80-word prompt.
- **No prompts**: unless I try something interactive.
- **No context-switching**: tracking files live in a vim pane I can glance at without leaving the terminal.
- **Audit trail**: every task is its own git commit prefixed `Claude:`, so `git log --grep '^Claude:'` tells me what the agent did today and when.
