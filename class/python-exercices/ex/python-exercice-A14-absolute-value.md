---
title: "Python A14 - Absolute Value"
---

# Absolute Value

## Instructions

Write a function `absolute(num: int) -> int` that returns the distance of `num` from zero. Do **not** use `abs()`.

Return the number, do not print it.

## Description

### Goal

Hand back how far a number is from zero, which is never negative. `5` stays `5`,
and `-5` also becomes `5`.

### Rules

- Do **not** use `abs()`. Deciding when to flip the sign is the whole exercise.
- Return the value, do not print it.

### Examples

| Call | Returns |
|---|---|
| `absolute(5)` | `5` |
| `absolute(-5)` | `5` |
| `absolute(0)` | `0` |
| `absolute(-100)` | `100` |

### Things you will need

A test for whether a number is below zero:

```python
for number in [6, -6, 0]:
    print(number < 0)
```

Writing `-number` flips a number's sign, so `-(-6)` is `6`. An `if` decides when
that flip is needed.

### Which order do you need?

Which numbers need their sign flipped, and which are already the answer?

## Starter code

```python # template
def absolute(num: int) -> int:
    """ Return the distance of `num` from zero, e.g. 5 for -5.

    >>> absolute(-5)
    5
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(absolute(-5))
```

## Tests

```python # tests
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("abs(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert absolute(5) == 5, f"Got: {absolute(5)}"
assert absolute(-5) == 5, f"Got: {absolute(-5)}"
assert absolute(0) == 0, f"Got: {absolute(0)}"
assert absolute(-100) == 100, f"Got: {absolute(-100)}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def absolute(num: int) -> int:
    """ Return the distance of `num` from zero, e.g. 5 for -5. """
    if num < 0:
        return -num
    return num
```

### Wrong answers the tests must catch

```python # wrong: uses the built-in abs
def absolute(num: int) -> int:
    """ Hand the work to abs. """
    return abs(num)
```

```python # wrong: never flips the sign
def absolute(num: int) -> int:
    """ Return the number untouched. """
    return num
```

### Give-aways the Description must never contain

```text # forbidden
abs\(
num\s+if\s+num
```

### Shortcuts the tests reject outright

```text # banned
abs(
```
