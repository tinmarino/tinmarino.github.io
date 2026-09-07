---
title: "Python B19 - First Big Multiple of Seven"
---

# First Big Multiple of Seven

## Instructions

Write a function `first_big_multiple() -> int` that returns the first whole number greater than 100 that is a multiple of 7.

It takes no arguments. Return the number, do not print it.

## Description

### Goal

Walk upward from just past 100 until you meet a multiple of 7, and hand that number
back. There is exactly one right answer.

### Rules

- The number must be strictly greater than 100.
- Return the number, do not print it.

### Examples

| Call | Returns |
|---|---|
| `first_big_multiple() > 100` | `True` |
| `first_big_multiple() % 7` | `0` |

### Things you will need

A number is a multiple of 7 when dividing it by 7 leaves no remainder:

```python
print(105 % 7)
print(104 % 7)
```

Start just above 100 and step up one number at a time with a `while` loop, until
that remainder is 0.

### Which order do you need?

Where does the search start, and what is the test that tells you to stop?

## Starter code

```python # template
def first_big_multiple() -> int:
    """ Return the first number above 100 that is a multiple of 7.

    >>> first_big_multiple()
    105
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(first_big_multiple())
```

## Tests

```python # tests
_got = first_big_multiple()
assert _got == 105, f"Got: {_got}"
assert _got > 100, f"Got: {_got}"
assert _got % 7 == 0, f"Got: {_got}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def first_big_multiple() -> int:
    """ Return the first number above 100 that is a multiple of 7. """
    number = 101
    while number % 7 != 0:
        number += 1
    return number
```

### Wrong answers the tests must catch

```python # wrong: tests divisibility by 3, not 7
def first_big_multiple() -> int:
    """ Wrong divisor, stops at 102. """
    number = 101
    while number % 3 != 0:
        number += 1
    return number
```

```python # wrong: searches downward, ends below 100
def first_big_multiple() -> int:
    """ Steps the wrong way, lands on 98. """
    number = 100
    while number % 7 != 0:
        number -= 1
    return number
```

### Give-aways the Description must never contain

```text # forbidden
%\s*7\s*!=
number\s*=\s*101
```

### Shortcuts the tests reject outright

```text # banned
```
