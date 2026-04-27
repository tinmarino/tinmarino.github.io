---
title: "Automating my terminal with OpenCode"
subtitle: "Communicate with AI through task files as rendez-vous points"
description: "A zero-prompt OpenCode workflow: a `/work` slash-command reads tasks from `ai-todo.md` and commits each result as the agent goes."
keywords: opencode, claude, ai, productivity, tmux, slash-command, automation, permissions, skills, agents.md, asciinema
author: Tinmarino
date: 24 april 2026
---

This page explains my current workflow for communicating with [OpenCode](https://github.com/anomalyco/opencode)
with __files__ as rendez-vous points and only the `/work` instruction in the prompt.

Tested with `anthropic/claude-sonnet-4-5` through Amazon Bedrock; the
recipe should work on any OpenCode-supported provider.



![OpenCode TUI, the starting point](/img/blog/opencode/opencode-interface-13-public-slash-command.png)


## Contents

- [0. Why does that matter to me?](#0-why-does-that-matter-to-me)
- [1. A custom `/work` slash-command](#1-a-custom-work-slash-command)
- [2. Permissions: stop the "allow?" prompts](#2-permissions-stop-the-allow-prompts)
- [2.b Skills: teach the agent your house rules](#2b-skills-teach-the-agent-your-house-rules)
- [2.c Dispatching across several projects](#2c-dispatching-across-several-projects)
- [3. A tmux layout in one command](#3-a-tmux-layout-in-one-command)
- [3.b Tearing the session down](#3b-tearing-the-session-down)
- [4. The combined loop](#4-the-combined-loop)
- [5. Recording a zero-prompt demo](#5-recording-a-zero-prompt-demo)


# 0. Why does that matter to me?

## Problem

I was losing a lot of time copy-pasting between the prompt ([ShellGPT](https://github.com/ther1d/shell_gpt) TUI) and my documents (files in Vim).

## Solution

[OpenCode](https://github.com/anomalyco/opencode) harnesses the power of [Model Context Protocol](https://en.wikipedia.org/wiki/Model_Context_Protocol) and gives the LLM access to the shell and, in this case, the files, as output and input. The LLMs themselves have also improved a lot at that kind of work since 2024.

## Why documenting it?

I write this blog for my coworkers at SEK Chile, to share the implementation details in a place they can find again. One may say this configuration is "easy", but it is even easier to just say it out loud. In short, it took me time and a few colleagues to gather the info and find the best implementation, so ... "explicit is better than implicit".


## History

When Sir PV showed me OpenCode, two (2) days ago, I understood this was it! I finally could recover the one-year delay I had accumulated on IA user interfaces. To be fair, Sir JP had already repeated two weeks earlier that the Model Context Protocol was the thing to look for.

The tool lets me read and write files, which is enough for me. Furthermore, it allows plenty of configuration I still want to explore — for example, skills for the AI to report vulnerabilities in my format, and virtual-desktop automation that could replace my trusty 4-workspace GNOME setup.

But before that, as usual, sharpen the saw, or better connect it to the tools I have been sharpening for 15 years: Vim (with its companions Git, Bash and tmux). They are all available on Windows even without the Linux subsystem.


# 1. A custom `/work` slash-command

OpenCode lets you save a prompt as a reusable slash-command in `~/.config/opencode/commands/`.

Path:

```bash
~/.config/opencode/commands/work.md   # Global /work command
.opencode/commands/work.md            # Per-repo /work command
```

Content:

```markdown
---
description: "Work through every [ ] task in doc/ai-todo.md, treating the file as a live stream"
---
Work through every `[ ]` item in `@doc/ai-todo.md`, one at a time, following `@AGENTS.md` (which overrides this prompt on any conflict). For each task:

1. Re-read `@doc/ai-todo.md` FIRST — the file is a live stream, not a snapshot: I may append new tasks while you work. Any new `[ ]` after the last one you did is fair game and must be processed before stopping.
2. Execute the task, run the test suite when code changes.
3. Mark it `* [X]`, prefix it with a timestamp like `2026-04-27T00:16:21:` (strftime `%Y-%m-%dT%H:%M:%S`), then cut the line and move it to `@doc/ai-done.md`.
4. Commit with a message prefixed by your assistant name, e.g. `Claude: <one-line summary>`. Never `git push`.
5. If the task is blocked by a question only I can answer, write it as `[ ] <question>` in `@doc/ai-pending.md` and move on.
6. After committing, go back to step 1. Only stop when the file is empty across TWO consecutive reads.

Append generic product / process insight to `@doc/ai-feedback.md`, or to `@doc/ref/feedback-<slug>.md` when I ask for a dedicated report. Respond in Spanish; commit messages and code comments in English.
```

Note the `@AGENTS.md` reference. Since OpenCode ≥ 1.1, `AGENTS.md`
is the canonical name for project-level rules ([docs](https://opencode.ai/docs/rules/));
`CLAUDE.md` still works as a fallback for Claude Code compatibility.


# 2. Permissions: stop the "allow?" prompts

By default OpenCode prompts before running any `bash` command, any `edit`, any file read outside the workspace. Let's automate it.

Path:

```bash
~/.config/opencode/opencode.json
```

Content (my daily driver — permissive but guarded):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "read":  "allow",
    "edit":  "allow",

    "bash": {
      "*": "allow",
      "rm -rf *":          "deny",
      "rm -rf /*":         "deny",
      "sudo rm *":         "deny",
      "sudo *":            "deny",
      "chmod -R 777 *":    "deny",
      "git push *":        "deny",
      "git push --force*": "deny",
      "curl * | sh":       "deny",
      "curl * | bash":     "deny",
      "mkfs*":             "deny",
      "shutdown *":        "deny",
      "reboot *":          "deny"
    },

    "external_directory": {
      "/tmp/**":           "allow",
      "~/Software/**":     "allow",
      "~/.config/opencode/**": "allow",
      "~/.vim/**":         "allow"
    }
  }
}
```

The rules are glob-matched, last-match-wins. My mental model:

- Tools default to `allow` (read, edit, bash) so the agent runs without prompts.
- Explicit `deny` on destructive commands, even if I fat-finger a `rm -rf`, nothing runs.
- `external_directory` is for paths outside the working directory; whitelist only what you trust (`/tmp/**` for scratch, `~/Software/**` for peer projects).

If you prefer a conservative config (`"*": "ask"` safety net, allow-list ~20 commands), see the [permissions docs](https://opencode.ai/docs/permissions/) — the shape is the same, just inverted.

After this, a typical "write a test, run it, commit" cycle goes zero-prompt.

![Permissive config in action, no prompts between the run and the commit](/img/blog/opencode/opencode-interface-03-public-02.png)


# 2.b Skills: teach the agent your house rules

OpenCode auto-loads skills from `~/.config/opencode/skills/<name>/SKILL.md`
([docs](https://opencode.ai/docs/skills/)). A skill is a frontmatter
with `name` and `description` plus a Markdown body; when the agent
is about to do something that matches the description, it pulls the
skill in.

I keep two on this machine:

- **`python-writer`**: style rules for Python files (shebang, verb-first docstrings, overindented multi-line signatures, `argparse` + `argcomplete` CLI scaffold). Saves me from re-pasting a 100-line prompt every time I open a Python project.
- **`vuln-reporter`**: writes pentest findings in Spanish using my `Bice00.md` template, and picks the right dummy from `~/Software/Pentest/ReportTemplate/` based on the vulnerability category.

Skills are cheap: ~200 lines of Markdown each, versioned in git
next to the project-specific `AGENTS.md`.


# 2.c Dispatching across several projects

When you coordinate more than one codebase, a single "master"
workspace + slash-commands is simpler than cd-ing around:

```
~/Software/Python/AI/OpenClaudeMaster/
├── AGENTS.md                  # dispatcher instructions
├── opencode.json              # external_directory allow-list
├── .opencode/
│   └── commands/
│       ├── stock.md           # /stock  → work on ~/Software/Python/Stock
│       ├── lctf.md            # /lctf   → work on ~/Software/Pentest/libreriactf
│       ├── page.md            # /page   → this blog
│       ├── fair.md            # /fair   → Django FAIR risk app
│       ├── vim.md             # /vim    → ~/.vim config
│       └── ocfg.md            # /ocfg   → ~/.config/opencode
└── doc/
    ├── ai-todo.md             # live stream
    ├── ai-done.md
    ├── ai-pending.md
    ├── ai-feedback.md
    └── idea.md
```

Each command file is a tiny Markdown prompt that anchors the task
in the target directory. The master `opencode.json` grants
`external_directory` access to every allowed project, so the agent
can read / edit / `git commit` across all of them without leaving
the dispatcher session.


# 3. A tmux layout in one command

I work with four tmux windows:

![The four-window tmux layout, window "prompt" focused on the todo split](/img/blog/opencode/opencode-interface-14-four-windows.png)

1. **SHELL**: git, make, docker compose.
2. **VIM**: ad-hoc editing.
3. **IA**: the OpenCode agent.
4. **PROMPT**: a vim session with three vim-tabs for the tracking
   files (`doc/ai-todo.md`, `doc/ai-done.md`, `doc/ai-feedback.md`).

A single bash script rebuilds the whole layout:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Capture the directory ocinit was launched from so every new tmux
# window lands there instead of tmux' default (usually $HOME).
OCINIT_CWD="$PWD"

# Create the tracking files if they don't exist yet
mkdir -p doc
touch doc/idea.md doc/ai-todo.md doc/ai-done.md doc/ai-feedback.md

ensure_window() {
  : "Helper: create the window only if one with that name doesn't exist yet"
  local name="$1"
  local cmd="$2"
  if tmux list-windows -F '#{window_name}' | grep -qx "$name"; then
    return 0        # already there → no-op
  fi
  # Launch through an interactive bash so ~/.bashrc is sourced before the
  # command runs; that way the new tmux window inherits env vars, aliases
  # and PATH tweaks. `printf %q` shell-escapes the cmd so embedded quotes
  # (PROMPT_VIM has them for vim -c '…') survive the trip to bash.
  tmux new-window -n "$name" -c "$OCINIT_CWD" \
    "bash -ic $(printf '%q' "$cmd")"
}

PROMPT_VIM="vim \
    -c 'edit doc/idea.md | vsplit doc/ai-todo.md' \
    -c 'tabnew doc/ai-done.md' \
    -c 'tabnew doc/ai-feedback.md' \
    -c 'tabfirst'"

# Rename the current window (index 1) to SHELL. rename-window with the same
# name is a silent no-op, so this is idempotent by itself.
tmux rename-window -t 1 SHELL

# Create windows
ensure_window VIM      "vim"
ensure_window IA       "opencode"
ensure_window PROMPT   "$PROMPT_VIM"

# Go to first window
tmux select-window -t 1
```

I keep mine at `~/.vim/bin/ocinit` (it lives in my
[vimfiles repo](https://github.com/tinmarino/vimfiles/blob/master/bin/ocinit)).
Bind it in `~/.tmux.conf` for a keystroke:

```tmux
bind-key I run-shell "bash ~/.vim/bin/ocinit"
```

Now `prefix + I` spawns the whole layout, keyed by the current directory's basename.


# 3.b Tearing the session down

Two companion scripts close the session cleanly:

- **`~/.vim/bin/tmuxstop`**: walks every pane of the current tmux
  session and sends the right shutdown keys based on the foreground
  program (`pane_current_command`). `vim` gets `:q<CR>`; `ipython`,
  `python`, and `opencode` get `Ctrl-D` twice (leave the TUI) plus a
  third one (close the wrapping `bash -ic`); plain shells get a single
  `Ctrl-D`. The pane hosting `tmuxstop` itself (detected via
  `$TMUX_PANE`) is skipped so you don't kill the script that is
  running.
- **`~/.vim/bin/ocstop`**: counterpart of `ocinit`. Kills the three
  windows `ocinit` created (`VIM`, `IA`, `PROMPT`) and lands you back
  on `SHELL`. Useful when you want to rebuild the layout without
  exiting tmux.

Rough call order at the end of a session:

```bash
~/.vim/bin/tmuxstop      # graceful: let vim save, ipython/opencode exit clean
sleep 1
~/.vim/bin/ocstop        # hard: drop the windows that are left
```

Both scripts are ~30 LOC and live in the same vimfiles repo.


# 4. The combined loop

With those pieces in place, a session looks like:

```bash
cd ~/code/myproject                # 1. enter the project
prefix+I                            # 2. tmux layout comes up
# switch to the "IA" window (Ctrl-B 3)
/work                               # 3. OpenCode starts processing
```

The agent reads `doc/ai-todo.md`, executes tasks, commits them one by
one, updates `doc/ai-done.md` and `doc/ai-feedback.md`. If I think of
a new task mid-session, I just open the `PROMPT` tmux window, type it
into the todo file within Vim, save, and the agent picks it up at the
next iteration because of the "live stream" rule.

![Two tasks processed back-to-back, commits visible in git log](/img/blog/opencode/opencode-interface-15-public-done.png)

What I get out of this loop:

- **Feel at home**: I can work with tmux, Vim and `doc/ai-todo.md` as I used to do.
- **No boilerplate**: `/work` replaces an 80-word prompt.
- **No prompts**: unless I try something interactive.
- **No context-switching**: tracking files live in a vim pane I can glance at without leaving the terminal.
- **Audit trail**: every task is its own git commit prefixed `Claude:`, so `git log --grep '^Claude:'` tells me what the agent did today and when.


# 5. Recording a zero-prompt demo

For an asciinema cast (or any unattended run), the permissions above
are already close to enough. The extra steps are:

```bash
mkdir -p ~/demo/sandbox && cd ~/demo/sandbox
git init -b main
mkdir -p doc
cat > opencode.json <<'JSON'
{ "$schema": "https://opencode.ai/config.json", "permission": "allow" }
JSON

asciinema rec --overwrite demo.cast -c \
  "opencode run --dangerously-skip-permissions /work"
```

- `"permission": "allow"` blankets every tool — fine inside a
  throwaway sandbox, never in a real project.
- `--dangerously-skip-permissions` auto-approves anything not
  explicitly denied, which makes the recording resilient even if
  `opencode.json` is missing.
- `asciinema rec -c` starts / stops the cast with the agent run.

Two environment variables worth exporting before recording:

```bash
export OPENCODE_DISABLE_AUTOUPDATE=1       # no "new version" banner
export OPENCODE_DISABLE_TERMINAL_TITLE=1   # no title juggling
```

That's the full recipe. Clone the [vimfiles repo](https://github.com/tinmarino/vimfiles)
for `ocinit` / `ocstop` / `tmuxstop`, drop the two Markdown files
above in their place, and you have a reproducible unattended OpenCode
loop in under a minute.
