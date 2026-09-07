---
title: "Python A12 - Difference of Two Numbers"
---

# Difference of Two Numbers

## Instructions

Write a function `sub(left: int, right: int) -> int` that returns `left` with `right` taken away.

Return the number, do not print it.

## Description

### Goal

Hand back a single number: the first argument with the second subtracted from it.

### Rules

- Give the answer back with `return`. A function that prints puts the number on
  the screen but hands back `None`, and every test here reads the returned value.
- The order is not symmetric: taking 4 from 10 is not the same as taking 10 from 4.

### Examples

| Call | Returns |
|---|---|
| `sub(10, 4)` | `6` |
| `sub(4, 10)` | `-6` |
| `sub(5, 5)` | `0` |
| `sub(0, 7)` | `-7` |

### Things you will need

Arithmetic on two names and a `return`. You have returned a value since `A10`.

```python
print(20 - 8)
```

### Which order do you need?

Which argument is taken away from which? Read the examples until the order is not
a guess.

## Starter code

```python # template
def sub(left: int, right: int) -> int:
    """ Return `left` with `right` taken away, e.g. 6 for (10, 4).

    >>> sub(10, 4)
    6
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(sub(10, 4))
```

## Tests

```python # tests
assert sub(10, 4) == 6, f"Got: {sub(10, 4)}"
assert sub(4, 10) == -6, f"Got: {sub(4, 10)}"
assert sub(5, 5) == 0, f"Got: {sub(5, 5)}"
assert sub(0, 7) == -7, f"Got: {sub(0, 7)}"
assert sub(-3, -8) == 5, f"Got: {sub(-3, -8)}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def sub(left: int, right: int) -> int:
    """ Return `left` with `right` taken away, e.g. 6 for (10, 4). """
    return left - right
```

### Wrong answers the tests must catch

```python # wrong: adds instead of subtracting
def sub(left: int, right: int) -> int:
    """ Add the two numbers. """
    return left + right
```

```python # wrong: subtracts in the wrong order
def sub(left: int, right: int) -> int:
    """ Take left away from right. """
    return right - left
```

### Give-aways the Description must never contain

```text # forbidden
left\s*-\s*right
```

### Shortcuts the tests reject outright

```text # banned
```
