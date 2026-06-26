---
title: "AI skills I wrote for my pentest workflow"
subtitle: "Reusable skills and scripts that teach the agent my house rules"
description: "A tour of the OpenCode / Claude skills and helper scripts I use: IP logging, shell-command logging, LLM-command logging, a Python writer, and an async IP-rotating HTTP fetcher."
keywords: opencode, claude, ai, skills, pentest, logging, python, http, ip-rotation, bash, vim
author: Tinmarino
date: 25 june 2026
---

> **TEMPLATE — work in progress.** Sections are stubbed out; I will fill them in.

This page collects the **skills** and **helper scripts** I built on top of my [OpenCode automation workflow]({% post_url opencode_automation %}). Where the previous post explained *how* I talk to the agent, this one shows *what* I taught it to do.

<!-- TODO: intro paragraph -->


## Contents

- [0. Prompt tips](#0-prompt-tips)
- [1. Log my IP](#1-log-my-ip)
- [2. Log my shell commands](#2-log-my-shell-commands)
- [3. Log the LLM shell commands](#3-log-the-llm-shell-commands)
- [4. A Python writer skill](#4-a-python-writer-skill)
- [5. An async IP-rotating HTTP skill](#5-an-async-ip-rotating-http-skill)


# 0. Prompt tips

<!-- TODO: fill in. Generic prompt tips that apply to every skill below. -->


# 1. Log my IP

<!-- TODO: explain why (audit trail, knowing which IP hit a target during an engagement). -->

A small installer drops a `cron.d` entry that records the public + local IP every minute into `~/Log`.

> **Note to self:** this script is too long and not split per step. I want to reformat it, maybe move it to `.vim/script`.

```bash
#!/usr/bin/env bash
#
# install-ip-logger.sh -- Install the per-minute IP logger cron job.
#
# Run this AS ROOT. It installs a /etc/cron.d entry that runs
# iplogger.sh once a minute as the target (unprivileged) user, so the
# log lands in that user's ~/Log directory.
#
# Usage:
#     sudo ./install-ip-logger.sh [target-user]
#
# If no target-user is given, the user who invoked sudo ($SUDO_USER) is
# used, falling back to the directory owner of this script.
#
# To remove the job later:
#     sudo rm /etc/cron.d/iplogger

set -euo pipefail

# --- Must be root -------------------------------------------------------------

if [[ "${EUID}" -ne 0 ]]; then
    echo "Error: this installer must be run as root (try: sudo $0)" >&2
    exit 1
fi

# --- Resolve paths and target user --------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGGER_SCRIPT="${SCRIPT_DIR}/iplogger.sh"

if [[ ! -f "${LOGGER_SCRIPT}" ]]; then
    echo "Error: cannot find iplogger.sh next to this installer (${LOGGER_SCRIPT})" >&2
    exit 1
fi

# Target user: argument, else the sudo invoker, else owner of the script.
if [[ -n "${1:-}" ]]; then
    target_user="${1}"
elif [[ -n "${SUDO_USER:-}" ]]; then
    target_user="${SUDO_USER}"
else
    target_user="$(stat -c '%U' "${LOGGER_SCRIPT}")"
fi

if ! id "${target_user}" >/dev/null 2>&1; then
    echo "Error: target user '${target_user}' does not exist" >&2
    exit 1
fi

if [[ "${target_user}" == "root" ]]; then
    echo "Warning: target user is root; logs will go to /root/Log" >&2
fi

# --- Make sure the logger is executable ---------------------------------------

chmod 0755 "${LOGGER_SCRIPT}"

# --- Write the cron.d entry ---------------------------------------------------

CRON_FILE="/etc/cron.d/iplogger"

cat > "${CRON_FILE}" <<EOF
# Installed by install-ip-logger.sh on $(date '+%Y-%m-%d %H:%M:%S %z')
# Logs public + local IP every minute as user ${target_user} into ~${target_user}/Log
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

* * * * * ${target_user} ${LOGGER_SCRIPT}
EOF

# cron.d files must be root-owned and not group/world writable.
chown root:root "${CRON_FILE}"
chmod 0644 "${CRON_FILE}"

echo "Installed cron job at ${CRON_FILE}"
echo "  -> runs ${LOGGER_SCRIPT} every minute as user '${target_user}'"
echo "  -> log file: $(eval echo "~${target_user}")/Log/iplogger.log"
echo
echo "Remove later with: sudo rm ${CRON_FILE}"
```


# 2. Log my shell commands

<!-- TODO: explain the goal — a persistent, timestamped history of every command I type. -->

The relevant `history` and prompt configuration lives in my `~/.bashrc`:

```bash
# TODO: paste the history + PROMPT_COMMAND snippet from ~/.bashrc here
```


# 3. Log the LLM shell commands

<!-- TODO: explain — capture every command the agent runs, not just the ones I type. -->

This is an OpenCode plugin that lives in `.vim/opencode` and is published to my [vimfiles repo](https://github.com/Tinmarino/vimfiles).

<!-- TODO: replace with the plugin source once it is committed to github/vimfiles -->

```javascript
// TODO: include from .vim/opencode (vimfiles repo)
```


# 4. A Python writer skill

<!-- TODO: explain — a skill that writes Python in my personal style. -->

The skill definition is published to [vimfiles](https://github.com/Tinmarino/vimfiles).

<!-- TODO: replace with the SKILL.md content -->

```markdown
<!-- TODO: include python-writer SKILL.md -->
```


# 5. An async IP-rotating HTTP skill

<!-- TODO: explain — a skill that writes mass-enumeration scripts with a bounded worker pool and AWS API Gateway IP rotation. -->

The skill definition is published to [vimfiles](https://github.com/Tinmarino/vimfiles).

<!-- TODO: replace with the SKILL.md content -->

```markdown
<!-- TODO: include http-async-rotate SKILL.md -->
```
