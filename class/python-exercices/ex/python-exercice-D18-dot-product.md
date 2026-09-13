---
title: "Python D18 - Dot Product"
---

# Dot Product

## Instructions

Write a function `dot(first: list, second: list) -> int` that returns the sum of the products of matching positions in two same-length lists of numbers.

Two empty lists give `0`.

## Description

### Goal

You have two lists of the same length. Multiply the first element of `first` by the
first element of `second`, multiply the second by the second, and so on, then add
every one of those products together. That single number is the dot product.

### Rules

- `first` and `second` always have the same length.
- Return the sum, do not print it.
- Two empty lists give `0`, the sum of nothing.

### Examples

| Call | Returns |
|---|---|
| `dot([1, 2, 3], [4, 5, 6])` | `32` |
| `dot([2], [3])` | `6` |
| `dot([], [])` | `0` |
| `dot([1, 0, -1], [5, 5, 5])` | `0` |

### Things you will need

One index can read the same position out of two different lists, one after the other:

```python
letters = ["a", "b", "c"]
numbers = [10, 20, 30]
for pos, letter in enumerate(letters):
    print(letter, numbers[pos])
```

You also need somewhere to keep a running total while you go:

```python
def add_them_up(values: list) -> int:
    """ Return the sum of every value in values. """
    running = 0
    for value in values:
        running = running + value
    return running
```

### What does position `pos` need from each list?

You are walking one position at a time. At position `pos`, which two values does that
position give you, and what do you do with them before moving the total forward?

## Starter code

```python # template
def dot(first: list, second: list) -> int:
    """ Return the sum of first[i] * second[i] over matching positions.

    >>> dot([1, 2, 3], [4, 5, 6])
    32
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(dot([1, 2, 3], [4, 5, 6]))
```

## Tests

```python # tests
assert dot([], []) == 0, f"Got: {dot([], [])}"
assert dot([2], [3]) == 6, f"Got: {dot([2], [3])}"
assert dot([1, 2, 3], [4, 5, 6]) == 32, f"Got: {dot([1, 2, 3], [4, 5, 6])}"
assert dot([1, 0, -1], [5, 5, 5]) == 0, f"Got: {dot([1, 0, -1], [5, 5, 5])}"
assert dot([0, 0, 0], [9, 9, 9]) == 0, f"Got: {dot([0, 0, 0], [9, 9, 9])}"
assert dot([-1, -2], [3, 4]) == -11, f"Got: {dot([-1, -2], [3, 4])}"
assert dot([1, 1, 1, 1], [1, 2, 3, 4]) == 10, \
    f"Got: {dot([1, 1, 1, 1], [1, 2, 3, 4])}"
_first, _second = [1, 2, 3], [4, 5, 6]
assert dot(_first, _second) == 32, f"Got: {dot(_first, _second)}"
assert _first == [1, 2, 3] and _second == [4, 5, 6], \
    f"Got: the inputs were modified into {_first} and {_second}"
_left = list(range(1, 21))
_right = [1] * 20
assert dot(_left, _right) == sum(_left), f"Got: {dot(_left, _right)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def dot(first: list, second: list) -> int:
    """ Return the sum of first[i] * second[i] over matching positions. """
    total = 0
    for pos, value in enumerate(first):
        total = total + value * second[pos]
    return total
```

### Wrong answers the tests must catch

```python # wrong: adds the two lists element-wise instead of multiplying them
def dot(first: list, second: list) -> int:
    total = 0
    for pos in range(len(first)):
        total = total + first[pos] + second[pos]
    return total
```

```python # wrong: multiplies every pair of positions instead of only matching ones
def dot(first: list, second: list) -> int:
    total = 0
    for pos in range(len(first)):
        for other in range(len(second)):
            total = total + first[pos] * second[other]
    return total
```

```python # wrong: returns the last product instead of the running total
def dot(first: list, second: list) -> int:
    result = 0
    for pos in range(len(first)):
        result = first[pos] * second[pos]
    return result
```

```python # wrong: pairs each element with itself, ignoring the second list
def dot(first: list, second: list) -> int:
    total = 0
    for pos in range(len(first)):
        total = total + first[pos] * first[pos]
    return total
```

### Give-aways the Description must never contain

```text # forbidden
first\[pos\]\s*\*\s*second\[pos\]
value\s*\*\s*second\[pos\]
zip\(
sum\(
```

### Shortcuts the tests reject outright

```text # banned
```
