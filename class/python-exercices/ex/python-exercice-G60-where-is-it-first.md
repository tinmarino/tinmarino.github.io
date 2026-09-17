---
title: "Python G60 - Where Is It First"
---

# Where Is It First

## Instructions

Write a function `first_index(lst: list, dummy: int) -> int` that returns the position of the first `dummy` in `lst`, or `-1` when it is not there.

Find it yourself with a loop. Do **not** use `.index(`.

## Description

### Goal

In `A18` you answered *is it in the list?* with `True` or `False`. That is often not
enough: once you know the number is there, the next thing anybody asks is **where**.

Hand back the position of the first one, counting from `0`.

### Rules

- Return the position, not the number itself.
- Positions start at `0`, so the first element sits at `0`.
- If the value appears more than once, report the **first** one.
- If the value is not in the list at all, return `-1`.
- Find it yourself with a loop. Do **not** use `.index(`.

### Examples

| Call | Returns |
|---|---|
| `first_index([5, 7, 5], 5)` | `0` |
| `first_index([5, 7, 5], 7)` | `1` |
| `first_index([1, 2, 3], 3)` | `2` |
| `first_index([1, 2, 3], 9)` | `-1` |
| `first_index([], 5)` | `-1` |

### Things you will need

Every loop you have written so far hands you the *element* and says nothing about
where it came from. A position is something you have to count for yourself, and
counting is the very first thing you learned to do in a loop:

```python
def count_up(word: str) -> int:
    """ Return how many letters word has, counted one at a time. """
    seen = 0
    for _ in word:
        seen += 1
    return seen


print(count_up("abc"))
```

That counter is worth `0` before the first letter, `1` after it, `2` after the
second. Which of those three numbers is the *position* of the letter you are
looking at right now?

### Two ways to leave a loop

This is the first exercise where you are finished **before** the list is. Once you
have seen the value, nothing later can change the answer.

So there are two shapes that both work, and it is worth knowing you are choosing
between them. One walks the whole list every time and is careful never to overwrite
an answer it already has. The other stops the moment it is sure, which is what
`return` inside a loop does.

And then there is the case where the loop simply ends: you looked at everything and
never saw it. What do you hand back *after* the loop, and how is that different from
what you hand back inside it?

## Starter code

```python # template
def first_index(lst: list, dummy: int) -> int:
    """ Return the position of the first dummy in lst, or -1 when it is absent.

    >>> first_index([5, 7, 5], 5)
    0
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(first_index([4, 8, 15, 16, 23, 42], 16))
```

## Tests

```python # tests
# The point of this one is the loop you write, so Check refuses the shortcut.
# __student_code__ is the student's own source, injected by the app and the
# verifier. Strip docstrings and comments so a note to yourself is never mistaken
# for the real thing, then match each construct whitespace-insensitively (and on a
# word boundary) so a stray space cannot slip a banned call past the ban.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in (".index(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

# Absent, and the list is empty: there is no position to report
assert first_index([], 5) == -1, f"Got: {first_index([], 5)}"
# Absent from a list that does have contents
assert first_index([1, 2, 3], 9) == -1, f"Got: {first_index([1, 2, 3], 9)}"
# The value appears TWICE: a loop that keeps overwriting reports the last one, 2
assert first_index([5, 7, 5], 5) == 0, f"Got: {first_index([5, 7, 5], 5)}"
assert first_index([7, 5, 7], 7) == 0, f"Got: {first_index([7, 5, 7], 7)}"
# Every element is the value: the answer is still the first position
assert first_index([7, 7, 7], 7) == 0, f"Got: {first_index([7, 7, 7], 7)}"
# In the middle, so returning 0 or the last position both fail
assert first_index([5, 7, 5], 7) == 1, f"Got: {first_index([5, 7, 5], 7)}"
# At the very end, so a loop that stops one turn early misses it
assert first_index([1, 2, 3], 3) == 2, f"Got: {first_index([1, 2, 3], 3)}"
# A single element, present and absent
assert first_index([9], 9) == 0, f"Got: {first_index([9], 9)}"
assert first_index([9], 4) == -1, f"Got: {first_index([9], 4)}"
# Zero is a real value to look for, and 0 is a real position to report
assert first_index([0, 1, 2], 0) == 0, f"Got: {first_index([0, 1, 2], 0)}"
assert first_index([1, 0, 2], 0) == 1, f"Got: {first_index([1, 0, 2], 0)}"
# Negative values are ordinary values
assert first_index([-3, -8, -3], -8) == 1, f"Got: {first_index([-3, -8, -3], -8)}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [(_step * 13) % 29 for _step in range(29)]
assert first_index(_generated, 26) == 2, f"Got: {first_index(_generated, 26)}"
# The caller's list must come back untouched
_original = [5, 7, 5]
first_index(_original, 5)
assert _original == [5, 7, 5], f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def first_index(lst: list, dummy: int) -> int:
    """ Return the position of the first dummy in lst, or -1 when it is absent. """
    pos = 0
    for value in lst:
        if value == dummy:
            return pos
        pos += 1
    return -1
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: hands the searching to list.index()
def first_index(lst: list, dummy: int) -> int:
    if dummy not in lst:
        return -1
    return lst.index(dummy)
```

```python # wrong: keeps looking and reports the LAST match instead of the first
def first_index(lst: list, dummy: int) -> int:
    found = -1
    pos = 0
    for value in lst:
        if value == dummy:
            found = pos
        pos += 1
    return found
```

```python # wrong: counts from one, so every position is off by one
def first_index(lst: list, dummy: int) -> int:
    pos = 1
    for value in lst:
        if value == dummy:
            return pos
        pos += 1
    return -1
```

```python # wrong: returns the value it found instead of its position
def first_index(lst: list, dummy: int) -> int:
    for value in lst:
        if value == dummy:
            return value
    return -1
```

```python # wrong: forgets the absent case and reports the length instead
def first_index(lst: list, dummy: int) -> int:
    pos = 0
    for value in lst:
        if value == dummy:
            return pos
        pos += 1
    return pos
```

### Give-aways the Description must never contain

```text # forbidden
\.index\(
for\s+\w+\s+in\s+lst
==\s*dummy
\bpos\s*\+=
enumerate\(
```

### Shortcuts the tests reject outright

```text # banned
.index(
```
