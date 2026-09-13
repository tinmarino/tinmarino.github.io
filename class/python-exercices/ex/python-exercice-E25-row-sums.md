---
title: "Python E25 - Sum of Each Row"
---

# Sum of Each Row

## Instructions

Write a function `row_sums(grid: list) -> list` that returns a list holding the total of each row of the 2D `grid`, one number per row.

## Description

### Goal

A `grid` here is just a list of lists: each inner list is one row, and each row
holds numbers. Give back a new list with one entry per row, and that entry is the
sum of the numbers in that row.

### Rules

- Return a new list. `grid` itself must come out **unchanged**.
- The result has exactly one entry per row, in the same order the rows arrived in.
- A row can be empty; its total is `0`.
- `grid` itself can be empty; then the answer is an empty list too.
- `return` the list, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `row_sums([[1, 2], [3, 4], [5, 6]])` | `[3, 7, 11]` |
| `row_sums([[7]])` | `[7]` |
| `row_sums([[1, 1, 1, 1]])` | `[4]` |
| `row_sums([[]])` | `[0]` |
| `row_sums([])` | `[]` |

Look at `row_sums([[1, 2], [3, 4], [5, 6]])`. Each row is a plain list of numbers,
and you already know how to add up a plain list of numbers &mdash; you have done it
since exercise `B20`. Nothing here is new except that you now have several of
them, sitting one after another.

### Things you will need

Summing one list of numbers, and building a new list up one entry at a time:

```python
def add_up(prices: list) -> int:
    """ Return the total of prices. """
    total = 0
    for price in prices:
        total = total + price
    return total

results = []
results.append(add_up([4, 1, 3]))
print(results)          # [8]
```

`sum()` also adds up a list in one call, on data that has nothing to do with a
grid:

```python
print(sum([4, 1, 3]))    # 8
```

### Which order do you need?

You are walking two things at once: the rows of `grid`, and then, inside each
row, the numbers in it. Which loop goes around the other &mdash; one loop over
the rows with the summing done inside it, or one loop over the numbers with
something else deciding when a row ends?

## Starter code

```python # template
def row_sums(grid: list) -> list:
    """ Return a list holding the total of each row of grid.

    >>> row_sums([[1, 2], [3, 4], [5, 6]])
    [3, 7, 11]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(row_sums([[1, 2], [3, 4], [5, 6]]))
```

## Tests

```python # tests
assert row_sums([[1, 2], [3, 4], [5, 6]]) == [3, 7, 11], \
    f"Got: {row_sums([[1, 2], [3, 4], [5, 6]])}"
assert row_sums([[7]]) == [7], f"Got: {row_sums([[7]])}"
assert row_sums([]) == [], f"Got: {row_sums([])}"
# A row can be empty; its total is 0, but it still counts as one entry
assert row_sums([[]]) == [0], f"Got: {row_sums([[]])}"
assert row_sums([[1, 2], []]) == [3, 0], f"Got: {row_sums([[1, 2], []])}"
# A single row with several values
assert row_sums([[1, 1, 1, 1]]) == [4], f"Got: {row_sums([[1, 1, 1, 1]])}"
# Negative numbers are just numbers
assert row_sums([[-1, 1], [-5, -5]]) == [0, -10], \
    f"Got: {row_sums([[-1, 1], [-5, -5]])}"
# grid must not be modified
grid = [[1, 2], [3, 4]]
row_sums(grid)
assert grid == [[1, 2], [3, 4]], f"Got: {grid}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def row_sums(grid: list) -> list:
    """ Return a list holding the total of each row of grid. """
    totals = []
    for row in grid:
        total = 0
        for value in row:
            total = total + value
        totals.append(total)
    return totals
```

### Wrong answers the tests must catch

```python # wrong: sums everything into one number instead of one per row
def row_sums(grid: list) -> list:
    """ Return a list holding the total of each row of grid. """
    total = 0
    for row in grid:
        for value in row:
            total = total + value
    return [total]
```

```python # wrong: forgets an empty row still needs its own zero entry
def row_sums(grid: list) -> list:
    """ Return a list holding the total of each row of grid. """
    totals = []
    for row in grid:
        if row:
            total = 0
            for value in row:
                total = total + value
            totals.append(total)
    return totals
```

```python # wrong: mutates the grid it was given
def row_sums(grid: list) -> list:
    """ Return a list holding the total of each row of grid. """
    totals = []
    for row in grid:
        total = 0
        while row:
            total = total + row.pop()
        totals.append(total)
    return totals
```

### Give-aways the Description must never contain

```text # forbidden
totals\.append\(total\)
for\s+row\s+in\s+grid\s*:\s*\n\s*total\s*=\s*0
```

### Shortcuts the tests reject outright

```text # banned
```
