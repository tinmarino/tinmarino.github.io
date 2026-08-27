#!/usr/bin/env python3
# PYTHON_ARGCOMPLETE_OK

"""
Teacher companion for the "Git para Operaciones" class.

Two jobs, one script:

  1. `<id|name>`      print a 10-line colored cheat card (Brief / Desc /
     Ex / Mission) for one command, by number or by git name. Class 1 is
     numbered 1xx (101 = help, 102 = init, ...), class 2 is numbered 2xx
     (201 = clone, 202 = remote, ...).
  2. `cc [-n N]`      commit-candy: touch random files of a scratch repo so
     the class can watch status / diff / add / commit on real changes. The
     repo is $GG_DEMO_REPO, else the git repo of the current directory,
     else the one found under ./demo/ or ./safedev/ next to this script.

Usage:
  ./script/git_para_operaciones.py list        # o `ll`
  ./script/git_para_operaciones.py ll 2
  ./script/git_para_operaciones.py 101
  ./script/git_para_operaciones.py help
  ./script/git_para_operaciones.py 207
  ./script/git_para_operaciones.py merge
  ./script/git_para_operaciones.py cc
  ./script/git_para_operaciones.py cc -n 5 --commit

"""

# Imports, stdlib only: this must run on any student laptop
from argparse import ArgumentParser, RawTextHelpFormatter
from collections import OrderedDict
from os import environ, getcwd, listdir
from os.path import abspath, dirname, isdir, join, realpath
from random import choice
from re import MULTILINE as re_MULTILINE, sub as re_sub
from subprocess import run as subprocess_run
from sys import argv as sys_argv, stderr as sys_stderr, stdout as sys_stdout

# Import argcomplete when installed; the CLI works without it
try:
    from argcomplete import autocomplete
except ImportError:
    def autocomplete(*_args, **_kwargs):
        """ Do nothing: argcomplete is not installed. """

PROG_NAME = "git_para_operaciones.py"

# ANSI colorscheme, terminal-default so it reads on light and dark
CGREEN  = "\033[32m"
CYELLOW = "\033[33m"
CBLUE   = "\033[34m"
CPURPLE = "\033[35m"
CCYAN   = "\033[36m"
CRED    = "\033[31m"
CRESET  = "\033[0m"
BPURPLE = "\033[1m\033[35m"
BWHITE  = "\033[1m"

# Bash-in-Vim palette for the Ex: block. Truecolor when the terminal says so,
# otherwise the closest 4-bit ANSI, so a plain tty still reads fine.
TRUECOLOR = environ.get("COLORTERM", "") in ("truecolor", "24bit")
CGIT     = "\033[38;2;0;231;124m" if TRUECOLOR else "\033[92m"   # sek-std-green #00e77c
CCOMMAND = "\033[38;2;224;108;117m" if TRUECOLOR else "\033[31m"  # salmon, like vim
CCOMMENT = "\033[38;2;127;132;142m" if TRUECOLOR else "\033[90m"  # grey
CARG     = "\033[38;2;171;178;191m" if TRUECOLOR else "\033[37m"  # default foreground


# ============================================================ THE MAGIC DICT
# One entry per command of part 1. Each card prints in at most 10 lines,
# in English, with Brief / Desc / Ex / Mission. Keep it terse: this is
# what the room reads on the projector, not documentation.

D_CMD = OrderedDict()

D_CMD[101] = {
        "name": "git help",
        "brief": "Git explains itself, offline.",
        "desc": "Every command carries its own manual. Never guess a flag again.",
        "ex": ["git help", "git help commit", "git help -a | less"],
        "mission": "Run `git help -a`, find a command you never heard of, read its first line.",
        }

D_CMD[102] = {
        "name": "git init",
        "brief": "Turn a folder into a repository. Once, forever.",
        "desc": "Creates the hidden .git directory: your folder plus its memory.",
        "ex": ["mkdir demo && cd demo", "git init .", "ls -a   # .  ..  .git"],
        "mission": "Init a scratch folder, `ls -a` it, delete .git, prove the files survive.",
        }

