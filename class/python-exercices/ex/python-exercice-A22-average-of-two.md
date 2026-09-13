---
title: "Python A22 - Average of Two"
---

# Average of Two

## Instructions

Write a function `average(left: int, right: int) -> float` that returns the mean of the two numbers, `(left + right) / 2`.

Return the number, do not print it.

## Description

### Goal

Hand back the value that sits exactly halfway between two numbers. For `4` and
`6` that is `5.0`.

### Rules

- Add the two numbers and divide by two.
- The answer is a `float`, even when it comes out even: `average(4, 6)` is
  `5.0`, not `5`. Plain division with `/` already gives you a float.
- Return the value, do not print it.

### Examples

| Call | Returns |
|---|---|
| `average(4, 6)` | `5.0` |
| `average(0, 10)` | `5.0` |
| `average(3, 4)` | `3.5` |
| `average(-2, 2)` | `0.0` |

### Things you will need

Dividing with `/` always gives back a float, even when the numbers divide
evenly:

```python
for total in [10, 7]:
    print(total / 2)
```

Do the addition before the division; parentheses decide what happens first.

### Which order do you need?

Do you divide before or after you add the two numbers together?

## Starter code

```python # template
def average(left: int, right: int) -> float:
    """ Return the mean of two numbers, e.g. 5.0 for (4, 6).

    >>> average(4, 6)
    5.0
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(average(4, 6))
```

## Tests

```python # tests
assert average(4, 6) == 5.0, f"Got: {average(4, 6)}"
assert average(0, 10) == 5.0, f"Got: {average(0, 10)}"
assert average(3, 4) == 3.5, f"Got: {average(3, 4)}"
assert average(-2, 2) == 0.0, f"Got: {average(-2, 2)}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def average(left: int, right: int) -> float:
    """ Return the mean of two numbers, e.g. 5.0 for (4, 6). """
    return (left + right) / 2
```

### Wrong answers the tests must catch

```python # wrong: uses integer division and loses the half
def average(left: int, right: int) -> float:
    """ Divide with // so 3.5 becomes 3. """
    return (left + right) // 2
```

```python # wrong: forgets to divide
def average(left: int, right: int) -> float:
    """ Return the sum instead of the mean. """
    return left + right
```

### Give-aways the Description must never contain

```text # forbidden
\(left\s*\+\s*right\)\s*/\s*2
return\s+\(left
```

### Shortcuts the tests reject outright

```text # banned
```
