---
title: "Python B11 - Double Every Number"
---

# Double Every Number

## Instructions

Write a function `double_all(lst: list) -> list` that returns a new list with every number of `lst` doubled.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

Take a list of numbers and hand back a new list of the same length, where each
number is twice what it was.

### Rules

- Build and return a **new** list. The list you were given must come back unchanged.
- Return it, do not print it.

### Examples

| Call | Returns |
|---|---|
| `double_all([1, 2, 3])` | `[2, 4, 6]` |
| `double_all([-1, 5])` | `[-2, 10]` |
| `double_all([0])` | `[0]` |
| `double_all([])` | `[]` |

### Things you will need

A list can be built from another list, one item at a time:

```python
print([letter.upper() for letter in "abc"])
```

Doubling a single number is just arithmetic:

```python
print(6 * 2)
```

### Which order do you need?

Do you change the numbers where they sit, or collect new numbers into a fresh list?
Only one of those keeps the caller's list intact.

## Starter code

```python # template
def double_all(lst: list) -> list:
    """ Return a new list with every number of lst doubled, e.g. [2, 4] for [1, 2].

    >>> double_all([1, 2, 3])
    [2, 4, 6]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(double_all([1, 2, 3]))
```

## Tests

```python # tests
assert double_all([1, 2, 3]) == [2, 4, 6], f"Got: {double_all([1, 2, 3])}"
assert double_all([-1, 5]) == [-2, 10], f"Got: {double_all([-1, 5])}"
assert double_all([0]) == [0], f"Got: {double_all([0])}"
assert double_all([]) == [], f"Got: {double_all([])}"
assert double_all([7, 7]) == [14, 14], f"Got: {double_all([7, 7])}"
_src = [1, 2, 3]
double_all(_src)
assert _src == [1, 2, 3], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def double_all(lst: list) -> list:
    """ Return a new list with every number of lst doubled, e.g. [2, 4] for [1, 2]. """
    return [number * 2 for number in lst]
```

### Wrong answers the tests must catch

```python # wrong: adds two instead of doubling
def double_all(lst: list) -> list:
    """ Off by the operation. """
    return [number + 2 for number in lst]
```

```python # wrong: doubles in place, wrecking the caller's list
def double_all(lst: list) -> list:
    """ Mutates the argument. """
    for index in range(len(lst)):
        lst[index] = lst[index] * 2
    return lst
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst
lst\[
```

### Shortcuts the tests reject outright

```text # banned
```
