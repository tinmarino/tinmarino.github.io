---
title: "Python D4 - One Bracket Type"
---

# One Bracket Type

## Instructions

Write a function `is_balanced_round(stg: str) -> bool` that returns `True` when the round brackets in `stg` pair up correctly, and `False` when they do not.

Only `(` and `)` matter here. `[`, `]`, `{` and `}` are ordinary characters like any other, and so is everything else. Return the boolean, do not print it.

You have spent three exercises on the stack. Not this one: **Check** refuses `.append(`, because one variable is enough here.

## Description

### Goal

Type `(2 + 3` into a calculator and it refuses to answer. Somewhere inside it, a function like the one you are about to write read that line, looked at the brackets, and decided the expression was not finished.

Given a string, hand back `True` if its round brackets pair up, and `False` if they do not.

Pairing up means two things at the same time: every `(` is closed by a `)` somewhere to its right, and every `)` closes a `(` somewhere to its left.

### Rules

- Return `True` or `False` &mdash; the boolean itself, not a printed message.
- Only `(` and `)` are brackets here. Letters, digits, spaces, punctuation: ignored.
- `[`, `]`, `{` and `}` are punctuation too, nothing more. `is_balanced_round("cos(x)]")` is `True`, and so is `is_balanced_round("[")`: neither of them contains a round bracket to pair up. The next exercise promotes those characters. This one does not.
- The empty string is balanced. Nothing in it was left open.
- One variable is enough here. Do **not** build a list &mdash; **Check** refuses `.append(`. You have just spent three exercises on the stack, and this is the problem where the stack collapses to a single number.

### Examples

| Call | Returns |
|---|---|
| `is_balanced_round("(cos(x) + 1)")` | `True` |
| `is_balanced_round("(2 + 3")` | `False` |
| `is_balanced_round("2 + 3)")` | `False` |
| `is_balanced_round(")(")` | `False` |
| `is_balanced_round("cos(x)) + (1")` | `False` |
| `is_balanced_round("()()")` | `True` |
| `is_balanced_round("7 times 8")` | `True` |
| `is_balanced_round("cos(x)]")` | `True` |
| `is_balanced_round("[")` | `True` |
| `is_balanced_round("")` | `True` |

### Things you will need

You have walked a string one character at a time since exercise `A3`, kept a running count since `B1`, and returned early from inside a loop in `B3`. Every part you need is already yours.

One piece of syntax is new. When a character can be one of two interesting kinds, the second question goes on an `elif`: it is asked only when the `if` above it said no, and when both say no, neither block runs at all.

```python
for light in ["red", "green", "orange"]:
    if light == "red":
        print("stop")
    elif light == "green":
        print("go")
```

### When do you know?

`"(2 + 3"` and `"2 + 3)"` are both rejected, and not for the same reason. Read `"(2 + 3"` from left to right, one character at a time, and mark the exact moment you become certain it is broken. Now do the same with `"2 + 3)"`. One of them gives itself away in the middle; the other says nothing at all until you run out of characters. Then try `")("`, which contains one of each, and `"cos(x)) + (1"`, which has two of each.

Two questions, and answering them is the exercise: while you were reading, what were you keeping track of? And once the string ran out, what did you still have to look at before you could say `True`?

## Starter code

```python # template
def is_balanced_round(stg: str) -> bool:
    """ Return True if the round brackets of stg pair up, False otherwise.

    >>> is_balanced_round("(cos(x) + 1)")
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(is_balanced_round("(cos(x) + 1)"))
```

## Tests

```python # tests
# One kind of bracket does not need a pile, so Check refuses the list.
# Strip docstrings and comments first so a note about .append( is not punished.
_chunks = __student_code__.split('"""')[::2]
_lines = [_line.split("#")[0] for _chunk in _chunks for _line in _chunk.split("\n")]
for _banned in (".append(",):
    assert not any(_banned in _line for _line in _lines), \
        f"Got: the banned shortcut {_banned}"

# The answer is a bool, not a number that happens to be truthy
assert isinstance(is_balanced_round("()"), bool), f"Got: {type(is_balanced_round('()'))}"
assert is_balanced_round("") is True, f"Got: {is_balanced_round('')}"
assert is_balanced_round("()") is True, f"Got: {is_balanced_round('()')}"
assert is_balanced_round("()()") is True, f"Got: {is_balanced_round('()()')}"
assert is_balanced_round("(())") is True, f"Got: {is_balanced_round('(())')}"
assert is_balanced_round("(") is False, f"Got: {is_balanced_round('(')}"
assert is_balanced_round(")") is False, f"Got: {is_balanced_round(')')}"
assert is_balanced_round("(()") is False, f"Got: {is_balanced_round('(()')}"
assert is_balanced_round("())") is False, f"Got: {is_balanced_round('())')}"
# Nothing closed, and then the string simply ends
assert is_balanced_round("((") is False, f"Got: {is_balanced_round('((')}"
# Anything that is not a bracket is ignored
assert is_balanced_round("7 times 8") is True, f"Got: {is_balanced_round('7 times 8')}"
assert is_balanced_round("no brackets at all") is True, \
    f"Got: {is_balanced_round('no brackets at all')}"
assert is_balanced_round("(cos(x) + 1)") is True, f"Got: {is_balanced_round('(cos(x) + 1)')}"
# Square and curly brackets are punctuation here, nothing more
assert is_balanced_round("cos(x)]") is True, f"Got: {is_balanced_round('cos(x)]')}"
assert is_balanced_round("[") is True, f"Got: {is_balanced_round('[')}"
assert is_balanced_round("}{") is True, f"Got: {is_balanced_round('}{')}"
assert is_balanced_round("{[(}]") is False, f"Got: {is_balanced_round('{[(}]')}"
assert is_balanced_round("(2 + 3") is False, f"Got: {is_balanced_round('(2 + 3')}"
assert is_balanced_round("2 + 3)") is False, f"Got: {is_balanced_round('2 + 3)')}"
assert is_balanced_round("((2 + 3) * (4 - 1)") is False, \
    f"Got: {is_balanced_round('((2 + 3) * (4 - 1)')}"
assert is_balanced_round("print(len(word))") is True, \
    f"Got: {is_balanced_round('print(len(word))')}"
# Exactly as many "(" as ")", and still broken: somewhere a closer arrives
# before its opener does. Comparing the two totals cannot tell these apart
# from the balanced strings above, and there are too many to special-case.
assert is_balanced_round(")(") is False, f"Got: {is_balanced_round(')(')}"
assert is_balanced_round("cos(x)) + (1") is False, \
    f"Got: {is_balanced_round('cos(x)) + (1')}"
assert is_balanced_round("print(len(word))) + (x") is False, \
    f"Got: {is_balanced_round('print(len(word))) + (x')}"
assert is_balanced_round("((2 + 3) * (4 - 1))) + (7") is False, \
    f"Got: {is_balanced_round('((2 + 3) * (4 - 1))) + (7')}"
# Fifty deep: a rule beats a special case
assert is_balanced_round("(" * 50 + ")" * 50) is True, \
    f"Got: {is_balanced_round('(' * 50 + ')' * 50)}"
assert is_balanced_round("(" * 50 + ")" * 49) is False, \
    f"Got: {is_balanced_round('(' * 50 + ')' * 49)}"
# Fifty of each, and one closer too many halfway along
assert is_balanced_round("(" * 25 + ")" * 26 + "(" * 25 + ")" * 24) is False, \
    f"Got: {is_balanced_round('(' * 25 + ')' * 26 + '(' * 25 + ')' * 24)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def is_balanced_round(stg: str) -> bool:
    """ Return True if the round brackets of stg pair up, False otherwise. """
    depth = 0
    for char in stg:
        if char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth < 0:
                return False
    return depth == 0
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: compares the two totals, so ")(" walks straight through
def is_balanced_round(stg: str) -> bool:
    return stg.count("(") == stg.count(")")
```

