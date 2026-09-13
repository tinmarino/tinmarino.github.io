---
title: "Python E30 - Count a Value in a Grid"
---

# Count a Value in a Grid

## Instructions

Write a function `count_value(grid: list, target: int) -> int` that returns how many cells of `grid` equal `target`.

## Description

### Goal

`grid` is a list of rows, and each row is a list of numbers. Count how many of those
numbers, wherever they sit, are equal to `target`. Return the count &mdash; do not
print it.

### Rules

- `grid` is a list of lists of `int`. Every row can have any length, rows do not
  have to match each other, and `grid` itself can be empty.
- A cell counts only when it is equal to `target`, `==`, nothing looser.
- `grid` must come out of the call **unchanged**.
- `return` the count, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `count_value([[0, 1], [0, 0]], 0)` | `3` |
| `count_value([[1, 2]], 9)` | `0` |
| `count_value([], 0)` | `0` |
| `count_value([[5]], 5)` | `1` |
| `count_value([[1, 1, 1], [1]], 1)` | `4` |

### Things you will need

A `for` inside a `for` visits every element of every row, one at a time:

```python
board = [["x", "o"], ["o", "o", "x"]]
for row in board:
    for mark in row:
        print(mark)
```

Comparing two numbers with `==` gives back `True` or `False`, and adding a `True`
to a running total counts it as `1`:

```python
def count_sunny(weather: list) -> int:
    """ Return how many days in weather are "sun". """
    sunny_days = 0
    for day in weather:
        sunny_days += (day == "sun")
    return sunny_days

print(count_sunny(["sun", "rain", "sun", "sun"]))    # 3
```

### The question

You already have a running total from `B20`, and you already know how to visit every
cell of a grid, one row and then the row inside it. The only thing new here is that
the thing you are adding to the total is not a number sitting in the grid &mdash; it
is the *answer to a question* about a number sitting in the grid. What is that
question, and what do you do with its answer each time you ask it?

## Starter code

```python # template
def count_value(grid: list, target: int) -> int:
    """ Return how many cells of grid equal target.

    >>> count_value([[0, 1], [0, 0]], 0)
    3
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(count_value([[3, 1, 3], [3, 2]], 3))
```

## Tests

```python # tests
assert count_value([[0, 1], [0, 0]], 0) == 3, f"Got: {count_value([[0, 1], [0, 0]], 0)}"
assert count_value([[1, 2]], 9) == 0, f"Got: {count_value([[1, 2]], 9)}"
assert count_value([], 0) == 0, f"Got: {count_value([], 0)}"
assert count_value([[5]], 5) == 1, f"Got: {count_value([[5]], 5)}"
assert count_value([[1, 1, 1], [1]], 1) == 4, f"Got: {count_value([[1, 1, 1], [1]], 1)}"
# Rows of different lengths, and an empty row among them
_ragged = [[7, 7], [], [7], [1, 7, 7]]
assert count_value(_ragged, 7) == 5, f"Got: {count_value(_ragged, 7)}"
# A target that appears in every row, some more than once
_full = [[2, 2, 2], [2, 2], [2]]
assert count_value(_full, 2) == 6, f"Got: {count_value(_full, 2)}"
# A grid with rows but a target that never occurs
assert count_value([[1, 2, 3], [4, 5]], 0) == 0, f"Got: {count_value([[1, 2, 3], [4, 5]], 0)}"
# A single row, empty
assert count_value([[]], 3) == 0, f"Got: {count_value([[]], 3)}"
# The grid you were given must come out unchanged
_original = [[1, 0], [0, 1]]
count_value(_original, 0)
assert _original == [[1, 0], [0, 1]], f"Got: the input became {_original}"
# The count is returned, not printed
assert isinstance(count_value([[0]], 0), int), f"Got: {type(count_value([[0]], 0))}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def count_value(grid: list, target: int) -> int:
    """ Return how many cells of grid equal target. """
    total = 0
    for row in grid:
        for cell in row:
            total += (cell == target)
    return total
```

### Wrong answers the tests must catch

```python # wrong: counts rows that CONTAIN the target instead of matching cells
def count_value(grid: list, target: int) -> int:
    total = 0
    for row in grid:
        if target in row:
            total += 1
    return total
```

```python # wrong: only looks at the first row
def count_value(grid: list, target: int) -> int:
    total = 0
    if not grid:
        return 0
    for cell in grid[0]:
        if cell == target:
            total += 1
    return total
```

```python # wrong: forgets to reset, keeps a stray count from a previous idea
def count_value(grid: list, target: int) -> int:
    total = 1
    for row in grid:
        for cell in row:
            if cell == target:
                total += 1
    return total
```

### Give-aways the Description must never contain

```text # forbidden
total\s*\+=\s*\(cell\s*==\s*target\)
for\s+row\s+in\s+grid\s*:\s*\n\s*for\s+cell\s+in\s+row
```

### Shortcuts the tests reject outright

```text # banned
```
