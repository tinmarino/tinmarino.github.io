---
title: "Python G35 - Square the Positives"
---

# Square the Positives

## Instructions

Write a function `square_positive(lst: list) -> list` that returns a new list holding the square of every number of `lst` that is greater than zero.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

Two jobs at once, and this is the first exercise that asks for both: choose
which numbers deserve a place, and change the ones that do on their way in.

### Rules

- Only numbers **greater than zero** qualify. Zero itself does not.
- The ones that qualify go in squared, not as they were.
- A negative is dropped **before** anything happens to it. Squaring it first
  would sneak it in wearing a positive face.
- Build and return a **new** list; the input must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `square_positive([-2, 3, 4])` | `[9, 16]` |
| `square_positive([1, -3, 2])` | `[1, 4]` |
| `square_positive([0])` | `[]` |
| `square_positive([-1, -2])` | `[]` |
| `square_positive([])` | `[]` |

### Things you will need

`**` raises a number to a power, so `** 2` squares it:

```python
for value in [7, -4]:
    print(value ** 2)
```

Notice what that did to the negative. Asking whether a number is above zero is
its own separate question:

```python
for value in [7, 0, -4]:
    print(value > 0)
```

### Which order do you need?

You have a test and you have a transformation. Run them in one order and `-2`
is correctly thrown out; run them in the other and it comes back as `4`. Which
comes first?

## Starter code

```python # template
def square_positive(lst: list) -> list:
    """ Return the squares of the numbers of lst above zero, e.g. [9, 16] for [-2, 3, 4].

    >>> square_positive([-2, 3, 4])
    [9, 16]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(square_positive([-2, 3, 4]))
```

## Tests

```python # tests
assert square_positive([-2, 3, 4]) == [9, 16], f"Got: {square_positive([-2, 3, 4])}"
# Squaring first would turn -2 into 4 and slip it past the test
assert square_positive([-2]) == [], f"Got: {square_positive([-2])}"
# Zero is not greater than zero
assert square_positive([0]) == [], f"Got: {square_positive([0])}"
assert square_positive([]) == [], f"Got: {square_positive([])}"
assert square_positive([5]) == [25], f"Got: {square_positive([5])}"
# Keeping without squaring gives [1, 2] here, doubling gives [2, 4]
assert square_positive([1, -3, 2]) == [1, 4], f"Got: {square_positive([1, -3, 2])}"
assert square_positive([-1, -2]) == [], f"Got: {square_positive([-1, -2])}"
# The order of the survivors is the order they arrived in
assert square_positive([3, 1]) == [9, 1], f"Got: {square_positive([3, 1])}"
_src = [-2, 3, 4]
square_positive(_src)
assert _src == [-2, 3, 4], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def square_positive(lst: list) -> list:
    """ Return the squares of the numbers of lst above zero. """
    result = []
    for number in lst:
        if number > 0:
            result.append(number * number)
    return result
```

### Wrong answers the tests must catch

```python # wrong: squares everything, so negatives sneak in as positives
def square_positive(lst: list) -> list:
    """ Chooses nothing. """
    return [number * number for number in lst]
```

```python # wrong: keeps the positives but never squares them
def square_positive(lst: list) -> list:
    """ Forgets the transformation. """
    return [number for number in lst if number > 0]
```

```python # wrong: lets zero through
def square_positive(lst: list) -> list:
    """ Uses >= so zero qualifies. """
    return [number * number for number in lst if number >= 0]
```

```python # wrong: tests the square instead of the number
def square_positive(lst: list) -> list:
    """ Squares first, then asks, which is always True. """
    return [number * number for number in lst if number * number > 0]
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
if\s+\w+\s*>\s*0
append\(\w+\s*\*
```

### Shortcuts the tests reject outright

```text # banned
```