```python # wrong: only looks at the total once the string is over
def is_balanced_round(stg: str) -> bool:
    depth = 0
    for char in stg:
        if char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
    return depth == 0
```

```python # wrong: guards only the first half, so a late closer walks through
def is_balanced_round(stg: str) -> bool:
    brackets = ""
    for char in stg:
        if char in "()":
            brackets += char
    half = len(brackets) // 2
    if brackets[:half].count(")") > brackets[:half].count("("):
        return False
    return stg.count("(") == stg.count(")")
```

```python # wrong: catches the early closer but forgets the leftover openers
def is_balanced_round(stg: str) -> bool:
    depth = 0
    for char in stg:
        if char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth < 0:
                return False
    return True
```

```python # wrong: treats every other character as an error instead of ignoring it
def is_balanced_round(stg: str) -> bool:
    depth = 0
    for char in stg:
        if char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth < 0:
                return False
        else:
            return False
    return depth == 0
```

```python # wrong: counts the brackets and checks the total is even
def is_balanced_round(stg: str) -> bool:
    total = 0
    for char in stg:
        if char in "()":
            total += 1
    return total % 2 == 0
```

```python # wrong: counts every kind of bracket, not just the round ones
def is_balanced_round(stg: str) -> bool:
    depth = 0
    for char in stg:
        if char in "([{":
            depth += 1
        elif char in ")]}":
            depth -= 1
            if depth < 0:
                return False
    return depth == 0
```

```python # wrong: promotes the square bracket too, which is the next exercise
def is_balanced_round(stg: str) -> bool:
    depth = 0
    for char in stg:
        if char in "([":
            depth += 1
        elif char in ")]":
            depth -= 1
            if depth < 0:
                return False
    return depth == 0
```

```python # wrong: a stack, which is D5's answer arriving one exercise early
def is_balanced_round(stg: str) -> bool:
    waiting = []
    for char in stg:
        if char == "(":
            waiting.append(char)
        elif char == ")":
            if not waiting:
                return False
            waiting.pop()
    return not waiting
```

```python # wrong: inspects only the two ends of the string
def is_balanced_round(stg: str) -> bool:
    return stg.startswith("(") and stg.endswith(")")
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+stg\b
depth\s*[-+]?=
\bopen\w*\s*[-+]?=\s*\d
\+=\s*1
-=\s*1
==\s*["']\(["']
<\s*0
!=\s*0
never\s+(goes\s+)?negative
zero\s+at\s+the\s+end
stg\.count\(
```

### Shortcuts the tests reject outright

One construct is banned, and it is not a shortcut: `.append(`. Exercises `D1`,
`D2` and `D3` spend three problems building the reflex of reaching for a pile,
and this is the problem where that reflex costs more than it earns. An answer
built on a stack returns the right booleans for every string here, so no
assertion on a return value can ever turn it down &mdash; which is exactly why
the ban has to be on the source. Exercise `D5` opens by handing this exercise's
counter back to the student and showing where it breaks; a student who quietly
solved `D4` with a stack has already been told the punchline and gets nothing
from it.

The obvious one-liner &mdash; comparing how many `(` there are with how many `)`
&mdash; is *not* banned, because it is simply wrong, and a whole family of tests
says so: five strings with matching totals that are still unbalanced, breaking at
the first character, in the middle and fifty deep. No short list of literals
covers them, so patching the one-liner with an `if` costs more than solving the
exercise. Being turned down by a test the student can read teaches more than a
rule that refuses to run their code &mdash; whenever a test can be written at
all.

```text # banned
.append(
```
