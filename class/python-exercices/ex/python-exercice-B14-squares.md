---
title: "Python B14 - A List of Squares"
---

# A List of Squares

## Instructions

Write a function `squares(count: int) -> list` that returns `[1, 4, 9, ...]`, the squares of `1` up to `count` included.

Return the list, do not print it.

## Description

### Goal

Hand back the first `count` square numbers: 1 squared, 2 squared, and so on up to
`count` squared.

### Rules

- Start at 1 and include `count` itself.
- A `count` of 0 gives an empty list, because there are no numbers to square.
- Return the list, do not print it.

### Examples

| Call | Returns |
|---|---|
| `squares(3)` | `[1, 4, 9]` |
| `squares(1)` | `[1]` |
| `squares(5)` | `[1, 4, 9, 16, 25]` |
| `squares(0)` | `[]` |

### Things you will need

A number times itself is its square:

```python
for side in [2, 3, 4]:
    print(side * side)
```

You walk the whole numbers from 1 up to `count` included.

### Which order do you need?

Which numbers do you square, and where does the run of numbers stop so that
`count` itself is included?

## Starter code

```python # template
def squares(count: int) -> list:
    """ Return the squares of 1 up to count, e.g. [1, 4, 9] for 3.

    >>> squares(3)
    [1, 4, 9]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(squares(5))
```

## Tests

```python # tests
assert squares(3) == [1, 4, 9], f"Got: {squares(3)}"
assert squares(1) == [1], f"Got: {squares(1)}"
assert squares(5) == [1, 4, 9, 16, 25], f"Got: {squares(5)}"
assert squares(0) == [], f"Got: {squares(0)}"
assert squares(6) == [1, 4, 9, 16, 25, 36], f"Got: {squares(6)}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def squares(count: int) -> list:
    """ Return the squares of 1 up to count, e.g. [1, 4, 9] for 3. """
    return [number * number for number in range(1, count + 1)]
```

### Wrong answers the tests must catch

```python # wrong: off by one, starts at zero and stops one short
def squares(count: int) -> list:
    """ Wrong range bounds. """
    return [number * number for number in range(count)]
```

```python # wrong: doubles instead of squaring
def squares(count: int) -> list:
    """ Multiplies by two, not by itself. """
    return [number * 2 for number in range(1, count + 1)]
```

### Give-aways the Description must never contain

```text # forbidden
number\s*\*\s*number
range\(1,\s*count
```

### Shortcuts the tests reject outright

```text # banned
```
