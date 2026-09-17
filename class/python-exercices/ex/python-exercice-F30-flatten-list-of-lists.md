---
title: "Python F30 - Flatten a List of Lists"
---

# Flatten a List of Lists

## Instructions

Write a function `flatten(rows: list) -> list` that returns one flat list holding every element of every row of `rows`, in order.

Return the new list, do not print it.

## Description

### Goal

A spreadsheet arrives as a list of rows, and each row is itself a list. You want
the cells in one long line instead: everything from the first row, then
everything from the second, and so on.

### Rules

- Exactly **one** layer of brackets comes off. If a row happens to contain a list,
  that inner list travels into the answer still a list.
- An empty row contributes nothing at all.
- Keep the order. Do not sort, do not remove repeats.
- Build and return a **new** list; `rows` and its rows must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `flatten([[1, 2], [3, 4]])` | `[1, 2, 3, 4]` |
| `flatten([[], [1]])` | `[1]` |
| `flatten([])` | `[]` |
| `flatten([[5, [6, 7]], [8]])` | `[5, [6, 7], 8]` |

The last row is the one that catches people. `[6, 7]` arrived nested one layer
deeper, and it leaves exactly as it arrived &mdash; still a list. Only the outer
layer disappears.

### Things you will need

Growing a list one element at a time:

```python
letters = []
for char in "abc":
    letters.append(char)
print(letters)
```

Walking a list whose elements happen to be lists gives you those lists, one per
turn. What is inside each one is a separate matter:

```python
for group in [["x", "y"], ["z"]]:
    print(group)
```

### Which order do you need?

You have rows, and inside every row you want each cell added to the same running
answer. That is one loop over the rows and another over the cells of a row.
Which of the two has to sit inside the other, and how many results lists do you
need in total?

## Starter code

```python # template
def flatten(rows: list) -> list:
    """ Return every element of every row of rows, in order, e.g. [1, 2, 3, 4] for [[1, 2], [3, 4]].

    >>> flatten([[1, 2], [3, 4]])
    [1, 2, 3, 4]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(flatten([[1, 2], [3, 4]]))
```

## Tests

```python # tests
assert flatten([[1, 2], [3, 4]]) == [1, 2, 3, 4], f"Got: {flatten([[1, 2], [3, 4]])}"
assert flatten([]) == [], f"Got: {flatten([])}"
# Only the first row would be [1, 2]: the rest of the rows must arrive too
assert flatten([[1, 2], [3], [4, 5]]) == [1, 2, 3, 4, 5], \
    f"Got: {flatten([[1, 2], [3], [4, 5]])}"
# An empty row contributes nothing, wherever it sits
assert flatten([[], [1]]) == [1], f"Got: {flatten([[], [1]])}"
assert flatten([[1], []]) == [1], f"Got: {flatten([[1], []])}"
assert flatten([[], []]) == [], f"Got: {flatten([[], []])}"
# One row only
assert flatten([[7, 8, 9]]) == [7, 8, 9], f"Got: {flatten([[7, 8, 9]])}"
# Exactly one layer comes off: a list nested deeper stays a list
assert flatten([[5, [6, 7]], [8]]) == [5, [6, 7], 8], \
    f"Got: {flatten([[5, [6, 7]], [8]])}"
assert flatten([[[1]]]) == [[1]], f"Got: {flatten([[[1]]])}"
# Order is preserved, never sorted
assert flatten([[3, 1], [2]]) == [3, 1, 2], f"Got: {flatten([[3, 1], [2]])}"
# Repeats are kept, never deduplicated
assert flatten([[1, 1], [1]]) == [1, 1, 1], f"Got: {flatten([[1, 1], [1]])}"
# A string is one element, not something to take apart
assert flatten([["ab", "cd"], ["ef"]]) == ["ab", "cd", "ef"], \
    f"Got: {flatten([['ab', 'cd'], ['ef']])}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [[_step, _step + 1] for _step in range(0, 10, 2)]
assert flatten(_generated) == [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], f"Got: {flatten(_generated)}"
# The caller's list, rows included, comes back untouched
_original = [[1, 2], [3]]
flatten(_original)
assert _original == [[1, 2], [3]], f"Got: the input became {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def flatten(rows: list) -> list:
    """ Return every element of every row of rows, in order. """
    flat = []
    for row in rows:
        for cell in row:
            flat.append(cell)
    return flat
```

### Wrong answers the tests must catch

```python # wrong: returns only the first row
def flatten(rows: list) -> list:
    if not rows:
        return []
    return rows[0]
```

```python # wrong: appends each row itself instead of its cells
def flatten(rows: list) -> list:
    flat = []
    for row in rows:
        flat.append(row)
    return flat
```

```python # wrong: keeps going down, so a nested list is taken apart too
def flatten(rows: list) -> list:
    flat = []
    for row in rows:
        for cell in row:
            if isinstance(cell, list):
                for deeper in cell:
                    flat.append(deeper)
            else:
                flat.append(cell)
    return flat
```

```python # wrong: builds on the input's first row, so the caller's list mutates
def flatten(rows: list) -> list:
    if not rows:
        return []
    flat = rows[0]
    for row in rows[1:]:
        for cell in row:
            flat.append(cell)
    return flat
```

```python # wrong: drops the first cell of every row
def flatten(rows: list) -> list:
    flat = []
    for row in rows:
        for cell in row[1:]:
            flat.append(cell)
    return flat
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+rows
flat\.append
flat\s*=\s*\[\]
```

### Shortcuts the tests reject outright

```text # banned
```
