---
title: "Python E55 - Add Two Matrices"
---

# Add Two Matrices

## Instructions

Write a function `add_matrices(first: list, second: list) -> list:` that returns the element-wise sum of two same-shaped grids, as a new list of lists.

Neither `first` nor `second` is changed by the call.

## Description

### Goal

A matrix here is just a list of rows, and each row is a list of numbers. Two matrices
of the same shape can be added position by position: the number in row 2, column 3 of
the result is the sum of the numbers in row 2, column 3 of each input.

You are handed two matrices of the same shape. Return a brand new matrix holding their
sum, one cell at a time.

### Rules

- `first` and `second` always have the same number of rows, and every row has the
  same number of columns as its counterpart in the other matrix.
- Return a **new** list of lists. Neither `first` nor `second` may be modified.
- An empty matrix (`[]`) added to another empty matrix is `[]`.
- `return` the result. Do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `add_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]])` | `[[6, 8], [10, 12]]` |
| `add_matrices([[1, 2]], [[5, 6]])` | `[[6, 8]]` |
| `add_matrices([], [])` | `[]` |

### Things you will need

Two lists of the same length can be walked in step, one item from each at a time:

```python
prices = [2, 5, 9]
counts = [3, 1, 4]
for price, count in zip(prices, counts):
    print(price * count)    # prints 6, then 5, then 36
```

Building a new list one item at a time is the same pattern whatever is inside it:

```python
totals = []
for value in [10, 20, 30]:
    totals.append(value + 1)
print(totals)    # [11, 21, 31]
```

### One row at a time, one cell at a time

You already know how to add two flat lists of numbers position by position &mdash;
that is exactly `zip` plus a loop that appends. A matrix is a list of rows, and each
row is exactly that flat list.

So: what has to happen once per row, and what has to happen once per cell inside a
row? If the first loop builds one new row, what does the second loop, nested inside
it, need to build?

## Starter code

```python # template
def add_matrices(first: list, second: list) -> list:
    """ Return the element-wise sum of first and second, as a new list of lists.

    >>> add_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]])
    [[6, 8], [10, 12]]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(add_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]))
```

## Tests

```python # tests
import random as _random

assert add_matrices([], []) == [], f"Got: {add_matrices([], [])}"
assert add_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]) == [[6, 8], [10, 12]], \
    f"Got: {add_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]])}"
assert add_matrices([[1, 2]], [[5, 6]]) == [[6, 8]], \
    f"Got: {add_matrices([[1, 2]], [[5, 6]])}"
# A single row, single column matrix
assert add_matrices([[4]], [[9]]) == [[13]], f"Got: {add_matrices([[4]], [[9]])}"
# A row of zeros
assert add_matrices([[0, 0, 0]], [[1, 2, 3]]) == [[1, 2, 3]], \
    f"Got: {add_matrices([[0, 0, 0]], [[1, 2, 3]])}"
# Negative numbers
assert add_matrices([[-1, 2], [3, -4]], [[1, -2], [-3, 4]]) == [[0, 0], [0, 0]], \
    f"Got: {add_matrices([[-1, 2], [3, -4]], [[1, -2], [-3, 4]])}"
# A taller matrix, three rows
assert add_matrices([[1], [2], [3]], [[10], [20], [30]]) == [[11], [22], [33]], \
    f"Got: {add_matrices([[1], [2], [3]], [[10], [20], [30]])}"
# Neither input is modified
_first = [[1, 2], [3, 4]]
_second = [[5, 6], [7, 8]]
add_matrices(_first, _second)
assert _first == [[1, 2], [3, 4]], f"Got: first became {_first}"
assert _second == [[5, 6], [7, 8]], f"Got: second became {_second}"
# The result is returned, not printed
assert isinstance(add_matrices([[1]], [[2]]), list), f"Got: {type(add_matrices([[1]], [[2]]))}"
# A new list of lists, not the same objects handed back
_a = [[1, 2]]
_b = [[3, 4]]
_result = add_matrices(_a, _b)
assert _result is not _a and _result is not _b, "Got: the result reuses an input object"
# Built fresh every run, so a memorised table cannot fake it
_rows = _random.randint(1, 4)
_cols = _random.randint(1, 4)
_grid_a = [[_random.randint(-9, 9) for _ in range(_cols)] for _ in range(_rows)]
_grid_b = [[_random.randint(-9, 9) for _ in range(_cols)] for _ in range(_rows)]
_expected = [[_grid_a[_r][_c] + _grid_b[_r][_c] for _c in range(_cols)] for _r in range(_rows)]
assert add_matrices(_grid_a, _grid_b) == _expected, f"Got: {add_matrices(_grid_a, _grid_b)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def add_matrices(first: list, second: list) -> list:
    """ Return the element-wise sum of first and second, as a new list of lists. """
    result = []
    for row_a, row_b in zip(first, second):
        new_row = []
        for value_a, value_b in zip(row_a, row_b):
            new_row.append(value_a + value_b)
        result.append(new_row)
    return result
```

### Wrong answers the tests must catch

```python # wrong: adds each row into first instead of building a new matrix
def add_matrices(first: list, second: list) -> list:
    for row_index, row_b in enumerate(second):
        for col_index, value_b in enumerate(row_b):
            first[row_index][col_index] += value_b
    return first
```

```python # wrong: multiplies instead of adding
def add_matrices(first: list, second: list) -> list:
    result = []
    for row_a, row_b in zip(first, second):
        new_row = []
        for value_a, value_b in zip(row_a, row_b):
            new_row.append(value_a * value_b)
        result.append(new_row)
    return result
```

```python # wrong: concatenates the rows instead of adding cell by cell
def add_matrices(first: list, second: list) -> list:
    result = []
    for row_a, row_b in zip(first, second):
        result.append(row_a + row_b)
    return result
```

```python # wrong: only adds the first cell of each row
def add_matrices(first: list, second: list) -> list:
    result = []
    for row_a, row_b in zip(first, second):
        result.append([row_a[0] + row_b[0]])
    return result
```

### Give-aways the Description must never contain

```text # forbidden
zip\(row
new_row\s*=\s*\[\]
new_row\.append
result\.append\(new_row
value_a\s*\+\s*value_b
```

### Shortcuts the tests reject outright

```text # banned
```
