---
title: "Python C14 - Squash the Runs"
---

# Squash the Runs

## Instructions

Write a function `squash(stg: str) -> str` that returns `stg` with every run of adjacent identical characters collapsed to a single copy.

## Description

### Goal

Given a string, hand back a new string where every maximal run of the same
character, side by side, is replaced by just one copy of that character.

### Rules

- Only ADJACENT repeats merge. A character that shows up again later, with
  something else in between, is not touched.
- The empty string gives back the empty string.
- `return` the string, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `squash("aaabbbca")` | `"abca"` |
| `squash("aaabbc")` | `"abc"` |
| `squash("mississippi")` | `"misisipi"` |
| `squash("a")` | `"a"` |
| `squash("")` | `""` |

### Things you will need

Building a string one piece at a time is done the same way as building a list:
start with an empty string and add to it.

```python
def build(word: str) -> str:
    """ Return word rebuilt one character at a time. """
    letters = ""
    for letter in word:
        letters = letters + letter
    return letters


print(build("cat"))          # cat
```

Comparing the last character you kept to the one you are looking at now tells
you whether you are still inside the same run:

```python
def same(char_a: str, char_b: str) -> bool:
    """ Return whether char_a and char_b are the same character. """
    return char_a == char_b


print(same("b", "b"))  # True
```

### How do you decide whether to keep a character?

You are walking the string one character at a time. For each character, is it
the same as the one you just decided to keep, or different? Only one of those
two answers means "add it to the result".

## Starter code

```python # template
def squash(stg: str) -> str:
    """ Return stg with every run of adjacent identical characters collapsed to one.

    >>> squash("aaabbbca")
    'abca'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(squash("aaabbbca"))
```

## Tests

```python # tests
import random as _random
import string as _string

assert squash("") == "", f"Got: {squash('')}"
assert squash("a") == "a", f"Got: {squash('a')}"
assert squash("aaabbbca") == "abca", f"Got: {squash('aaabbbca')}"
assert squash("aaabbc") == "abc", f"Got: {squash('aaabbc')}"
assert squash("mississippi") == "misisipi", f"Got: {squash('mississippi')}"
# No adjacent repeats at all: nothing changes
assert squash("abc") == "abc", f"Got: {squash('abc')}"
# A character reappearing later, not adjacent, must survive both times
assert squash("aabaa") == "aba", f"Got: {squash('aabaa')}"
# One long run only
assert squash("zzzzzz") == "z", f"Got: {squash('zzzzzz')}"
# A space is a character like any other
assert squash("a  b") == "a b", f"Got: {squash('a  b')}"
assert isinstance(squash("aabb"), str), f"Got: {type(squash('aabb'))}"
# Drawn at random every run, so no table of the strings above can fake it
_SAMPLE = "".join(_random.choice("ab") for _ in range(80))
_result = squash(_SAMPLE)
assert len(_result) <= len(_SAMPLE), f"Got: {_result}"
for _pos in range(1, len(_result)):
    assert _result[_pos] != _result[_pos - 1], f"Got: {_result}"
_LETTERS = "".join(_random.choice(_string.ascii_lowercase) for _ in range(60))
_result2 = squash(_LETTERS)
for _pos in range(1, len(_result2)):
    assert _result2[_pos] != _result2[_pos - 1], f"Got: {_result2}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def squash(stg: str) -> str:
    """ Return stg with every run of adjacent identical characters collapsed to one. """
    result = ""
    for char in stg:
        if result == "" or result[-1] != char:
            result = result + char
    return result
```

### Wrong answers the tests must catch

```python # wrong: compares against everything kept so far, not only the last kept character
def squash(stg: str) -> str:
    result = ""
    for char in stg:
        if char not in result:
            result = result + char
    return result
```

```python # wrong: off by one, always keeps the first character of every run twice
def squash(stg: str) -> str:
    result = ""
    prev = ""
    for char in stg:
        if char != prev:
            result = result + prev + char
        prev = char
    return result
```

```python # wrong: only ever keeps the very first character of the whole string
def squash(stg: str) -> str:
    if stg == "":
        return ""
    return stg[0]
```

```python # wrong: drops a character every time it repeats anywhere, not just adjacently
def squash(stg: str) -> str:
    result = ""
    for char in stg:
        if stg.count(char) == 1 or char not in result:
            result = result + char
    return result
```

### Give-aways the Description must never contain

```text # forbidden
result\s*=\s*""
result\[-1\]
result\s*\+=\s*char
prev\s*=\s*char
if\s+result\s*==\s*""
```

### Shortcuts the tests reject outright

```text # banned
```
