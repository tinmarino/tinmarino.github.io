---
title: "Python E50 - Multiplication Table"
---

# Multiplication Table

## Instructions

Write a function `times_table(size: int) -> list` that returns the `size` by `size` multiplication table as a list of lists, where the cell at row r and column c (both counting from zero) holds `(r + 1) * (c + 1)`.

## Description

### Goal

The table your teacher chalked on the board as a kid: row 1 is the ones, row 2 is
the twos, and the cell where row r meets column c is their product. You are not
handed the numbers to multiply &mdash; you are handed one number, `size`, and you
have to build the whole grid from the position of each cell alone.

### Rules

- Return a list of `size` lists, each `size` long.
- Row index `r` and column index `c` both start at `0`. The cell at `(r, c)` holds
  `(r + 1) * (c + 1)`.
- `size` can be `0`. Then there are no rows at all: return `[]`.
- `return` the table, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `times_table(2)` | `[[1, 2], [2, 4]]` |
| `times_table(3)` | `[[1, 2, 3], [2, 4, 6], [3, 6, 9]]` |
| `times_table(0)` | `[]` |

Look at `times_table(3)`: nothing about `6` was ever stored anywhere. It sits at
`(1, 2)` and at `(2, 1)` because `2 * 3` and `3 * 2` are both `6` &mdash; the grid is
symmetric because multiplication is.

### Things you will need

A list built one row at a time, each row itself built one cell at a time:

```python
grid = []
for row_index in range(3):
    row = []
    for col_index in range(2):
        row.append(row_index + col_index)
    grid.append(row)
print(grid)          # [[0, 1], [1, 2], [2, 3]]
```

`range(num)` counts `0, 1, ..., num - 1` &mdash; exactly the indices you need to turn
into row and column numbers:

```python
print(list(range(4)))   # [0, 1, 2, 3]
```

### One loop or two?

Every cell needs both a row index and a column index to know what to hold. Can one
loop variable give you both? If not, what does the second loop need to run over,
and where does it need to live so it runs once per row instead of once in total?

## Starter code

```python # template
def times_table(size: int) -> list:
    """ Return the size by size multiplication table as a list of lists.

    >>> times_table(2)
    [[1, 2], [2, 4]]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(times_table(3))
```

## Tests

```python # tests
assert times_table(0) == [], f"Got: {times_table(0)}"
assert times_table(1) == [[1]], f"Got: {times_table(1)}"
assert times_table(2) == [[1, 2], [2, 4]], f"Got: {times_table(2)}"
assert times_table(3) == [[1, 2, 3], [2, 4, 6], [3, 6, 9]], f"Got: {times_table(3)}"
_five = times_table(5)
assert _five[0] == [1, 2, 3, 4, 5], f"Got: {_five[0]}"
assert _five[4] == [5, 10, 15, 20, 25], f"Got: {_five[4]}"
assert _five[2][3] == 12, f"Got: {_five[2][3]}"
# The grid is symmetric: (r, c) and (c, r) hold the same product
_six = times_table(6)
for _r in range(6):
    for _c in range(6):
        assert _six[_r][_c] == _six[_c][_r], f"Got: {_six[_r][_c]} != {_six[_c][_r]}"
# Every row is size long, and there are size rows
assert len(_six) == 6, f"Got: {len(_six)} rows"
assert all(len(_row) == 6 for _row in _six), f"Got: row lengths {[len(_row) for _row in _six]}"
assert times_table(1)[0][0] == 1, f"Got: {times_table(1)[0][0]}"
assert isinstance(times_table(2), list), f"Got: {type(times_table(2))}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def times_table(size: int) -> list:
    """ Return the size by size multiplication table as a list of lists. """
    table = []
    for row_index in range(size):
        row = []
        for col_index in range(size):
            row.append((row_index + 1) * (col_index + 1))
        table.append(row)
    return table
```

### Wrong answers the tests must catch

```python # wrong: builds one extra row, size + 1 rows instead of size
def times_table(size: int) -> list:
    table = []
    for row_index in range(size + 1):
        row = []
        for col_index in range(size):
            row.append((row_index + 1) * (col_index + 1))
        table.append(row)
    return table
```

```python # wrong: builds one row and reuses the same list object for every row
def times_table(size: int) -> list:
    table = []
    row = []
    for row_index in range(size):
        row.append(row_index)
    for _ in range(size):
        table.append(row)
    return table
```

```python # wrong: adds instead of multiplying
def times_table(size: int) -> list:
    table = []
    for row_index in range(size):
        row = []
        for col_index in range(size):
            row.append((row_index + 1) + (col_index + 1))
        table.append(row)
    return table
```

```python # wrong: forgets the plus one, so row 0 and column 0 are all zeros
def times_table(size: int) -> list:
    table = []
    for row_index in range(size):
        row = []
        for col_index in range(size):
            row.append(row_index * col_index)
        table.append(row)
    return table
```

### Give-aways the Description must never contain

```text # forbidden
row_index\s*\+\s*1
col_index\s*\+\s*1
table\.append\(
```

### Shortcuts the tests reject outright

```text # banned
```
