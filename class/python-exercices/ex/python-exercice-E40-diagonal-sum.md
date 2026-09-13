---
title: "Python E40 - Main-Diagonal Sum"
---

# Main-Diagonal Sum

## Instructions

Write a function `diagonal_sum(grid: list) -> int` that returns the sum of the top-left to bottom-right diagonal of a square `grid`, the cells whose row index equals their column index.

## Description

### Goal

A `grid` here is a list of rows, and each row is a list of the same length as the
number of rows &mdash; a square. The main diagonal is the line of cells running from
the top-left corner to the bottom-right corner: row `0` column `0`, row `1` column
`1`, row `2` column `2`, and so on. Add up what sits on that line and return the
total.

### Rules

- `grid` is square: as many rows as each row has cells. It can be empty.
- Return the sum as a plain `int`. Do not print it.
- Do not change `grid`.

### Examples

| Call | Returns |
|---|---|
| `diagonal_sum([[1, 2], [3, 4]])` | `5` |
| `diagonal_sum([[5]])` | `5` |
| `diagonal_sum([])` | `0` |
| `diagonal_sum([[2, 0, 0], [0, 3, 0], [0, 0, 4]])` | `9` |
| `diagonal_sum([[1, 9], [9, 1]])` | `2` |

Look at the last one. The nines sit right next to the diagonal, not on it, and they
never enter the total.

### Things you will need

A row and a position inside it can be the same number:

```python
board = ["r0", "r1", "r2"]
for pos, name in enumerate(board):
    print(pos, name[pos] if pos < len(name) else "-")
```

`range(len(...))` walks whole numbers, one for each position in something:

```python
letters = ["x", "y", "z"]
for pos in range(len(letters)):
    print(pos * pos)
```

A row of `grid` is itself a list, so `grid[pos]` is a row, and one more index into
that row reaches a single cell.

### One index or two?

You have a square, so a natural instinct is a loop inside a loop: walk every row,
and inside it walk every column, and check whether the two positions match. That
does visit the diagonal, eventually, along with everywhere else.

But the diagonal cells all share one thing: row index and column index are the
same number. If you already have that number, what second index is there left to
find?

## Starter code

```python # template
def diagonal_sum(grid: list) -> int:
    """ Return the sum of the top-left to bottom-right diagonal of the square grid.

    >>> diagonal_sum([[1, 2], [3, 4]])
    5
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(diagonal_sum([[2, 0, 0], [0, 3, 0], [0, 0, 4]]))
```

## Tests

```python # tests
assert diagonal_sum([]) == 0, f"Got: {diagonal_sum([])}"
assert diagonal_sum([[5]]) == 5, f"Got: {diagonal_sum([[5]])}"
assert diagonal_sum([[1, 2], [3, 4]]) == 5, f"Got: {diagonal_sum([[1, 2], [3, 4]])}"
# Off-diagonal values must be ignored, not folded in
assert diagonal_sum([[1, 9], [9, 1]]) == 2, f"Got: {diagonal_sum([[1, 9], [9, 1]])}"
assert diagonal_sum([[2, 0, 0], [0, 3, 0], [0, 0, 4]]) == 9, \
    f"Got: {diagonal_sum([[2, 0, 0], [0, 3, 0], [0, 0, 4]])}"
# Negative values on the diagonal
assert diagonal_sum([[-1, 5], [5, -2]]) == -3, f"Got: {diagonal_sum([[-1, 5], [5, -2]])}"
# A 4x4 grid, so no answer that only works up to size 3 slips through
_grid = [[1, 8, 8, 8], [8, 2, 8, 8], [8, 8, 3, 8], [8, 8, 8, 4]]
assert diagonal_sum(_grid) == 10, f"Got: {diagonal_sum(_grid)}"
# The grid must come out unchanged
_original = [[1, 2], [3, 4]]
diagonal_sum(_original)
assert _original == [[1, 2], [3, 4]], f"Got: the input became {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def diagonal_sum(grid: list) -> int:
    """ Return the sum of the top-left to bottom-right diagonal of the square grid. """
    total = 0
    for pos, row in enumerate(grid):
        total += row[pos]
    return total
```

### Wrong answers the tests must catch

```python # wrong: sums every cell in the grid, not only the diagonal
def diagonal_sum(grid: list) -> int:
    total = 0
    for row in grid:
        for value in row:
            total += value
    return total
```

```python # wrong: sums the first row instead of the diagonal
def diagonal_sum(grid: list) -> int:
    total = 0
    if grid:
        for value in grid[0]:
            total += value
    return total
```

```python # wrong: sums the anti-diagonal, top-right to bottom-left
def diagonal_sum(grid: list) -> int:
    total = 0
    size = len(grid)
    for pos, row in enumerate(grid):
        total += row[size - 1 - pos]
    return total
```

```python # wrong: skips the last row, off by one on the range
def diagonal_sum(grid: list) -> int:
    total = 0
    for pos, row in enumerate(grid[:-1]):
        total += row[pos]
    return total
```

### Give-aways the Description must never contain

```text # forbidden
total\s*=\s*0
grid\[pos\]\[pos\]
for\s+pos\s+in\s+range\(len\(grid\)\)
total\s*\+=
```

### Shortcuts the tests reject outright

```text # banned
```
