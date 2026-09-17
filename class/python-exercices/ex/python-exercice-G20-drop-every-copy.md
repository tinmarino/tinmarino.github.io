---
title: "Python G20 - Drop Every Copy of a Value"
---

# Drop Every Copy of a Value

## Instructions

Write a function `remove_all(lst: list, dummy: int) -> list` that returns a new list holding every element of `lst` except the copies of `dummy`.

Build it yourself: `.remove(` takes out one single copy and it edits the list you were handed, so **Check** turns it down.

## Description

### Goal

One value has to go, and every copy of it goes with it. Everything else stays
exactly where it was.

### Rules

- **Every** copy disappears, not just the first one.
- Do **not** use `.remove(` &mdash; it deletes one copy and it damages the
  caller's list.
- Keep the survivors in the order they appeared.
- Build and return a **new** list; the input must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `remove_all([1, 7, 7, 2], 7)` | `[1, 2]` |
| `remove_all([7, 7], 7)` | `[]` |
| `remove_all([1, 2], 7)` | `[1, 2]` |
| `remove_all([0, 1, 0], 0)` | `[1]` |
| `remove_all([], 7)` | `[]` |

### Things you will need

`!=` is the opposite of `==`: it is `True` when the two sides differ.

```python
for letter in ["a", "b", "a"]:
    print(letter != "a")
```

Collecting the chosen ones into a new list is what you did in `B12` and `G10`.

### Which order do you need?

You are keeping things, not deleting them. Which elements deserve a place in
the new list?

## Starter code

```python # template
def remove_all(lst: list, dummy: int) -> list:
    """ Return lst without any copy of dummy, e.g. [1, 2] for ([1, 7, 7, 2], 7).

    >>> remove_all([1, 7, 7, 2], 7)
    [1, 2]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(remove_all([1, 7, 7, 2], 7))
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
         for _b in (".remove(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert remove_all([1, 7, 7, 2], 7) == [1, 2], f"Got: {remove_all([1, 7, 7, 2], 7)}"
assert remove_all([7, 7], 7) == [], f"Got: {remove_all([7, 7], 7)}"
assert remove_all([1, 2], 7) == [1, 2], f"Got: {remove_all([1, 2], 7)}"
assert remove_all([], 7) == [], f"Got: {remove_all([], 7)}"
# Copies at both ends and in the middle: stopping after the first leaves some
assert remove_all([7, 1, 7, 2, 7], 7) == [1, 2], f"Got: {remove_all([7, 1, 7, 2, 7], 7)}"
# Zero is a real value to drop, not "nothing to do"
assert remove_all([0, 1, 0], 0) == [1], f"Got: {remove_all([0, 1, 0], 0)}"
assert remove_all([0, 1, 0], 1) == [0, 0], f"Got: {remove_all([0, 1, 0], 1)}"
_src = [1, 7, 7, 2]
remove_all(_src, 7)
assert _src == [1, 7, 7, 2], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def remove_all(lst: list, dummy: int) -> list:
    """ Return lst without any copy of dummy. """
    result = []
    for item in lst:
        if item != dummy:
            result.append(item)
    return result
```

### Wrong answers the tests must catch

```python # wrong: calls .remove(, which takes one copy and wrecks the caller's list
def remove_all(lst: list, dummy: int) -> list:
    """ Uses the banned shortcut. """
    lst.remove(dummy)
    return lst
```

```python # wrong: stops after the first copy
def remove_all(lst: list, dummy: int) -> list:
    """ Drops one copy and keeps the others. """
    result = []
    dropped = False
    for item in lst:
        if item == dummy and not dropped:
            dropped = True
        else:
            result.append(item)
    return result
```

```python # wrong: keeps the copies and drops everything else
def remove_all(lst: list, dummy: int) -> list:
    """ Compares the wrong way round. """
    return [item for item in lst if item == dummy]
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
!=\s*dummy
```

### Shortcuts the tests reject outright

```text # banned
.remove(
```