D_CMD[103] = {
        "name": "git config",
        "brief": "Configure once, save forever.",
        "desc": "Identity, editor and aliases. --global writes to ~/.gitconfig.",
        "ex": ['git config --global user.name "Martin Tourneboeuf"',
            'git config --global user.email "martin.tourneboeuf@sek.io"',
            "",
            'git config --global alias.lg "log --oneline --graph --all"',
            "git config --list --show-origin"],
        "mission": "Create your own `git lg` alias and run it on the demo repo.",
        }

D_CMD[104] = {
        "name": "git status",
        "brief": "Where am I and what did I break?",
        "desc": "Branch, staged, modified and untracked files. Run it constantly.",
        "ex": ["git status", "git status -sb", "git status --porcelain"],
        "mission": "Run `cc`, then read `git status -sb` and name every file you touched.",
        }

D_CMD[105] = {
        "name": "git diff",
        "brief": "See the change before you own it.",
        "desc": "Working tree vs index by default; --staged shows what commit would take.",
        "ex": ["git diff", "git diff --staged", "git diff --stat"],
        "mission": "Change one line, read the diff out loud, and explain the - and + markers.",
        }

D_CMD[106] = {
        "name": "git add",
        "brief": "Choose what goes into the next commit.",
        "desc": "Moves changes to the staging area. The index is a rehearsal room.",
        "ex": ["git add stock/monitor.py", "git add -p   # hunk by hunk", "git add -A"],
        "mission": "Use `git add -p` to stage only half of your changes, then check `git status`.",
        }

D_CMD[107] = {
        "name": "git commit",
        "brief": "Freeze a version with a reason.",
        "desc": "A commit is a snapshot plus a message. The message is the gift to future you.",
        "ex": ['git commit -m "Corrige redondeo de montos en CLP"',
            "git commit -v", "git commit --amend"],
        "mission": "Write a commit message in imperative mood, no 'fix stuff', and defend it.",
        }

D_CMD[108] = {
        "name": "git show",
        "brief": "Open one commit and look inside.",
        "desc": "Metadata plus the full patch of a single revision.",
        "ex": ["git show", "git show HEAD~2", "git show HEAD:stock/config.py"],
        "mission": "Show the file as it was 3 commits ago without changing your working tree.",
        }

D_CMD[109] = {
        "name": "git log",
        "brief": "The project's memory, queryable.",
        "desc": "History with filters: by date, author, file or content.",
        "ex": ["git log --oneline --graph --decorate --all",
            'git log --since="2 weeks" --author=Martin',
            "git log -- stock/monitor.py"],
        "mission": "Find the oldest commit that touched config.py, in one command.",
        }

D_CMD[110] = {
        "name": "git shortlog",
        "brief": "Who did what, counted.",
        "desc": "Groups commits by author. Instant contribution report.",
        "ex": ["git shortlog -sn", "git shortlog -sne --all", 'git shortlog -sn --since="1 month"'],
        "mission": "Produce the top-3 contributors of the demo repo and say it in one sentence.",
        }

D_CMD[111] = {
        "name": "git blame",
        "brief": "Every line has an author and a date.",
        "desc": "Not for blaming: for finding the commit that explains the line.",
        "ex": ["git blame stock/monitor.py", "git blame -L 10,20 stock/config.py",
            "git blame -w -C stock/config.py"],
        "mission": "Blame one suspicious line, then `git show` its commit and read the why.",
        }

D_CMD[112] = {
        "name": "git grep",
        "brief": "Search the code, not the disk.",
        "desc": "Faster than grep -r and it can search any past revision.",
        "ex": ["git grep umbral", "git grep -n TODO", "git grep umbral HEAD~10"],
        "mission": "Find a string that exists today and prove when it did NOT exist yet.",
        }

