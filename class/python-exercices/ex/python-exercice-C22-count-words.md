---
title: "Python C22 - Count the Words"
---

# Count the Words

## Instructions

Write a function `word_count(stg: str) -> int` that returns how many words `stg` holds, a word being a maximal run of non-space characters, so `.split(` is off the table for this one.

## Description

### Goal

Given a string, return how many words it contains. A word is a run of characters with no space in it; several spaces in a row, and any leading or trailing spaces, count for nothing.

### Rules

- A word never contains a space.
- Several spaces in a row are still just one gap between words, not several.
- Leading and trailing spaces do not create empty words at the ends.
- A string of only spaces, or an empty string, holds zero words.
- Count them yourself. Do **not** use `.split(`: it hands you the list of words already cut out, which is this exercise already done.
- `return` the count, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `word_count("the quick fox")` | `3` |
| `word_count("  a   b  ")` | `2` |
| `word_count("   ")` | `0` |
| `word_count("")` | `0` |
| `word_count("alone")` | `1` |

### Things you will need

Walking a string one character at a time gives you each character in turn, and you can look at the one before it too, by keeping it in a variable as you go:

```python
def show_pairs(stg: str) -> None:
    """ Print each character of stg next to the one before it. """
    previous = None
    for letter in stg:
        print(previous, "->", letter)
        previous = letter


show_pairs("abc")
```

Comparing a character to `" "` tells you whether that one position is a space:

```python
for letter in "a b":
    print(letter == " ")
```

### Which moment counts?

A word does not announce itself all at once; it starts somewhere. Walking the string left to right, a new word begins exactly at one kind of moment: a non-space character with a space (or nothing at all) just before it. Everything else &mdash; a space, or a non-space that follows another non-space &mdash; is not the start of anything. If you can say, for each position, whether it is that starting moment, you can count words without ever cutting the string apart.

## Starter code

```python # template
def word_count(stg: str) -> int:
    """ Return how many words stg holds, a word being a run of non-space characters.

    >>> word_count("the quick fox")
    3
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(word_count("the quick fox"))
```

## Tests

```python # tests
# Refuse the shortcuts that skip the lesson. __student_code__ is the student's own
# source, injected by the app and the verifier; strip its docstrings and comments
# so a note to yourself is never mistaken for the real thing, then match each
# construct whitespace-insensitively and on a word boundary, so a stray space
# cannot slip a banned call past the ban that names it.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in (".split(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert word_count("") == 0, f"Got: {word_count('')}"
assert word_count("   ") == 0, f"Got: {word_count('   ')}"
assert word_count("alone") == 1, f"Got: {word_count('alone')}"
assert word_count("the quick fox") == 3, f"Got: {word_count('the quick fox')}"
# Several spaces in a row are still one gap
assert word_count("  a   b  ") == 2, f"Got: {word_count('  a   b  ')}"
# Leading and trailing spaces do not create empty words at the ends
assert word_count(" hello ") == 1, f"Got: {word_count(' hello ')}"
assert word_count("a b c d") == 4, f"Got: {word_count('a b c d')}"
# One single space between words, and one at each end
assert word_count(" one two three ") == 3, f"Got: {word_count(' one two three ')}"
# A single space is still zero words, not one
assert word_count(" ") == 0, f"Got: {word_count(' ')}"
assert word_count("a") == 1, f"Got: {word_count('a')}"
assert isinstance(word_count("the quick fox"), int), f"Got: {type(word_count('the quick fox'))}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def word_count(stg: str) -> int:
    """ Return how many words stg holds, a word being a run of non-space characters. """
    count = 0
    previous_was_space = True
    for char in stg:
        if char != " " and previous_was_space:
            count += 1
        previous_was_space = char == " "
    return count
```

### Wrong answers the tests must catch

```python # wrong: counts every space instead of every gap, over-counting runs
def word_count(stg: str) -> int:
    count = 0
    previous_was_space = True
    for char in stg:
        if char == " " and not previous_was_space:
            count += 1
        previous_was_space = char == " "
    return count + (1 if stg.strip() else 0)
```

```python # wrong: counts non-space characters instead of runs of them
def word_count(stg: str) -> int:
    count = 0
    for char in stg:
        if char != " ":
            count += 1
    return count
```

```python # wrong: starts as if already inside a word, missing a leading word
def word_count(stg: str) -> int:
    count = 0
    previous_was_space = False
    for char in stg:
        if char != " " and previous_was_space:
            count += 1
        previous_was_space = char == " "
    return count
```

```python # wrong: counts the gaps between words instead of the words themselves
def word_count(stg: str) -> int:
    count = 0
    previous_was_space = True
    for char in stg:
        if char == " " and not previous_was_space:
            count += 1
        previous_was_space = char == " "
    return count
```

```python # wrong: hands the whole job to str.split, the shortcut this exercise bans
def word_count(stg: str) -> int:
    return len(stg.split(" "))
```

### Give-aways the Description must never contain

```text # forbidden
previous_was_space
char\s*!=\s*"\s*"\s*and\s*previous
\.split\(
count\s*\+=\s*1
```

### Shortcuts the tests reject outright

```text # banned
.split(
```
