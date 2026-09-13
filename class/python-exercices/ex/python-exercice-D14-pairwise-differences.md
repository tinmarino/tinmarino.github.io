---
title: "Python D14 - Pairwise Differences"
---

# Pairwise Differences

## Instructions

Write a function `diffs(lst: list) -> list` that returns the gaps between consecutive elements of `lst`: element two minus element one, element three minus element two, and so on.

A list with fewer than two elements has no neighbours to compare, so it returns the empty list.

## Description

### Goal

A stock ticker does not print how much a share is worth on each tick; it prints how much
it moved since the last one. Given a list of numbers, return the list of differences
between each element and the one right before it.

### Rules

- The result has one fewer element than `lst`: there is no gap before the first number.
- Each element of the result is the current number minus the one right before it, in order.
- A list of zero or one element has no pair to compare, so return `[]`.
- Return a new list. Do not print anything, and do not modify `lst`.

### Examples

| Call | Returns |
|---|---|
| `diffs([1, 4, 9, 16])` | `[3, 5, 7]` |
| `diffs([5, 5])` | `[0]` |
| `diffs([7])` | `[]` |
| `diffs([])` | `[]` |
| `diffs([10, 7, 7, 12])` | `[-3, 0, 5]` |

### Things you will need

`range` can start somewhere other than zero, which is how you walk a list while always
having last turn's index within reach:

```python
readings = ["mon", "tue", "wed", "thu"]
for day in range(1, len(readings)):
    print(readings[day], "follows", readings[day - 1])
```

A gap can be negative, and that is not an error &mdash; it just means the value went down:

```python
print(2 - 9)   # prints -7
```

Building a new list one element at a time, instead of writing it out in full, is
`append`:

```python
found = []
for letter in "cab":
    found.append(letter.upper())
print(found)   # prints ['C', 'A', 'B']
```

### How many gaps does a list of four numbers have?

Four numbers sit between three gaps, not four. Where does your loop have to start, and
where does it have to stop, so it visits exactly those three and never reaches past the
end of the list?

## Starter code

```python # template
def diffs(lst: list) -> list:
    """ Return the gaps between consecutive elements of lst.

    >>> diffs([1, 4, 9, 16])
    [3, 5, 7]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(diffs([1, 4, 9, 16]))
```

## Tests

```python # tests
assert diffs([]) == [], f"Got: {diffs([])}"
assert diffs([7]) == [], f"Got: {diffs([7])}"
assert diffs([5, 5]) == [0], f"Got: {diffs([5, 5])}"
assert diffs([1, 4, 9, 16]) == [3, 5, 7], f"Got: {diffs([1, 4, 9, 16])}"
assert diffs([10, 7, 7, 12]) == [-3, 0, 5], f"Got: {diffs([10, 7, 7, 12])}"
# Every gap negative: a steady decline
assert diffs([9, 6, 3, 0]) == [-3, -3, -3], f"Got: {diffs([9, 6, 3, 0])}"
# Rises and falls mixed in the same walk
assert diffs([3, 8, 2, 2, 9]) == [5, -6, 0, 7], f"Got: {diffs([3, 8, 2, 2, 9])}"
# Negative numbers in the input itself
assert diffs([-5, -2, -2, 1]) == [3, 0, 3], f"Got: {diffs([-5, -2, -2, 1])}"
# The input list must come out unchanged
_given = [2, 4, 4, 9]
assert diffs(_given) == [2, 0, 5], f"Got: {diffs(_given)}"
assert _given == [2, 4, 4, 9], f"Got: the input was modified into {_given}"
# Long enough that a written-out table of the test inputs cannot masquerade as an answer
_climb = list(range(0, 200, 3))
assert diffs(_climb) == [3] * (len(_climb) - 1), f"Got: {diffs(_climb)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def diffs(lst: list) -> list:
    """ Return the gaps between consecutive elements of lst. """
    gaps = []
    for pos in range(1, len(lst)):
        gaps.append(lst[pos] - lst[pos - 1])
    return gaps
```

### Wrong answers the tests must catch

```python # wrong: subtracts in the wrong direction
def diffs(lst: list) -> list:
    gaps = []
    for pos in range(1, len(lst)):
        gaps.append(lst[pos - 1] - lst[pos])
    return gaps
```

```python # wrong: starts one index too early and reuses the first element as its own neighbour
def diffs(lst: list) -> list:
    gaps = []
    for pos in range(0, len(lst)):
        gaps.append(lst[pos] - lst[pos - 1])
    return gaps
```

```python # wrong: off by one at the end, drops the last gap
def diffs(lst: list) -> list:
    gaps = []
    for pos in range(1, len(lst) - 1):
        gaps.append(lst[pos] - lst[pos - 1])
    return gaps
```

```python # wrong: compares each element to the first one instead of the one right before it
def diffs(lst: list) -> list:
    gaps = []
    for pos in range(1, len(lst)):
        gaps.append(lst[pos] - lst[0])
    return gaps
```

```python # wrong: mutates the input while building the result
def diffs(lst: list) -> list:
    gaps = []
    while len(lst) > 1:
        first = lst.pop(0)
        gaps.append(lst[0] - first)
    return gaps
```

### Give-aways the Description must never contain

```text # forbidden
range\(1,\s*len\(lst\)\)
lst\[pos\]\s*-\s*lst\[pos\s*-\s*1\]
gaps\s*=\s*\[\]
gaps\.append\(
```

### Shortcuts the tests reject outright

None: there is no one-liner that skips this lesson.

```text # banned
```