D_CMD[113] = {
        "name": "git restore",
        "brief": "Undo what you did not commit.",
        "desc": "Throw away working-tree edits, or unstage what you added by mistake.",
        "ex": ["git restore stock/monitor.py", "git restore .",
            "git restore --staged stock/reporte.py"],
        "mission": "Break a file on purpose, panic for 3 seconds, then restore it.",
        }

D_CMD[114] = {
        "name": "git checkout",
        "brief": "Travel to an older version to look at it.",
        "desc": "The old swiss knife: modern Git splits it into switch + restore.",
        "ex": ["git checkout v0.05", "git checkout main",
            "git checkout v0.10 -- stock/cli.py"],
        "mission": "Visit an old tag, read one file, come back to main with nothing lost.",
        }

D_CMD[115] = {
        "name": "git stash",
        "brief": "Park half-finished work without committing it.",
        "desc": "A shelf for your changes when something urgent arrives.",
        "ex": ['git stash push -m "media exportacion"', "git stash list", "git stash pop"],
        "mission": "Stash your edits, switch context, pop them back and confirm nothing was lost.",
        }

D_CMD[116] = {
        "name": "git clean",
        "brief": "Delete what Git does not know. No undo.",
        "desc": "Removes untracked files. Always dry-run first.",
        "ex": ["git clean -n", "git clean -fd", "git clean -fdx   # careful"],
        "mission": "Create junk files, list them with -n, and only then delete them.",
        }

# ------------------------------------------------------------ Class 2 (2xx)

D_CMD[201] = {
        "name": "git clone",
        "brief": "Bring home a repository that lives on a server.",
        "desc": "Downloads every file and its whole history, in one shot.",
        "ex": ["git clone https://github.com/tinmarino/stock",
            "git clone --depth 1 <url>   # shallow",
            "git fetch --unshallow"],
        "mission": "Clone the demo repo shallow, then unshallow it and compare `git log | wc -l`.",
        }

D_CMD[202] = {
        "name": "git remote",
        "brief": "`origin` is just a nickname for a URL.",
        "desc": "A local repo can talk to several remotes, each with its own name.",
        "ex": ["git remote -v", "git remote add origin https://git.example.com/ops/stock.git",
            "git remote set-url origin git@git.example.com:ops/stock.git"],
        "mission": "Add a second remote pointing to a local folder and list both with -v.",
        }

D_CMD[203] = {
        "name": "git pull",
        "brief": "Receive before you give.",
        "desc": "pull = fetch + merge. With --rebase you get one straight line, no knots.",
        "ex": ["git pull", "git pull --rebase", "git config --global pull.rebase true"],
        "mission": "Pull twice, once merging and once rebasing, and compare `git log --graph`.",
        }

D_CMD[204] = {
        "name": "git push",
        "brief": "Only now the work belongs to everybody.",
        "desc": "Sends your commits to the shared server. Never --force on main.",
        "ex": ["git push -u origin main", "git push",
            "git push --force-with-lease   # your branch only"],
        "mission": "Push a branch with -u, then show that a plain `git push` is enough afterwards.",
        }

D_CMD[205] = {
        "name": "git branch",
        "brief": "Work in parallel without touching main.",
        "desc": "A branch is a post-it on a commit, not a copy of the folder.",
        "ex": ["git branch", "git branch -a", "git branch -d experimento"],
        "mission": "List every branch including remotes, then delete one safely with -d.",
        }

D_CMD[206] = {
        "name": "git switch",
        "brief": "Change branch, and only that.",
        "desc": "The modern half of checkout: moves you, never destroys your edits.",
        "ex": ["git switch -c feature/alertas", "git switch main", "git switch -"],
        "mission": "Create a branch, commit once, and jump back and forth with `git switch -`.",
        }

