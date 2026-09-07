---
title: "Python A13 - Larger of Two Numbers"
---

# Larger of Two Numbers

## Instructions

Write a function `larger(left: int, right: int) -> int:` that returns the bigger of the two numbers. Do **not** use `max()`.

Return the number, do not print it.

## Description

### Goal

Look at two numbers and hand back whichever one is bigger. When they are equal,
either is the answer, so hand back that value.

### Rules

- Do **not** use `max()`. The point is to make the comparison yourself.
- Return the value, do not print it.

### Examples

| Call | Returns |
|---|---|
| `larger(3, 9)` | `9` |
| `larger(9, 3)` | `9` |
| `larger(5, 5)` | `5` |
| `larger(-2, -8)` | `-2` |

### Things you will need

A comparison between two numbers gives back a `True` or a `False`:

```python
for number in [4, -2, 9]:
    print(number > 0)
```

An `if` then chooses which value to hand back. You returned early from a choice
in `B30`.

### Which order do you need?

If the first number is the bigger one, which do you return? And if it is not?

## Starter code

```python # template
def larger(left: int, right: int) -> int:
    """ Return the bigger of two numbers, e.g. 9 for (3, 9).

    >>> larger(3, 9)
    9
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(larger(3, 9))
```

## Tests

```python # tests
# Refuse the shortcuts that skip the lesson. This is the ONE canonical guard,
# used identically in every exercise that bans anything: strip docstrings and
# comments off the student's own source (injected by the app and the verifier as
# __student_code__) so a note to yourself is never mistaken for the real thing,
# then match each banned construct whitespace-insensitively and on a word
# boundary.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("max(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert larger(3, 9) == 9, f"Got: {larger(3, 9)}"
assert larger(9, 3) == 9, f"Got: {larger(9, 3)}"
assert larger(5, 5) == 5, f"Got: {larger(5, 5)}"
assert larger(-2, -8) == -2, f"Got: {larger(-2, -8)}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def larger(left: int, right: int) -> int:
    """ Return the bigger of two numbers, e.g. 9 for (3, 9). """
    if left > right:
        return left
    return right
```

### Wrong answers the tests must catch

```python # wrong: uses the built-in max
def larger(left: int, right: int) -> int:
    """ Hand the work to max. """
    return max(left, right)
```

```python # wrong: returns the smaller one
def larger(left: int, right: int) -> int:
    """ Return the smaller number by mistake. """
    if left > right:
        return right
    return left
```

### Give-aways the Description must never contain

```text # forbidden
max\(
if\s+left\s*>\s*right
```

### Shortcuts the tests reject outright

```text # banned
max(
```
