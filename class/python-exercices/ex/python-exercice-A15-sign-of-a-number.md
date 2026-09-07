---
title: "Python A15 - Sign of a Number"
---

# Sign of a Number

## Instructions

Write a function `sign(number: int) -> int` that returns `1` when `number` is positive, `-1` when it is negative, and `0` when it is zero.

Return the number, do not print it.

## Description

### Goal

Boil a number down to just its direction: above zero, below zero, or exactly zero.
There are only three possible answers.

### Rules

- Return one of three values, do not print anything.
- Zero is its own case. Do not let it fall through to a positive or negative answer.

### Examples

| Call | Returns |
|---|---|
| `sign(7)` | `1` |
| `sign(-3)` | `-1` |
| `sign(0)` | `0` |
| `sign(50)` | `1` |

### Things you will need

Two separate questions about a number, each a comparison:

```python
for number in [7, -3, 0]:
    print(number > 0)
```

More than one `if` lets you answer more than one question.

### Which order do you need?

You have three cases and three answers. Which case has nothing left to test once
the other two are ruled out?

## Starter code

```python # template
def sign(number: int) -> int:
    """ Return 1, -1 or 0 for the sign of `number`, e.g. -1 for -3.

    >>> sign(-3)
    -1
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(sign(-3))
```

## Tests

```python # tests
assert sign(7) == 1, f"Got: {sign(7)}"
assert sign(-3) == -1, f"Got: {sign(-3)}"
assert sign(0) == 0, f"Got: {sign(0)}"
assert sign(50) == 1, f"Got: {sign(50)}"
assert sign(-100) == -1, f"Got: {sign(-100)}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def sign(number: int) -> int:
    """ Return 1, -1 or 0 for the sign of `number`, e.g. -1 for -3. """
    if number > 0:
        return 1
    if number < 0:
        return -1
    return 0
```

### Wrong answers the tests must catch

```python # wrong: forgets the zero case
def sign(number: int) -> int:
    """ Only tells positive from negative. """
    if number < 0:
        return -1
    return 1
```

```python # wrong: returns the number itself
def sign(number: int) -> int:
    """ Hands back the number, not its sign. """
    return number
```

### Give-aways the Description must never contain

```text # forbidden
return\s+1\b
return\s+-1\b
```

### Shortcuts the tests reject outright

```text # banned
```