D_CMD[207] = {
        "name": "git merge",
        "brief": "Join two lines of work into one.",
        "desc": "Git merges what does not clash; the rest is a conflict you resolve by hand.",
        "ex": ["git merge feature/alertas", "git checkout --ours config.py",
            "git merge --abort   # the panic button"],
        "mission": "Provoke a conflict on purpose, read the markers, --abort, then redo it right.",
        }

D_CMD[208] = {
        "name": "git revert",
        "brief": "Undo a commit that is already shared.",
        "desc": "Creates a new commit that cancels the old one. History is corrected forward.",
        "ex": ["git revert d1bb173", "git revert -m 1 <merge>",
               "git revert --no-commit HEAD~3..HEAD"],
        "mission": "Revert a commit and explain why this is safer than reset on a shared branch.",
        }

D_CMD[209] = {
        "name": "git tag",
        "brief": "A stable name for a commit: the release.",
        "desc": "Annotated tags carry author, date and message. Lightweight ones prove nothing.",
        "ex": ['git tag -a v1.2.0 -m "Release julio 2026"', "git tag -s v1.2.0 -m 'firmado'",
            "git push origin v1.2.0   # tags do NOT ride on git push"],
        "mission": "Tag a commit annotated, then prove with cat-file that it stores who and when.",
        }

D_CMD[210] = {
        "name": "git show (tag)",
        "brief": "Read and compare deliveries.",
        "desc": "The changelog of a release comes out of the repository, not out of a mail.",
        "ex": ["git show --stat v1.2.0", "git diff v1.1.0..v1.2.0",
            "git diff --stat v1.1.0-prod..v1.2.0-prod"],
        "mission": "Produce the list of files that changed between two tags, in one command.",
        }

D_CMD[211] = {
        "name": "git describe",
        "brief": "Where exactly am I, with a readable name?",
        "desc": "tag + commits since + short SHA. The version number of the artifact you build.",
        "ex": ["git describe --tags", "git describe --tags --dirty",
            "git describe --tags --always"],
        "mission": "Get a -dirty describe, and explain why that binary is not reproducible.",
        }

D_CMD[212] = {
        "name": "git for-each-ref",
        "brief": "Your releases, sorted and queryable.",
        "desc": '"Is that patch in prod?" is a query, not an email thread.',
        "ex": ["git for-each-ref --sort=-creatordate refs/tags"
               " --format='%(refname:short) %(creatordate:short)'",
            "git tag --list 'v1.*-prod'", "git tag --contains d1bb173"],
        "mission": "Answer which release contains a given commit, without opening a browser.",
        }

D_CMD[213] = {
        "name": "git reflog",
        "brief": "The safety net nobody knows about.",
        "desc": "Every move of HEAD is recorded, even commits you think you destroyed.",
        "ex": ["git reflog", "git reflog --date=iso", "git reset --hard HEAD@{2}"],
        "mission": "Destroy a commit with reset --hard, then bring it back from the reflog.",
        }

D_CMD[214] = {
        "name": "git reset",
        "brief": "Three faces: soft, mixed, hard.",
        "desc": "--soft keeps changes staged, --mixed unstages them, --hard deletes them.",
        "ex": ["git reset --soft HEAD~1", "git reset --mixed HEAD~1", "git reset --hard HEAD~1"],
        "mission": "Squash your last two commits into one using reset --soft, no rebase needed.",
        }

D_CMD[215] = {
        "name": "git rebase -i",
        "brief": "Turn 10 chaotic commits into 3 readable ones.",
        "desc": "Rewrite freely what is yours; never what you already shared.",
        "ex": ["git rebase -i HEAD~5", "git rebase -i --autosquash HEAD~5", "git rebase --abort"],
        "mission": "Squash and reword your last commits, then check the log reads like a story.",
        }

D_CMD[216] = {
        "name": "git filter-repo",
        "brief": "Erase a file from the WHOLE history.",
        "desc": "A leaked secret is not removed by a new commit. And once pushed, rotate it.",
        "ex": ["pip install git-filter-repo",
            "git filter-repo --path data/secretos.env --invert-paths",
            "git push --force --all   # everybody must reclone"],
        "mission": "Commit a fake secret, wipe it from history, prove git log -S finds nothing.",
        }

