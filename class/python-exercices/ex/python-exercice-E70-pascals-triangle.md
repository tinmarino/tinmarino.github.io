---
title: "Python E70 - Pascal's Triangle"
---

# Pascal's Triangle

## Instructions

Write a function `pascal(rows: int) -> list` that returns the first `rows` rows of Pascal's triangle, each row a list of ints.

## Description

### Goal

Pascal's triangle is a triangle of numbers where every row starts and ends with `1`,
and every number strictly inside a row is the sum of the two numbers above it.

```text
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1
```

Your function takes how many rows to build and returns them as a list of lists, top
row first.

### Rules

- `rows` is `0` or a positive int. `pascal(0)` returns `[]`: no rows at all.
- Row `0` is `[1]`, the shortest row there is.
- Every row starts and ends with `1`.
- Every number strictly between the two ends is the sum of the number above it and
  the number above-and-to-the-left of it &mdash; the two numbers directly above it in
  the row before.
- `return` the list of rows, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `pascal(1)` | `[[1]]` |
| `pascal(4)` | `[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]` |
| `pascal(0)` | `[]` |
| `pascal(5)` | `[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]` |

Look at row `[1, 3, 3, 1]` turning into `[1, 4, 6, 4, 1]`. The middle `4` is
`1 + 3`, the two numbers above it in the row before; the middle `6` is `3 + 3`.

### Things you will need

You will build each row by walking the row before it and looking at *two*
neighbouring numbers at once. `zip` pairs a list up with a shifted copy of itself,
one neighbour at a time:

```python
seq = [10, 20, 30, 40]
for left, right in zip(seq, seq[1:]):
    print(left, right)        # (10, 20) then (20, 30) then (30, 40)
```

You will also want to grow a list one row at a time, keeping the ones already
built:

```python
history = []
history.append(["a"])
history.append(["a", "b"])
print(history)                 # [['a'], ['a', 'b']]
```

### What is the very first row, and what does every other row start from?

## Starter code

```python # template
def pascal(rows: int) -> list:
    """ Return the first rows rows of Pascal's triangle.

    >>> pascal(4)
    [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(pascal(5))
```

## Tests

```python # tests
assert pascal(0) == [], f"Got: {pascal(0)}"
assert pascal(1) == [[1]], f"Got: {pascal(1)}"
assert pascal(2) == [[1], [1, 1]], f"Got: {pascal(2)}"
assert pascal(3) == [[1], [1, 1], [1, 2, 1]], f"Got: {pascal(3)}"
assert pascal(4) == [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]], f"Got: {pascal(4)}"
row_5 = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]
assert pascal(5) == row_5, f"Got: {pascal(5)}"
row_6 = row_5 + [[1, 5, 10, 10, 5, 1]]
assert pascal(6) == row_6, f"Got: {pascal(6)}"
# Every row must be its own new list, not the same list reused each time
rows = pascal(3)
assert rows[0] is not rows[1], "Got: the same list object reused for two rows"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def pascal(rows: int) -> list:
    """ Return the first rows rows of Pascal's triangle. """
    triangle = []
    for _ in range(rows):
        if not triangle:
            triangle.append([1])
            continue
        previous = triangle[-1]
        row = [1] + [left + right for left, right in zip(previous, previous[1:])] + [1]
        triangle.append(row)
    return triangle
```

### Wrong answers the tests must catch

```python # wrong: off by one, builds one row too many
def pascal(rows: int) -> list:
    triangle = [[1]]
    for _ in range(rows):
        previous = triangle[-1]
        row = [1] + [left + right for left, right in zip(previous, previous[1:])] + [1]
        triangle.append(row)
    return triangle
```

```python # wrong: forgets the rows == 0 case and always returns at least one row
def pascal(rows: int) -> list:
    triangle = [[1]]
    for _ in range(rows - 1):
        previous = triangle[-1]
        row = [1] + [left + right for left, right in zip(previous, previous[1:])] + [1]
        triangle.append(row)
    return triangle
```

```python # wrong: pairs each number with itself instead of its neighbour
def pascal(rows: int) -> list:
    triangle = []
    for _ in range(rows):
        if not triangle:
            triangle.append([1])
            continue
        previous = triangle[-1]
        row = [1] + [left + left for left in previous[1:]] + [1]
        triangle.append(row)
    return triangle
```

```python # wrong: grows each row by tacking on a 1 instead of summing the neighbours above
def pascal(rows: int) -> list:
    triangle = []
    row = [1]
    for _ in range(rows):
        triangle.append(row)
        row = row + [1]
    return triangle
```

### Give-aways the Description must never contain

```text # forbidden
zip\(previous, previous\[1:\]\)
\[1\]\s*\+\s*\[
left\s*\+\s*right\s+for\s+left,\s*right
triangle\.append\(row\)
if\s+not\s+triangle
```

### Shortcuts the tests reject outright

```text # banned
```
