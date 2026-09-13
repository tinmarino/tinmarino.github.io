---
title: "Python E45 - Identity Matrix"
---

# Identity Matrix

## Instructions

Write a function `identity(size: int) -> list` that returns the `size` by `size` identity matrix as a list of `size` lists.

A size of `0` returns the empty list.

## Description

### Goal

A matrix is a grid of numbers, and here it is a list of rows, each row a list of
numbers. The **identity matrix** of size `n` is the `n` by `n` grid that has a `1`
everywhere the row number matches the column number, and a `0` everywhere else.
Row `0`, column `0` is a `1`. Row `0`, column `1` is a `0`. Row `2`, column `2` is
a `1` again.

Your function builds that grid for a given size and returns it. Return it &mdash;
do not print it.

### Rules

- Return a list of `size` lists, each of length `size`.
- Every cell is `1` if its row index equals its column index, `0` otherwise.
- `size` is `0` or a positive integer. `identity(0)` returns `[]`, not `[[]]`.

### Examples

| Call | Returns |
|---|---|
| `identity(1)` | `[[1]]` |
| `identity(2)` | `[[1, 0], [0, 1]]` |
| `identity(3)` | `[[1, 0, 0], [0, 1, 0], [0, 0, 1]]` |
| `identity(0)` | `[]` |

### Things you will need

Building a grid means a loop for the rows and, inside it, a loop for the columns
of that row. `range(size)` gives you row numbers and column numbers to compare:

```python
for outer in range(3):
    for inner in range(3):
        print(outer, inner, outer == inner)
```

A row is built up the same way you build up any list: start empty, and `append`
one value per column.

```python
row = []
for col in range(4):
    row.append(col * col)
print(row)    # prints [0, 1, 4, 9]
```

### Which index tells you what to put down?

For a given `row` and a given `col`, there is a one-line test that tells you
whether the cell holds a `1` or a `0`. What is it, and where do the finished
rows go once you have built them?

## Starter code

```python # template
def identity(size: int) -> list:
    """ Return the size by size identity matrix as a list of size lists.

    >>> identity(2)
    [[1, 0], [0, 1]]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(identity(3))
```

## Tests

```python # tests
assert identity(1) == [[1]], f"Got: {identity(1)}"
assert identity(2) == [[1, 0], [0, 1]], f"Got: {identity(2)}"
assert identity(3) == [[1, 0, 0], [0, 1, 0], [0, 0, 1]], f"Got: {identity(3)}"
expected_4 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
assert identity(4) == expected_4, f"Got: {identity(4)}"
# Size 0 is the empty list, not a list holding an empty row
assert identity(0) == [], f"Got: {identity(0)}"
# Every row must have the right length, even for a single row
assert len(identity(5)) == 5, f"Got: {len(identity(5))}"
assert all(len(row) == 5 for row in identity(5)), f"Got: {identity(5)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def identity(size: int) -> list:
    """ Return the size by size identity matrix as a list of size lists. """
    matrix = []
    for row in range(size):
        this_row = []
        for col in range(size):
            if row == col:
                this_row.append(1)
            else:
                this_row.append(0)
        matrix.append(this_row)
    return matrix
```

### Wrong answers the tests must catch

```python # wrong: fills every cell with 1, so it is not testing row against col at all
def identity(size: int) -> list:
    matrix = []
    for row in range(size):
        this_row = []
        for col in range(size):
            this_row.append(1)
        matrix.append(this_row)
    return matrix
```

```python # wrong: size 0 returns a list holding one empty row instead of the empty list
def identity(size: int) -> list:
    if size == 0:
        return [[]]
    matrix = []
    for row in range(size):
        this_row = []
        for col in range(size):
            if row == col:
                this_row.append(1)
            else:
                this_row.append(0)
        matrix.append(this_row)
    return matrix
```

```python # wrong: appends the same row object every time, so every row aliases the last one built
def identity(size: int) -> list:
    matrix = []
    this_row = []
    for row in range(size):
        this_row = []
        for col in range(size):
            if row == col:
                this_row.append(1)
            else:
                this_row.append(0)
    for _ in range(size):
        matrix.append(this_row)
    return matrix
```

```python # wrong: puts the 1 in the wrong column, one off from the diagonal
def identity(size: int) -> list:
    matrix = []
    for row in range(size):
        this_row = []
        for col in range(size):
            if row == col - 1:
                this_row.append(1)
            else:
                this_row.append(0)
        matrix.append(this_row)
    return matrix
```

### Give-aways the Description must never contain

```text # forbidden
row\s*==\s*col
this_row\.append
matrix\.append
```

### Shortcuts the tests reject outright

```text # banned
```