D_CMD[217] = {
        "name": "git cat-file",
        "brief": "Git is an object database addressed by SHA.",
        "desc": "A commit is a tree plus metadata, every piece with its own fingerprint.",
        "ex": ["git rev-parse HEAD", "git cat-file -t <sha>", "git cat-file -p HEAD"],
        "mission": "Walk from HEAD to a blob using only cat-file, and print the file content.",
        }


# ============================================================ NAME INDEX
# Every card is reachable by its git name too (`gg merge` == `gg 207`).
# A name can be ambiguous across classes (`show` is 108 and 210): we then
# list the candidates instead of guessing.

def _card_name(card):
    """ Return the bare git name of *card* ("git show (tag)" -> "show"). """
    name = card["name"].replace("git ", "", 1)
    return name.split(" ")[0]


D_NAME: OrderedDict = OrderedDict()
for _cmd_id, _card in D_CMD.items():
    D_NAME.setdefault(_card_name(_card), []).append(_cmd_id)


# ============================================================ TERMINAL COLOR
def _is_tty(stream=sys_stderr):
    """ True iff *stream* is a terminal (gate ANSI output). """
    return hasattr(stream, "isatty") and stream.isatty()


def color(text, code):
    """ Wrap *text* in ANSI *code* when stdout is a terminal. """
    if not _is_tty(sys_stdout):
        return text
    return f"{code}{text}{CRESET}"


class ColorHelpFormatter(RawTextHelpFormatter):
    """ Argparse formatter that adds ANSI colors when stderr is a TTY.

    Yellow box around the description/epilog (BPURPLE on the first
    line, CBLUE on the rest), blue section headings, purple option
    flags and indented subcommand choices, yellow choice metavars,
    green program name. """

    def _format_text(self, text):
        """ Wrap parser description (and epilog) in a yellow box. """
        if not text or not text.strip() or not _is_tty():
            return super()._format_text(text)
        lines = text.rstrip("\n").split("\n")
        width = max((len(line) for line in lines), default=1)
        indent = " " * self._current_indent
        barr = "═" * (width + 2)
        top    = f"{indent}{CYELLOW}╔{barr}╗{CRESET}"
        bottom = f"{indent}{CYELLOW}╚{barr}╝{CRESET}"
        middle = []
        for i, line in enumerate(lines):
            padded = line.ljust(width)
            inner = f"{BPURPLE}{padded}{CRESET}" if i == 0 else f"{CBLUE}{padded}{CRESET}"
            middle.append(f"{indent}{CYELLOW}║{CRESET} {inner} {CYELLOW}║{CRESET}")
        return "\n".join([top, *middle, bottom]) + "\n\n"

    def format_help(self):
        text = super().format_help()
        if not _is_tty():
            return text

        # 'usage:' -> yellow
        text = re_sub(r"^(usage:)", f"{CYELLOW}\\1{CRESET}", text, flags=re_MULTILINE)

        # Program name -> green
        text = re_sub(rf"{PROG_NAME}", f"{CGREEN}{PROG_NAME}{CRESET}", text)

        # Section headings ('positional arguments:', 'options:') -> blue
        text = re_sub(r"^([A-Za-z][A-Za-z ]*?):\s*$",
                      f"{CBLUE}\\1:{CRESET}", text, flags=re_MULTILINE)

        # Choice metavars {a,b,c,...} -> yellow (BEFORE option flag rule)
        text = re_sub(r"(\{[\w-]+(?:,[\w-]+)+\})", f"{CYELLOW}\\1{CRESET}", text)

        # Option flags (-h, --help, --foo-bar) -> purple
        text = re_sub(r"(?<![A-Za-z0-9_])(-{1,2}[A-Za-z][\w-]*)",
                      f"{CPURPLE}\\1{CRESET}", text)

        # Subcommand choice names (4-space indent + word + 2+ spaces) -> purple
        text = re_sub(r"^(    )([A-Za-z][\w-]*)(\s{2,})",
                      lambda m: f"{m.group(1)}{CPURPLE}{m.group(2)}{CRESET}{m.group(3)}",
                      text, flags=re_MULTILINE)

        return text


