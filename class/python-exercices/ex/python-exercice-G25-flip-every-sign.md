---
title: "Python G25 - Flip Every Sign"
---

# Flip Every Sign

## Instructions

Write a function `negate_all(lst: list) -> list` that returns a new list holding every number of `lst` with its sign flipped.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

Every positive becomes negative, every negative becomes positive, and the list
keeps its length and its order. Only the signs move.

### Rules

- A negative number comes back positive. This is **not** the absolute value.
- Zero has no sign to flip, so it stays `0`.
- Build and return a **new** list; the input must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `negate_all([1, -2])` | `[-1, 2]` |
| `negate_all([3, 3, 3])` | `[-3, -3, -3]` |
| `negate_all([1, 0, -1])` | `[-1, 0, 1]` |
| `negate_all([-5])` | `[5]` |
| `negate_all([])` | `[]` |

### Things you will need

A minus sign written in front of a number flips it, whichever way it was
pointing:

```python
for value in [7, -3, 0]:
    print(-value)
```

Every element is transformed here and none is thrown away, so the answer is
always as long as the input. That is the shape of `B11`, not of `B12`.

### Which order do you need?

You are not choosing anything this time. What happens to each number on its way
into the new list?

## Starter code

```python # template
def negate_all(lst: list) -> list:
    """ Return lst with every sign flipped, e.g. [-1, 2] for [1, -2].

    >>> negate_all([1, -2])
    [-1, 2]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(negate_all([1, -2, 0, 5]))
```

## Tests

```python # tests
assert negate_all([1, -2]) == [-1, 2], f"Got: {negate_all([1, -2])}"
assert negate_all([]) == [], f"Got: {negate_all([])}"
assert negate_all([0]) == [0], f"Got: {negate_all([0])}"
# Mixed signs in one list: abs() gets the negative wrong, -abs() the positive
assert negate_all([1, 0, -1]) == [-1, 0, 1], f"Got: {negate_all([1, 0, -1])}"
assert negate_all([3, 3, 3]) == [-3, -3, -3], f"Got: {negate_all([3, 3, 3])}"
assert negate_all([-5]) == [5], f"Got: {negate_all([-5])}"
# All positive: handing the list back unchanged shows up here
assert negate_all([1, 2]) == [-1, -2], f"Got: {negate_all([1, 2])}"
# All negative, and the order is not disturbed
assert negate_all([-1, -4]) == [1, 4], f"Got: {negate_all([-1, -4])}"
_src = [1, -2]
negate_all(_src)
assert _src == [1, -2], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def negate_all(lst: list) -> list:
    """ Return lst with every sign flipped. """
    result = []
    for number in lst:
        result.append(-number)
    return result
```

### Wrong answers the tests must catch

```python # wrong: takes the absolute value, so negatives never flip
def negate_all(lst: list) -> list:
    """ Makes everything positive. """
    return [abs(number) for number in lst]
```

```python # wrong: makes everything negative
def negate_all(lst: list) -> list:
    """ Flips only the positives. """
    return [-abs(number) for number in lst]
```

```python # wrong: hands the list back untouched
def negate_all(lst: list) -> list:
    """ Changes nothing. """
    return lst
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
append\(-
\[\s*-\w+\s+for
```

### Shortcuts the tests reject outright

```text # banned
```
