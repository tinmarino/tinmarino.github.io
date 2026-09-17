---
title: "Python G15 - Between Two Bounds"
---

# Between Two Bounds

## Instructions

Write a function `between(lst: list, low: int, high: int) -> list` that returns a new list holding only the numbers of `lst` that fall from `low` to `high`, both ends included.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

`G10` cut a list at one place. Now there are two: keep the numbers caught
between the two bounds, and drop everything outside.

### Rules

- Both ends **belong**: a number equal to `low`, or equal to `high`, is kept.
- Keep the survivors in the order they appeared.
- If the bounds cross over, nothing can satisfy both, and the answer is `[]`.
- Build and return a **new** list; the input must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `between([1, 5, 9], 2, 8)` | `[5]` |
| `between([2, 8], 2, 8)` | `[2, 8]` |
| `between([1, 9], 2, 8)` | `[]` |
| `between([0, -5, -1], -5, -1)` | `[-5, -1]` |
| `between([4], 5, 3)` | `[]` |

### Things you will need

Two conditions can be demanded at once with `and`, which is `True` only when
both sides are:

```python
for word in ["sol", "mar", "luz"]:
    print(len(word) == 3 and word != "mar")
```

### Which order do you need?

A number is inside when it clears the bottom **and** does not pass the top.
Which of the two bounds does each comparison belong to?

## Starter code

```python # template
def between(lst: list, low: int, high: int) -> list:
    """ Return the numbers of lst from low to high, e.g. [5] for ([1, 5, 9], 2, 8).

    >>> between([1, 5, 9], 2, 8)
    [5]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(between([1, 5, 9, 3], 2, 8))
```

## Tests

```python # tests
assert between([1, 5, 9], 2, 8) == [5], f"Got: {between([1, 5, 9], 2, 8)}"
# Both bounds belong: a strict test on either side drops one of them
assert between([2, 8], 2, 8) == [2, 8], f"Got: {between([2, 8], 2, 8)}"
assert between([1, 9], 2, 8) == [], f"Got: {between([1, 9], 2, 8)}"
assert between([], 2, 8) == [], f"Got: {between([], 2, 8)}"
# Survivors are not adjacent, and their order is kept
assert between([5, 3, 7, 1], 3, 5) == [5, 3], f"Got: {between([5, 3, 7, 1], 3, 5)}"
# Negative bounds, both of them landing exactly on a value
assert between([0, -5, -1], -5, -1) == [-5, -1], f"Got: {between([0, -5, -1], -5, -1)}"
# Bounds that cross: nothing can be above 5 and below 3 at once
assert between([4], 5, 3) == [], f"Got: {between([4], 5, 3)}"
# Checking only one of the two bounds shows up here
assert between([1, 5, 9], 2, 8) != [5, 9], f"Got: {between([1, 5, 9], 2, 8)}"
_src = [1, 5, 9]
between(_src, 2, 8)
assert _src == [1, 5, 9], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def between(lst: list, low: int, high: int) -> list:
    """ Return the numbers of lst from low to high, both ends included. """
    result = []
    for number in lst:
        if low <= number <= high:
            result.append(number)
    return result
```

### Wrong answers the tests must catch

```python # wrong: strict on both ends, so the bounds themselves are dropped
def between(lst: list, low: int, high: int) -> list:
    """ Excludes the two ends. """
    return [number for number in lst if low < number < high]
```

```python # wrong: only checks the lower bound
def between(lst: list, low: int, high: int) -> list:
    """ Forgets the top. """
    return [number for number in lst if number >= low]
```

```python # wrong: only checks the upper bound
def between(lst: list, low: int, high: int) -> list:
    """ Forgets the bottom. """
    return [number for number in lst if number <= high]
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
low\s*<=\s*\w+\s*<=\s*high
```

### Shortcuts the tests reject outright

```text # banned
```