# ============================================================ BASH HIGHLIGHT
# Colorize the Ex: lines the way bash looks in Vim: command word in salmon,
# arguments in the default foreground, comments in grey. `git` gets the SEK
# green so the eye lands on it from the back of the room.

# A new command starts at the beginning of the line and after these operators
S_OPERATOR = ("&&", "||", "|", ";")


def _color_token(token, is_command):
    """ Return *token* colored as a command name, as `git`, or as an argument. """
    if token == "git":
        return color(token, CGIT)
    if token in S_OPERATOR or is_command:
        return color(token, CCOMMAND)
    return color(token, CARG)


def color_bash(line):
    """ Return *line* with bash-like syntax coloring for the Ex: block. """
    # Peel off the trailing comment first: everything after it is grey
    code, sharp, comment = line.partition("#")
    if sharp and not code.strip():
        return color(line, CCOMMENT)

    token_list = code.split(" ")
    is_command = True
    colored_list = []
    for token in token_list:
        if not token:
            colored_list.append(token)
            continue
        colored_list.append(_color_token(token, is_command))
        is_command = token in S_OPERATOR

    out = " ".join(colored_list)
    if sharp:
        out += color(sharp + comment, CCOMMENT)
    return out


# ============================================================ CARD PRINTING
def resolve_target(target):
    """ Return the card id matching *target* (a number or a git name), or None. """
    if target.isdigit():
        return int(target)

    candidate_list = D_NAME.get(target.replace("git ", "", 1).strip().lower())
    if candidate_list is None:
        return None
    if len(candidate_list) == 1:
        return candidate_list[0]

    # Ambiguous name: show the candidates rather than picking one
    print(color(f"`{target}` is taught twice. Pick one:", CYELLOW))
    for cmd_id in candidate_list:
        print(color(f"  {cmd_id}", CPURPLE) + "  " + color(D_CMD[cmd_id]["name"], CCYAN))
    return -1


def print_card(target):
    """ Print the 10-line colored teaching card of command *target*. """
    cmd_id = resolve_target(str(target))
    if cmd_id == -1:
        return 1

    card = D_CMD.get(cmd_id)
    if card is None:
        print(color(f"No command `{target}`. Try `list`.", CRED))
        return 1

    title = f" {cmd_id}  {card['name']} "
    print()
    print(color("╔" + "═" * (len(title)) + "╗", CYELLOW))
    print(color("║", CYELLOW) + color(title, BPURPLE) + color("║", CYELLOW))
    print(color("╚" + "═" * (len(title)) + "╝", CYELLOW))
    print(color("Brief:   ", CGREEN) + color(card["brief"], BWHITE))
    print()
    print(color("Desc:    ", CGREEN) + color(card["desc"], CBLUE))
    print()
    for i, example in enumerate(card["ex"]):
        if not example:
            print()
            continue
        label = "Ex:      " if i == 0 else "         "
        print(color(label, CGREEN) + color_bash(example))
    print()
    print(color("Mission: ", CGREEN) + color(card["mission"], CYELLOW))
    print()
    return 0


