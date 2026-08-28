---
title: "Python A3 - Reverse a String"
---

# Reverse a String

## Instructions

Write a function `reverse_string(stg: str) -> str` that returns the characters of `stg` in the opposite order.

Write the loop yourself. `[::-1]` and `reversed(` *are* the answer, so **Check** turns them down.

## Description

### Goal

Given a string, hand back a string holding the same characters, last one first.

### Rules

Build the result yourself with a loop. Do **not** use `reversed()` or the slice `[::-1]`.

### Examples

| Call | Returns |
|---|---|
| `reverse_string("hello")` | `"olleh"` |
| `reverse_string("Python")` | `"nohtyP"` |
| `reverse_string("racecar")` | `"racecar"` |
| `reverse_string("a")` | `"a"` |
| `reverse_string("")` | `""` |

### Things you will need

A `for` loop over a string visits one character at a time:

```python
for char in "abc":
    print(char)      # prints a, then b, then c
```

Strings are joined with `+`, and the two operands are **not** interchangeable &mdash;
swapping them gives a different result. Working out which way round you need it is
the whole exercise.

You can also index a string like a list, `stg[0]` being the first character, and
`len(stg)` gives its length.

### Which order do you need?

Same question as the previous exercise: if you visit the characters from **front to
back**, does each new one belong before or after the ones you have already collected?
Work it out on `"abc"` with pen and paper before typing.

### Watch out: strings are immutable

You cannot change a string in place. `stg[0] = "x"` raises a `TypeError`, unlike
lists where it works. So every `+` builds a **new** string: you have to keep the
result by assigning it somewhere, and whatever you build up has to start from
some value before the first character arrives.

### Edge cases

The empty string and a single character must work with no special handling &mdash;
if your loop is right, they already do.

## Starter code

```python # template
def reverse_string(stg: str) -> str:
    """ Return the characters of stg in reverse order.

    >>> reverse_string("hello")
    'olleh'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(reverse_string("hello"))
```

## Tests

```python # tests
# The point of this one is the loop you write, so Check refuses the shortcuts.
for _banned in ("[::-1]", "reversed("):
    assert _banned not in __student_code__, f"Got: the banned shortcut {_banned}"

assert reverse_string("hello") == "olleh", f"Got: {reverse_string('hello')}"
assert reverse_string("") == "", f"Got: {reverse_string('')}"
assert reverse_string("a") == "a", f"Got: {reverse_string('a')}"
assert reverse_string("Python") == "nohtyP", f"Got: {reverse_string('Python')}"
assert reverse_string("racecar") == "racecar", f"Got: {reverse_string('racecar')}"
# Not only letters: spaces, digits and punctuation must survive too
assert reverse_string("ab c!") == "!c ba", f"Got: {reverse_string('ab c!')}"
assert reverse_string("a1b2") == "2b1a", f"Got: {reverse_string('a1b2')}"
assert reverse_string("  x  ") == "  x  ", f"Got: {reverse_string('  x  ')}"
assert reverse_string("Hello, World!") == "!dlroW ,olleH", f"Got: {reverse_string('Hello, World!')}"
# Anti-hardcoding: a string not visible in the Examples table
_ANTI = "xkcd42!"
assert reverse_string(_ANTI) == "!24dckx", f"Got: {reverse_string(_ANTI)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def reverse_string(stg: str) -> str:
    """ Return the characters of stg in reverse order. """
    out = ""
    for char in stg:
        out = char + out
    return out
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: takes the slice shortcut
def reverse_string(stg: str) -> str:
    return stg[::-1]
```

```python # wrong: calls reversed() instead of looping
def reverse_string(stg: str) -> str:
    return "".join(reversed(stg))
```

```python # wrong: keeps only letters
def reverse_string(stg: str) -> str:
    out = ""
    for char in stg:
        if char.isalpha():
            out = char + out
    return out
```

```python # wrong: concatenates in the wrong order
def reverse_string(stg: str) -> str:
    out = ""
    for char in stg:
        out = out + char
    return out
```

```python # wrong: lowercases as a side effect
def reverse_string(stg: str) -> str:
    out = ""
    for char in stg.lower():
        out = char + out
    return out
```

```python # wrong: hard-codes the test data
def reverse_string(stg: str) -> str:
    table = {"hello": "olleh", "": "", "a": "a", "Python": "nohtyP",
             "racecar": "racecar", "ab c!": "!c ba", "a1b2": "2b1a",
             "  x  ": "  x  ", "Hello, World!": "!dlroW ,olleH"}
    return table.get(stg, stg)
```

### Give-aways the Description must never contain

```text # forbidden
\[::-1\]
\breversed\(
for\s+\w+\s+in\s+stg\b
\bout\s*=\s*char\s*\+
"c"\s*\+\s*"ab"
```

### Shortcuts the tests reject outright

```text # banned
[::-1]
reversed(
```
