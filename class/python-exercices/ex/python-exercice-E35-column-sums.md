---
title: "Python E35 - Sum of Each Column"
---

# Sum of Each Column

## Instructions

Write a function `column_sums(grid: list) -> list` that returns a list holding the total of each column of the rectangular `grid`, one number per column.

## Description

### Goal

`grid` is a list of rows, and every row is a list of numbers, all the same length.
Read it down instead of across: the first number of every row belongs to one total,
the second number of every row belongs to another, and so on. Return one total per
column, left to right.

### Rules

- `grid` is a list of rows. Every row has the same number of numbers in it.
- Return a new list. `grid` itself must come out unchanged.
- Every row is at least one number long, unless `grid` itself is empty.
- Return the list, do not print it.

### Examples

| Call | Returns |
|---|---|
| `column_sums([[1, 2], [3, 4], [5, 6]])` | `[9, 12]` |
| `column_sums([[1, 2, 3]])` | `[1, 2, 3]` |
| `column_sums([])` | `[]` |

Look at the first row of the table. Three rows, two columns: the left column is
`1 + 3 + 5`, the right column is `2 + 4 + 6`. The grid has three rows and the answer
has only two numbers in it &mdash; you are not counting rows any more.

### Things you will need

`enumerate()` walks a sequence and hands you both a position and the value sitting
there, exactly as it would on any other list:

```python
days = ["mon", "tue", "wed"]
for pos, name in enumerate(days):
    print(pos, name)
```

Reading one number out of a grid is a double lookup: which row, then which position
inside it.

```python
board = [[10, 20], [30, 40]]
print(board[1][0])    # 30, second row, first position
```

An accumulator does not have to be a single number. It can start as a list of zeros,
one slot per column, and grow one slot at a time as you add into it:

```python
totals = [0, 0, 0]
totals[1] = totals[1] + 5
print(totals)          # [0, 5, 0]
```

### Rows first, or columns first?

With a single running total, you walk the numbers in whatever order they come and add
each one in. Here you cannot: there is no single lookup that hands you "a column" the
way indexing a row hands you one number. A column is not sitting anywhere &mdash; it
is scattered one number per row.

So think about which loop goes on the outside. If you visit the grid row by row, what
do you do with each number in a row once you have it, and where does it need to land in
your list of totals?

## Starter code

```python # template
def column_sums(grid: list) -> list:
    """ Return the total of each column of grid, one number per column.

    >>> column_sums([[1, 2], [3, 4], [5, 6]])
    [9, 12]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(column_sums([[1, 2], [3, 4], [5, 6]]))
```

## Tests

```python # tests
assert column_sums([[1, 2], [3, 4], [5, 6]]) == [9, 12], \
    f"Got: {column_sums([[1, 2], [3, 4], [5, 6]])}"
assert column_sums([[1, 2, 3]]) == [1, 2, 3], f"Got: {column_sums([[1, 2, 3]])}"
assert not column_sums([]), f"Got: {column_sums([])}"
# A single column, several rows
assert column_sums([[4], [5], [6]]) == [15], f"Got: {column_sums([[4], [5], [6]])}"
# A single row, several columns
assert column_sums([[7, 8, 9]]) == [7, 8, 9], f"Got: {column_sums([[7, 8, 9]])}"
# Negative numbers, and columns that do not all add up the same way
assert column_sums([[1, -2], [-3, 4], [5, -6]]) == [3, -4], \
    f"Got: {column_sums([[1, -2], [-3, 4], [5, -6]])}"
# Zeros do not vanish from the total
assert column_sums([[0, 0], [0, 0]]) == [0, 0], f"Got: {column_sums([[0, 0], [0, 0]])}"
# A single cell
assert column_sums([[9]]) == [9], f"Got: {column_sums([[9]])}"
# Four columns, three rows
_grid = [[1, 2, 3, 4], [10, 20, 30, 40], [100, 200, 300, 400]]
assert column_sums(_grid) == [111, 222, 333, 444], f"Got: {column_sums(_grid)}"
# The list of rows must come out unchanged
_original = [[1, 2], [3, 4]]
column_sums(_original)
assert _original == [[1, 2], [3, 4]], f"Got: the input became {_original}"
# The list is returned, not printed
assert isinstance(column_sums([[1, 2]]), list), f"Got: {type(column_sums([[1, 2]]))}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def column_sums(grid: list) -> list:
    """ Return the total of each column of grid, one number per column. """
    if not grid:
        return []
    totals = [0] * len(grid[0])
    for row in grid:
        for pos, value in enumerate(row):
            totals[pos] += value
    return totals
```

### Wrong answers the tests must catch

```python # wrong: sums each row instead of each column
def column_sums(grid: list) -> list:
    if not grid:
        return []
    return [sum(row) for row in grid]
```

```python # wrong: adds every number into a single running total
def column_sums(grid: list) -> list:
    total = 0
    for row in grid:
        for value in row:
            total += value
    return [total]
```

```python # wrong: only ever totals the first row, ignores the rest
def column_sums(grid: list) -> list:
    if not grid:
        return []
    return list(grid[0])
```

```python # wrong: mutates the grid it was given while totalling it
def column_sums(grid: list) -> list:
    if not grid:
        return []
    totals = [0] * len(grid[0])
    for row in grid:
        for pos, value in enumerate(row):
            totals[pos] += value
            row[pos] = 0
    return totals
```

### Give-aways the Description must never contain

```text # forbidden
totals\s*=\s*\[0\]
totals\[pos\]
for\s+row\s+in\s+grid\b
\[0\]\s*\*\s*len
enumerate\(row\)
```

### Shortcuts the tests reject outright

```text # banned
```