def print_list(klass=None):
    """ Print the id -> command index, optionally restricted to class *klass*. """
    # Clause: refuse a class that holds no command
    selected = [(i, c) for i, c in D_CMD.items() if klass is None or i // 100 == klass]
    if not selected:
        print(color(f"No class {klass}. Known classes: 1, 2.", CRED))
        return 1

    current = None
    print()
    for cmd_id, card in selected:
        if cmd_id // 100 != current:
            # Una linea en blanco entre clases, salvo antes de la primera
            if current is not None:
                print()
            current = cmd_id // 100
            print(color(f"Git para Operaciones — clase {current}", BPURPLE))

        # `git` en verde SEK, el subcomando en purpura, el brief de comentario
        name, _, rest = card["name"].partition(" ")
        padding = " " * max(17 - len(card["name"]), 1)
        print(color(f"  {cmd_id}", CPURPLE) + "  "
              + color(name, CGIT) + " " + color(rest, CPURPLE) + padding
              + color(f"# {card['brief']}", CCOMMENT))
    print()
    return 0


# ============================================================ DEMO REPO (cc)
# Random but plausible edits on a scratch repo, so the class sees a real
# diff. The repo is never named here: it comes from $GG_DEMO_REPO or from
# the single git repository sitting under ./demo/ or ./safedev/.

S_DEMO_PARENT = ("demo", "safedev")

# Notes appended by the random edits, one flavour per file kind
S_NOTE = (
    "Mejora los mensajes de log",
    "Documenta las variables de entorno",
    "Limpia imports no usados",
    "Ajusta el formato de los montos",
    "Cubre el caso borde con un test",
    "Aclara los requisitos de instalacion",
    )


def _git_toplevel(start_dir):
    """ Return the root of the git repo holding *start_dir*, or None. """
    result = subprocess_run(["git", "-C", start_dir, "rev-parse", "--show-toplevel"],
                            check=False, capture_output=True, text=True)
    if result.returncode != 0:
        return None
    return result.stdout.strip() or None


def _repo_path():
    """ Return the scratch repo path, or None when no candidate holds a .git. """
    # Clause: an explicit env var always wins
    env_repo = environ.get("GG_DEMO_REPO", "")
    if env_repo and isdir(join(env_repo, ".git")):
        return env_repo

    project_dir = dirname(dirname(abspath(__file__)))

    # Then the repo you are standing in, as long as it is not this project
    cwd_repo = _git_toplevel(getcwd())
    if cwd_repo is not None and realpath(cwd_repo) != realpath(project_dir):
        return cwd_repo

    for parent in S_DEMO_PARENT:
        parent_dir = join(project_dir, parent)
        if not isdir(parent_dir):
            continue
        for entry in sorted(listdir(parent_dir)):
            candidate = join(parent_dir, entry)
            if isdir(join(candidate, ".git")):
                return candidate
    return None


S_SUFFIX = (".py", ".md", ".txt", ".sh", ".yml", ".yaml", ".cfg", ".toml")


def _editable_file_list(repo):
    """ Return the text files of *repo* a random edit can append to.

    Tracked files first, but a freshly `git init`-ed repo has none: fall back
    to the untracked ones that are not ignored. """
    for git_argument_list in (["ls-files"], ["ls-files", "--others",
                                             "--exclude-standard"]):
        listing = subprocess_run(["git", "-C", repo, *git_argument_list],
                                 check=True, capture_output=True, text=True).stdout
        file_list = [name for name in listing.split("\n") if name.endswith(S_SUFFIX)]
        if file_list:
            return file_list
    return []


def _comment_line(relative_path, note):
    """ Return *note* written as a comment in the syntax of *relative_path*. """
    if relative_path.endswith(".md"):
        return f"- {note}."
    if relative_path.endswith((".txt", ".cfg")):
        return f"{note}."
    return f"# TODO: {note}"


def _random_edit(repo):
    """ Append one plausible line to a random file; return the commit message. """
    file_list = _editable_file_list(repo)

    # An empty repo still deserves a diff: give it a file to grow
    relative_path = choice(file_list) if file_list else "notas.md"
    note = choice(S_NOTE)
    with open(join(repo, relative_path), "a", encoding="utf-8") as file_out:
        file_out.write(_comment_line(relative_path, note) + "\n")
    return f"{note} en {relative_path}"


def run_cc(number, do_commit):
    """ Apply *number* random edits to the demo repo, optionally committing each. """
    repo = _repo_path()
    if repo is None:
        print(color("No git repo here. Run `git init`, cd into a repo, or set "
                    "$GG_DEMO_REPO.", CRED))
        return 1

    for i in range(1, number + 1):
        message = _random_edit(repo)
        print(color(f"[{i}/{number}] ", CPURPLE) + color(message, CBLUE))
        if not do_commit:
            continue
        subprocess_run(["git", "-C", repo, "add", "-A"], check=True)
        subprocess_run(["git", "-C", repo, "commit", "-q", "-m", message], check=True)
        head = subprocess_run(["git", "-C", repo, "rev-parse", "--short", "HEAD"],
                              check=True, capture_output=True, text=True).stdout.strip()
        print(color(f"          commited {head}", CGREEN))

    if do_commit:
        return 0

    # Hand the room the next command to type
    print()
    print(color("Now show them:", CYELLOW))
    print(color(f"   git -C {repo} status -sb", CCYAN))
    print(color(f"   git -C {repo} diff", CCYAN))
    return 0


# ============================================================ CLI
def print_alias_tip():
    """ Print the shell alias line, resolved to this script's real path. """
    real_path = realpath(__file__)
    print()
    print(color("Tip: put this in your ~/.bashrc", CYELLOW))
    print(color(f"   alias gg=\'python3 {real_path}\'", CCYAN))
    print(color("   gg 101   gg help   gg ll 2   gg cc -n 5", CBLUE))
    print()


def parse_argument():
    """ Build the colored parser and return (parser, parsed arguments). """
    formatter = ColorHelpFormatter if _is_tty() else RawTextHelpFormatter
    parser = ArgumentParser(prog=PROG_NAME, description=__doc__,
                            formatter_class=formatter)
    subparser = parser.add_subparsers(dest="command", help="Subcommand to run")

    # The card subcommand is implicit: typing a number is enough
    card_parser = subparser.add_parser(
            "card", help="Print a teaching card (implicit: just type the number)",
            description="Print the teaching card of one command.",
            formatter_class=formatter)
    card_parser.add_argument("target", metavar="ID|NAME",
                             help="Command id or git name: 101, help, 207, merge, ...")

    list_parser = subparser.add_parser(
            "list", aliases=["ll"],
            help="List every command id, optionally of one class only (alias: ll)",
            description="List the command index of the class.",
            formatter_class=formatter)
    list_parser.add_argument("klass", type=int, nargs="?", metavar="CLASS",
                             help="Restrict to class 1 or 2 (default: both)")

    cc_parser = subparser.add_parser(
            "cc", help="Commit candy: random changes in the demo repo",
            description="Touch random files of the demo repo so the class can "
                        "watch status / diff / add / commit on real changes.",
            formatter_class=formatter)
    cc_parser.add_argument("-n", "--number", type=int, default=1, metavar="N",
                           help="How many random edits to apply (default: 1)")
    cc_parser.add_argument("--commit", action="store_true",
                           help="Also commit each edit in the demo repo")

    autocomplete(parser)

    # Sugar: a leading id or git name means the (implicit) card subcommand
    argument_list = sys_argv[1:]
    if argument_list and argument_list[0] not in ("card", "list", "ll", "cc",
                                                  "-h", "--help"):
        argument_list = ["card", *argument_list]

    return parser, parser.parse_args(argument_list)


def main():
    """ Dispatch the CLI: card printing, listing or demo-repo edits. """
    parser, args = parse_argument()

    # Clause: nothing asked -> show the help and the alias tip
    if not args.command:
        parser.print_help()
        print_alias_tip()
        return 0

    if args.command in ("list", "ll"):
        return print_list(args.klass)

    if args.command == "cc":
        return run_cc(args.number, args.commit)

    return print_card(args.target)


if __name__ == "__main__":
    raise SystemExit(main())
