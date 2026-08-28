---
title: "Python D5 - Balanced Parentheses"
---

# Balanced Parentheses

## Instructions

Write a function `is_balanced(stg: str) -> bool` that returns `True` when every bracket in `stg` is closed by a bracket of its own kind, in the right order.

Three kinds count: `()`, `[]` and `{}`. Any other character is ignored. Return the answer, do not print it.

**Check** refuses `.replace(`. Deleting every pair from the string until nothing changes does answer the question, but it is a different algorithm and it is not the one this exercise is for.

## Description

### Goal

Your editor turns a bracket red the moment it cannot be closed, and it decides that again on every keystroke. This is that check.

Given a string, return `True` when its brackets are correctly nested, and `False` when they are not.

### Rules

- Three kinds of bracket count: `()`, `[]` and `{}`. Every other character is ignored, so `"a(b)c"` is balanced and `"never odd or even"` is balanced too.
- A bracket must be closed by a bracket of **its own kind**. `"(]"` is not balanced.
- Order matters. A closer that arrives when nothing is open makes the whole string unbalanced, and so does a bracket that is still open when the string ends.
- Return `True` or `False`. Do not print anything.

### Examples

| Call | Returns |
|---|---|
| `is_balanced("(a + b) * [c]")` | `True` |
| `is_balanced("{[()]}")` | `True` |
| `is_balanced("([])")` | `True` |
| `is_balanced("([)]")` | `False` |
| `is_balanced("(")` | `False` |
| `is_balanced(")")` | `False` |
| `is_balanced("")` | `True` |
| `is_balanced("no brackets here")` | `True` |

### What exercise `D4` gave you

One kind of bracket needs one number. Add one when a bracket opens, take one away when it closes, and read the number as *how many are still open*:

```
string   ( ( ( ) ) )
counter  1 2 3 2 1 0
```

It never went below zero, and it finished on zero. That was the whole proof, and it fits in one sentence.

### Where that number stops being enough

Now run the same counter over two strings. One of them is correctly nested. The other is not:

```
string   ( [ ) ]     ( [ ] )
counter  1 2 1 0     1 2 1 0
```

The two rows are identical, so the counter answers `True` for both. It never wrote down **what** it counted. `(` and `[` both just made it go up by one, so when the number comes back down, nothing in it remembers whether the bracket being closed was round or square.

So the counter is out. Everything else about the problem is unchanged.

### Which opener does a closer belong to?

Read `"{[()]}"` from the left and stop at the first `)`. You can say which opener it closes &mdash; but only because of something you kept while reading. What did you keep, and how does it hand you back the right one?

### When it works

When **Check** goes green, read your own code back before you close the tab. Count how many times you wrote the same two or three lines with one character changed. Then ask whether three kinds of bracket really need three copies of the same idea, or whether the three pairs are data your program could look up instead of branches it has to spell out.

## Starter code

```python # template
def is_balanced(stg: str) -> bool:
    """ Return True when every bracket in stg is closed by its own kind, in order.

    >>> is_balanced("{[()]}")
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(is_balanced("print(sorted([3, 1, 2]))"))
```

## Tests

