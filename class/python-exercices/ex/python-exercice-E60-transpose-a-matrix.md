---
title: "Python E60 - Transpose a Matrix"
---

# Transpose a Matrix

## Instructions

Write a function `transpose(grid: list) -> list` that swaps rows and columns, so the cell at row `r`, column `c` ends up at row `c`, column `r`.

## Description

### Goal

`grid` is a list of rows, and every row is a list of the same length. Return a new
grid where the first column of `grid` becomes the first row of the result, the second
column becomes the second row, and so on. `grid` itself is not touched. Return the new
grid &mdash; do not print it.

### Rules

- The grid is rectangular: every row has the same number of columns, but it need not
  be square. A grid with 2 rows and 3 columns comes back with 3 rows and 2 columns.
- Do not modify `grid`. Build and return a new list of new rows.
- An empty grid, `[]`, comes back as `[]`.

### Examples

| Call | Returns |
|---|---|
| `transpose([[1, 2, 3], [4, 5, 6]])` | `[[1, 4], [2, 5], [3, 6]]` |
| `transpose([[1], [2]])` | `[[1, 2]]` |
| `transpose([])` | `[]` |
| `transpose([[7]])` | `[[7]]` |

### Things you will need

Picking one column out of every row, from left to right, is picking the same index
out of several lists:

```python
names = ["ann", "bob"]
scores = ["low", "high"]
for pair in zip(names, scores):
    print(pair)    # prints ('ann', 'low') then ('bob', 'high')
```

`range()` on the length of something tells you which indices exist, exactly as it did
back in exercise `C10`:

```python
letters = ["p", "q", "r"]
for pos in range(3):
    print(pos, letters[pos])
```

And a list comprehension builds a whole list from one expression, the way it did in
exercise `C40`:

```python
pairs = [(item, item * item) for item in [1, 2, 3]]
print(pairs)    # prints [(1, 1), (2, 4), (3, 9)]
```

### Which index moves, and which stays still?

Row `c` of the result is built from column `c` of `grid`: one value taken out of
*every* row, all at the same position. So for one output row you hold `c` fixed and
walk every row of `grid`. For the whole result, which of the two indices is the one
you loop over on the outside, and which one stays fixed while you build a single row?

## Starter code

```python # template
def transpose(grid: list) -> list:
    """ Return grid with rows and columns swapped.

    >>> transpose([[1, 2, 3], [4, 5, 6]])
    [[1, 4], [2, 5], [3, 6]]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(transpose([[1, 2, 3], [4, 5, 6]]))
```

## Tests

```python # tests
assert transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]], \
    f"Got: {transpose([[1, 2, 3], [4, 5, 6]])}"
assert transpose([[1], [2]]) == [[1, 2]], f"Got: {transpose([[1], [2]])}"
assert transpose([]) == [], f"Got: {transpose([])}"
assert transpose([[7]]) == [[7]], f"Got: {transpose([[7]])}"
assert transpose([[1, 2], [3, 4]]) == [[1, 3], [2, 4]], \
    f"Got: {transpose([[1, 2], [3, 4]])}"
assert transpose([[1, 2, 3]]) == [[1], [2], [3]], f"Got: {transpose([[1, 2, 3]])}"
# Transposing twice comes back to the start
grid = [[1, 2, 3], [4, 5, 6]]
assert transpose(transpose(grid)) == grid, f"Got: {transpose(transpose(grid))}"
# The original grid must be left untouched
original = [[1, 2], [3, 4], [5, 6]]
transpose(original)
assert original == [[1, 2], [3, 4], [5, 6]], f"Got: {original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def transpose(grid: list) -> list:
    """ Return grid with rows and columns swapped. """
    if not grid:
        return []
    return [[row[col] for row in grid] for col in range(len(grid[0]))]
```

### Wrong answers the tests must catch

```python # wrong: builds rows instead of columns, so nothing actually swaps
def transpose(grid: list) -> list:
    if not grid:
        return []
    return [[value for value in row] for row in grid]
```

```python # wrong: mutates the input grid instead of returning a new one
def transpose(grid: list) -> list:
    if not grid:
        return []
    result = [[row[col] for row in grid] for col in range(len(grid[0]))]
    grid.clear()
    grid.extend(result)
    return result
```

```python # wrong: only handles a square grid, breaks on rectangular input
def transpose(grid: list) -> list:
    if not grid:
        return []
    size = len(grid)
    return [[grid[row][col] for row in range(size)] for col in range(size)]
```

```python # wrong: swaps row and column indices backwards, same shape, wrong values
def transpose(grid: list) -> list:
    if not grid:
        return []
    return [[col for col in row] for row in zip(*grid)][::-1]
```

### Give-aways the Description must never contain

```text # forbidden
zip\(\*grid\)
for\s+col\s+in\s+range\(len\(grid\[0\]\)\)
row\[col\]\s+for\s+row\s+in\s+grid
```

### Shortcuts the tests reject outright

```text # banned
```
