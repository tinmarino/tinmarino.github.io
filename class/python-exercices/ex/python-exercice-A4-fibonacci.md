---
title: "Python A4 - Fibonacci"
---

# Fibonacci

## Instructions

Write a function `fibo(pos: int) -> int` that returns the number at position `pos` in the Fibonacci sequence, counting from `0`.

## Description

### The sequence

It starts with `0` and `1`, and every later number is the sum of the two before it:

```
position  0  1  2  3  4  5  6   7   8   9  10
value     0  1  1  2  3  5  8  13  21  34  55
```

### Rules

- the value at position `0` is `0`
- the value at position `1` is `1`
- from position `2` onwards, a value is the sum of the two values before it

### Examples

| Call | Returns |
|---|---|
| `fibo(0)` | `0` |
| `fibo(1)` | `1` |
| `fibo(5)` | `5` |
| `fibo(10)` | `55` |
| `fibo(20)` | `6765` |

### Where to start

Look at the table again and ask what you actually need in order to produce the next
value. Not the whole history &mdash; how many of the previous numbers, exactly? That
answer tells you how many variables to keep.

Then ask how many times you have to move forward to get from position `0` to
position `pos`.

### Things you will need

Python assigns several variables at once, and evaluates the whole right-hand side
*before* any of them changes, so no temporary is needed to exchange two values:

```python
first, second = 10, 20
first, second = second, first     # first is 20, second is 10
```

To repeat something a counted number of times, `for _ in range(count):` runs the body
`count` times; `_` is the conventional name for a loop variable you never read. Getting
`count` right is on you &mdash; see "Check yourself" below.

### A word on recursion

The rules above are self-referential, so a function that calls itself can express
them. It is shorter to write and much slower to run: it recomputes the same values
over and over, so position `30` already costs over a million calls. Both approaches
pass the tests. Write the loop.

### Check yourself

Before running anything, trace your idea by hand for `pos = 3` and confirm you get
`2`, and for `pos = 0` that you get `0`. Off-by-one errors live exactly here: count
how many times you step, not how many numbers you have seen.

## Starter code

```python # template
def fibo(pos: int) -> int:
    """ Return the Fibonacci number at position pos, counting from 0.

    >>> fibo(10)
    55
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(fibo(10))
```

## Tests

```python # tests
# Every position in a row, so a lookup table cannot masquerade as an answer
assert fibo(0) == 0, f"Got: {fibo(0)}"
assert fibo(1) == 1, f"Got: {fibo(1)}"
assert fibo(2) == 1, f"Got: {fibo(2)}"
assert fibo(3) == 2, f"Got: {fibo(3)}"
assert fibo(4) == 3, f"Got: {fibo(4)}"
assert fibo(5) == 5, f"Got: {fibo(5)}"
assert fibo(6) == 8, f"Got: {fibo(6)}"
assert fibo(7) == 13, f"Got: {fibo(7)}"
assert fibo(8) == 21, f"Got: {fibo(8)}"
assert fibo(9) == 34, f"Got: {fibo(9)}"
assert fibo(10) == 55, f"Got: {fibo(10)}"
assert [fibo(k) for k in range(12)] == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], \
    f"Got: {[fibo(k) for k in range(12)]}"
assert fibo(20) == 6765, f"Got: {fibo(20)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def fibo(pos: int) -> int:
    """ Return the Fibonacci number at position pos. """
    left, right = 0, 1
    for _ in range(pos):
        left, right = right, left + right
    return left
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: lookup table of the tested positions only
def fibo(pos: int) -> int:
    return {0: 0, 1: 1, 2: 1, 5: 5, 10: 55, 20: 6765}.get(pos, 0)
```

```python # wrong: off by one
def fibo(pos: int) -> int:
    left, right = 0, 1
    for _ in range(pos + 1):
        left, right = right, left + right
    return left
```

```python # wrong: starts the sequence at 1, 1
def fibo(pos: int) -> int:
    left, right = 1, 1
    for _ in range(pos):
        left, right = right, left + right
    return left
```

### Give-aways the Description must never contain

```text # forbidden
fibo\(\s*pos\s*-
\+\s*fibo\(
range\(pos\)
right,\s*left\s*\+\s*right
```

### Shortcuts the tests reject outright

None: there is no one-liner that skips this lesson.

```text # banned
```