```python # tests
# Stripping the pairs until nothing is left answers the question without ever
# asking which opener a closer belongs to, so Check refuses it on the source.
# Strip docstrings and comments first so a note about .replace( is not punished.
_chunks = __student_code__.split('"""')[::2]
_lines = [_line.split("#")[0] for _chunk in _chunks for _line in _chunk.split("\n")]
for _banned in (".replace(",):
    assert not any(_banned in _line for _line in _lines), \
        f"Got: the banned shortcut {_banned}"

# The answer is a bool, not a number that happens to be truthy
assert isinstance(is_balanced("()"), bool), f"Got: {type(is_balanced('()'))}"
# Nothing to close, then the three smallest pairs
assert is_balanced("") is True, f"Got: {is_balanced('')}"
assert is_balanced("()") is True, f"Got: {is_balanced('()')}"
assert is_balanced("[]") is True, f"Got: {is_balanced('[]')}"
assert is_balanced("{}") is True, f"Got: {is_balanced('{}')}"
# A single bracket: an opener never closed, a closer never opened
assert is_balanced("(") is False, f"Got: {is_balanced('(')}"
assert is_balanced(")") is False, f"Got: {is_balanced(')')}"
assert is_balanced("[") is False, f"Got: {is_balanced('[')}"
assert is_balanced("}") is False, f"Got: {is_balanced('}')}"
# Nesting and sequencing
assert is_balanced("((()))") is True, f"Got: {is_balanced('((()))')}"
assert is_balanced("()[]{}") is True, f"Got: {is_balanced('()[]{}')}"
assert is_balanced("([])") is True, f"Got: {is_balanced('([])')}"
assert is_balanced("{[()]}") is True, f"Got: {is_balanced('{[()]}')}"
assert is_balanced("{[({[()]})]}") is True, f"Got: {is_balanced('{[({[()]})]}')}"
assert is_balanced("{[({[()]})]") is False, f"Got: {is_balanced('{[({[()]})]')}"
# Interleaved: right count, wrong nesting
assert is_balanced("([)]") is False, f"Got: {is_balanced('([)]')}"
assert is_balanced("[(])") is False, f"Got: {is_balanced('[(])')}"
assert is_balanced("{(})") is False, f"Got: {is_balanced('{(})')}"
# A wrong kind closed deep inside, and everything after it still lines up
assert is_balanced("([))") is False, f"Got: {is_balanced('([))')}"
assert is_balanced("((([))))") is False, f"Got: {is_balanced('((([))))')}"
# Right kinds, wrong order
assert is_balanced(")(") is False, f"Got: {is_balanced(')(')}"
assert is_balanced("())(") is False, f"Got: {is_balanced('())(')}"
# Right count, wrong kind
assert is_balanced("(]") is False, f"Got: {is_balanced('(]')}"
assert is_balanced("[}") is False, f"Got: {is_balanced('[}')}"
assert is_balanced("{)") is False, f"Got: {is_balanced('{)')}"
# Everything that is not a bracket is ignored
assert is_balanced("no brackets at all") is True, \
    f"Got: {is_balanced('no brackets at all')}"
assert is_balanced("print(sorted([3, 1, 2]))") is True, \
    f"Got: {is_balanced('print(sorted([3, 1, 2]))')}"
assert is_balanced("if (count[0] > 1) { go(); }") is True, \
    f"Got: {is_balanced('if (count[0] > 1) { go(); }')}"
assert is_balanced("2 * (3 + 4]") is False, f"Got: {is_balanced('2 * (3 + 4]')}"
assert is_balanced("a(b[c)d]e") is False, f"Got: {is_balanced('a(b[c)d]e')}"
# Fifty deep, three kinds alternating: a rule beats a table of special cases
assert is_balanced("([{" * 50 + "}])" * 50) is True, \
    f"Got: {is_balanced('([{' * 50 + '}])' * 50)}"
assert is_balanced("([{" * 50 + "}])" * 49 + "})]") is False, \
    f"Got: {is_balanced('([{' * 50 + '}])' * 49 + '})]')}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def is_balanced(stg: str) -> bool:
    """ Return True when every bracket in stg is closed by its own kind, in order. """
    closer = {"(": ")", "[": "]", "{": "}"}
    waiting = []
    for char in stg:
        if char in closer:
            waiting.append(closer[char])
        elif char in ")]}":
            if not waiting or waiting.pop() != char:
                return False
    return not waiting
```

The chain of `if`s a student writes first &mdash; one branch per kind of bracket,
three near-identical copies &mdash; is the same program. Put the two side by side
in class: the dict is what makes the code read like the sentence *an opener must
be closed by its closer*.

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: keeps exercise `D4`'s counter, so it cannot see the kind
def is_balanced(stg: str) -> bool:
    count = 0
    for char in stg:
        if char in "([{":
            count += 1
        elif char in ")]}":
            count -= 1
            if count < 0:
                return False
    return count == 0
```

```python # wrong: remembers the openers but closes them with any kind
def is_balanced(stg: str) -> bool:
    waiting = []
    for char in stg:
        if char in "([{":
            waiting.append(char)
        elif char in ")]}":
            if not waiting:
                return False
            waiting.pop()
    return not waiting
