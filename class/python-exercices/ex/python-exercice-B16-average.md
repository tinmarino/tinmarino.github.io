---
title: "Python B16 - Average of a List"
---

# Average of a List

## Instructions

Write a function `average(lst: list) -> float` that returns the mean of the numbers in `lst`, or `0.0` when the list is empty. Do **not** use `sum()`.

Return the number, do not print it.

## Description

### Goal

Add up the numbers and divide by how many there are. `[2, 4]` averages to `3.0`.

### Rules

- Do **not** use `sum()`. Add the numbers up yourself with a running total.
- An empty list has no numbers to average, so return `0.0` rather than crashing.
- The answer is a float: `[2, 4]` gives `3.0`, not `3`.

### Examples

| Call | Returns |
|---|---|
| `average([2, 4])` | `3.0` |
| `average([1, 2, 3, 4])` | `2.5` |
| `average([1, 2, 6])` | `3.0` |
| `average([5])` | `5.0` |
| `average([])` | `0.0` |

### Things you will need

Adding a list up is a running total that starts at zero:

```python
def add_up(numbers: list) -> int:
    """ Add every number in the list. """
    total = 0
    for number in numbers:
        total += number
    return total


print(add_up([2, 4, 6]))
```

`len(lst)` tells you how many numbers there are, and `/` divides.

### Which order do you need?

What has to be true before you divide, so an empty list never divides by zero?

## Starter code

```python # template
def average(lst: list) -> float:
    """ Return the mean of lst as a float, e.g. 3.0 for [2, 4] and 0.0 for [].

    >>> average([2, 4])
    3.0
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(average([1, 2, 3, 4]))
```

## Tests

```python # tests
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("sum(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert average([2, 4]) == 3.0, f"Got: {average([2, 4])}"
assert average([1, 2, 3, 4]) == 2.5, f"Got: {average([1, 2, 3, 4])}"
assert average([5]) == 5.0, f"Got: {average([5])}"
assert average([1, 2, 6]) == 3.0, f"Got: {average([1, 2, 6])}"
assert average([10, 1, 1]) == 4.0, f"Got: {average([10, 1, 1])}"
assert average([0, 0, 0, 8]) == 2.0, f"Got: {average([0, 0, 0, 8])}"
assert average([]) == 0.0, f"Got: {average([])}"
assert average([-2, 2]) == 0.0, f"Got: {average([-2, 2])}"
assert average([1, 2]) == 1.5, f"Got: {average([1, 2])}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def average(lst: list) -> float:
    """ Return the mean of lst as a float, e.g. 3.0 for [2, 4] and 0.0 for []. """
    if not lst:
        return 0.0
    total = 0
    for number in lst:
        total += number
    return total / len(lst)
```

### Wrong answers the tests must catch

```python # wrong: uses sum, the shortcut
def average(lst: list) -> float:
    """ Hands the adding to sum. """
    if not lst:
        return 0.0
    return sum(lst) / len(lst)
```

```python # wrong: averages only the ends, not every number
def average(lst: list) -> float:
    """ Midpoint of first and last, which is not the mean. """
    if not lst:
        return 0.0
    return (lst[0] + lst[-1]) / 2
```

```python # wrong: integer division drops the fraction
def average(lst: list) -> float:
    """ Uses // so 1.5 becomes 1. """
    if not lst:
        return 0.0
    total = 0
    for number in lst:
        total += number
    return total // len(lst)
```

### Give-aways the Description must never contain

```text # forbidden
sum\(
total\s*/\s*len
```

### Shortcuts the tests reject outright

```text # banned
sum(
```
