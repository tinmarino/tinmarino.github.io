---
title: "Python H60 - Biggest in the Whole Grid"
---

# Biggest in the Whole Grid

## Instructions

Write a function `grid_max(rows: list) -> int` that returns the biggest number found anywhere in a list of lists, or `0` when there is no number at all. Do not use `max(`.

Find it yourself with a loop. Return the number, do not print it.

## Description

### Goal

A grid arrives as a list of rows, and each row is a list of numbers. You want
the single biggest number in the whole thing, wherever it hides.

`[[1, 9], [4, 2]]` gives `9`.

### Rules

- Look in **every** row, not just the first one. The winner is often further down.
- The rows may have different lengths. Some may even be empty.
- When the grid holds no number at all &mdash; it is empty, or every row is
  empty &mdash; return `0`.
- The numbers may all be negative. `0` is the answer only when there is nothing
  to compare, never a floor that a real number has to beat.
- Do **not** use `max(`: writing the comparison is the exercise.

### Examples

| Call | Returns |
|---|---|
| `grid_max([[1, 9], [4, 2]])` | `9` |
| `grid_max([[1, 2], [9]])` | `9` |
| `grid_max([[1], [5, 2, 7]])` | `7` |
| `grid_max([[-5, -3], [-9]])` | `-3` |
| `grid_max([])` | `0` |
| `grid_max([[], []])` | `0` |

Read the fourth row carefully. Every number is below zero, and the answer is
still one of them.

### Things you will need

A loop inside a loop visits every value of every row. The outer turn hands you a
row; the inner turn hands you one number of that row:

```python
for group in [["a", "b"], ["c"]]:
    for letter in group:
        print(letter)
```

Holding on to the best value you have seen so far is the pattern from `B20`,
where you found the biggest number of a single flat list.

### Which order do you need?

You need a champion, and you need to know whether you have one yet. What do you
do the very first time you meet a number, and what do you do every time after?

## Starter code

```python # template
def grid_max(rows: list) -> int:
    """ Return the biggest number anywhere in rows, or 0 when there is none.

    >>> grid_max([[1, 9], [4, 2]])
    9
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(grid_max([[1, 9], [4, 2]]))
```

## Tests

```python # tests
# Finding it yourself is the exercise, so Check refuses the shortcut.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("max(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert grid_max([[1, 9], [4, 2]]) == 9, f"Got: {grid_max([[1, 9], [4, 2]])}"
# The winner is NOT in the first row, so scanning one row is caught
assert grid_max([[1, 2], [9]]) == 9, f"Got: {grid_max([[1, 2], [9]])}"
assert grid_max([[1, 2], [3, 4], [99]]) == 99, f"Got: {grid_max([[1, 2], [3, 4], [99]])}"
# The winner IS in the first row, so stopping too late is caught too
assert grid_max([[99], [1, 2]]) == 99, f"Got: {grid_max([[99], [1, 2]])}"
# Ragged rows of different lengths
assert grid_max([[1], [5, 2, 7]]) == 7, f"Got: {grid_max([[1], [5, 2, 7]])}"
assert grid_max([[8, 1, 1, 1], [2]]) == 8, f"Got: {grid_max([[8, 1, 1, 1], [2]])}"
# Every number is negative: a champion seeded at 0 is never beaten and fails here
assert grid_max([[-5, -3], [-9]]) == -3, f"Got: {grid_max([[-5, -3], [-9]])}"
assert grid_max([[-1]]) == -1, f"Got: {grid_max([[-1]])}"
assert grid_max([[-100], [-200, -300]]) == -100, f"Got: {grid_max([[-100], [-200, -300]])}"
# Zero as a real answer, sitting among negatives
assert grid_max([[-8], [0, -8]]) == 0, f"Got: {grid_max([[-8], [0, -8]])}"
# No number anywhere
assert grid_max([]) == 0, f"Got: {grid_max([])}"
assert grid_max([[]]) == 0, f"Got: {grid_max([[]])}"
assert grid_max([[], []]) == 0, f"Got: {grid_max([[], []])}"
# An empty row in the middle must not stop the search
assert grid_max([[1], [], [7]]) == 7, f"Got: {grid_max([[1], [], [7]])}"
assert grid_max([[], [4]]) == 4, f"Got: {grid_max([[], [4]])}"
# One row, one number
assert grid_max([[3]]) == 3, f"Got: {grid_max([[3]])}"
# All equal
assert grid_max([[2, 2], [2]]) == 2, f"Got: {grid_max([[2, 2], [2]])}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [[(_step * 37) % 101 - 50] for _step in range(101)]
assert grid_max(_generated) == 50, f"Got: {grid_max(_generated)}"
# The grid must come back untouched
_original = [[1, 9], [4, 2]]
grid_max(_original)
assert _original == [[1, 9], [4, 2]], f"Got: the grid was modified into {_original}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def grid_max(rows: list) -> int:
    """ Return the biggest number anywhere in rows, or 0 when there is none. """
    champion = 0
    found = False
    for row in rows:
        for number in row:
            if not found or number > champion:
                champion = number
                found = True
    return champion
```

### Wrong answers the tests must catch

```python # wrong: calls max() instead of comparing
def grid_max(rows: list) -> int:
    """ Uses the banned shortcut. """
    best = 0
    for row in rows:
        for number in row:
            if number > best:
                best = max(number, best)
    return best
```

```python # wrong: starts the champion at zero, so an all-negative grid loses
def grid_max(rows: list) -> int:
    """ Treats 0 as a floor every number must beat. """
    champion = 0
    for row in rows:
        for number in row:
            if number > champion:
                champion = number
    return champion
```

```python # wrong: only looks inside the first row
def grid_max(rows: list) -> int:
    """ Forgets that the grid has more than one row. """
    if not rows:
        return 0
    champion = 0
    found = False
    for number in rows[0]:
        if not found or number > champion:
            champion = number
            found = True
    return champion
```

```python # wrong: compares the wrong way round and finds the smallest
def grid_max(rows: list) -> int:
    """ The comparison points the wrong way. """
    champion = 0
    found = False
    for row in rows:
        for number in row:
            if not found or number < champion:
                champion = number
                found = True
    return champion
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+rows\b
champion\s*=\s*number
number\s*>\s*champion
\bmax\(
```

### Shortcuts the tests reject outright

```text # banned
max(
```