```

```python # wrong: overwrites the verdict instead of keeping it
def is_balanced(stg: str) -> bool:
    closer = {"(": ")", "[": "]", "{": "}"}
    waiting = []
    good = True
    for char in stg:
        if char in closer:
            waiting.append(closer[char])
        elif char in ")]}":
            if not waiting:
                return False
            good = waiting.pop() == char
    return good and not waiting
```

```python # wrong: one counter per kind, so "([)]" still walks through
def is_balanced(stg: str) -> bool:
    round_n = square = curly = 0
    for char in stg:
        if char == "(":
            round_n += 1
        elif char == ")":
            round_n -= 1
        elif char == "[":
            square += 1
        elif char == "]":
            square -= 1
        elif char == "{":
            curly += 1
        elif char == "}":
            curly -= 1
        if round_n < 0 or square < 0 or curly < 0:
            return False
    return round_n == 0 and square == 0 and curly == 0
```

```python # wrong: strips the pairs once instead of until nothing changes
def is_balanced(stg: str) -> bool:
    brackets = "".join(char for char in stg if char in "()[]{}")
    brackets = brackets.replace("()", "").replace("[]", "").replace("{}", "")
    return not brackets
```

```python # wrong: uses the pile from the wrong end, oldest first
def is_balanced(stg: str) -> bool:
    closer = {"(": ")", "[": "]", "{": "}"}
    waiting = []
    for char in stg:
        if char in closer:
            waiting.append(closer[char])
        elif char in ")]}":
            if not waiting or waiting.pop(0) != char:
                return False
    return not waiting
```

```python # wrong: forgets the brackets still open when the string ends
def is_balanced(stg: str) -> bool:
    closer = {"(": ")", "[": "]", "{": "}"}
    waiting = []
    for char in stg:
        if char in closer:
            waiting.append(closer[char])
        elif char in ")]}":
            if not waiting or waiting.pop() != char:
                return False
    return True
```

```python # wrong: compares how many of each kind, not their order
def is_balanced(stg: str) -> bool:
    return (stg.count("(") == stg.count(")")
            and stg.count("[") == stg.count("]")
            and stg.count("{") == stg.count("}"))
```

```python # wrong: treats every other character as a closer
def is_balanced(stg: str) -> bool:
    closer = {"(": ")", "[": "]", "{": "}"}
    waiting = []
    for char in stg:
        if char in closer:
            waiting.append(closer[char])
        else:
            if not waiting or waiting.pop() != char:
                return False
    return not waiting
```

```python # wrong: exercise `D4` handed in unchanged, round brackets only
def is_balanced(stg: str) -> bool:
    count = 0
    for char in stg:
        if char == "(":
            count += 1
        elif char == ")":
            count -= 1
            if count < 0:
                return False
    return count == 0
```

### Give-aways the Description must never contain

```text # forbidden
[Ss]tack
\bLIFO\b
last in, first out
\bpush\b
\bpop\b
\.pop\(
\.append\(
most recent
last opener
still-open
closer\s*=
pairs\s*=
"\(":\s*"\)"
\{\s*"\(":
for\s+char\s+in\s+stg
waiting\b
```

### Shortcuts the tests reject outright

One construct is banned: `.replace(`. Deleting every `()`, `[]` and `{}` from
the string and repeating until nothing changes leaves an empty string exactly
when the brackets were balanced. It is four lines, it is *correct*, and it is
the answer a search engine hands over first &mdash; so no assertion on a return
value can ever turn it down, which is why the ban has to be on the source. It
also never asks the question this exercise is made of: which opener does *this*
closer belong to? A student who hands it in gets a green **Check** and no
lesson.

Counting `(` against `)` is *not* banned, because it is simply wrong and the
tests say so at length: the interleavings, the wrong kinds and the fifty-deep
pair all turn it down. Being refused by a test the student can read teaches more
than a rule that refuses to run their code &mdash; whenever a test can be
written at all.

```text # banned
.replace(
```
