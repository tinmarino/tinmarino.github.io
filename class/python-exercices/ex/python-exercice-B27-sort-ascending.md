---
title: "Python B27 - Sort a List Ascending"
---

# Sort a List Ascending

## Instructions

Write a function `sort_up(lst: list) -> list` that returns a new list with the numbers of `lst` in ascending order. Do **not** use `sorted()` or `.sort()`.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

Put a list of numbers in order from smallest to largest, and hand back a new list.
Sort it yourself.

### Rules

- Do **not** use `sorted()` or `.sort()`. Ordering the numbers yourself is the exercise.
- Build a **new** list; the list you were given must come back unchanged.
- Duplicates stay: `[2, 2, 1]` becomes `[1, 2, 2]`.

### Examples

| Call | Returns |
|---|---|
| `sort_up([3, 1, 2])` | `[1, 2, 3]` |
| `sort_up([2, 2, 1])` | `[1, 2, 2]` |
| `sort_up([5])` | `[5]` |
| `sort_up([])` | `[]` |

### Things you will need

Finding the smallest number of a list is the same loop you used to find the largest
in `B20`, with the comparison turned around.

Once you have the smallest, you can take it out of a list and set it aside:

```python
letters = ["a", "b", "c"]
letters.remove("b")
print(letters)
```

### Which order do you need?

If you repeatedly pull the smallest number that is left and add it to the answer,
what order does the answer come out in?

## Starter code

```python # template
def sort_up(lst: list) -> list:
    """ Return a new ascending list of lst's numbers, e.g. [1, 2, 3] for [3, 1, 2].

    >>> sort_up([3, 1, 2])
    [1, 2, 3]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(sort_up([3, 1, 2, 5, 4]))
```

## Tests

```python # tests
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("sorted(", ".sort(")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert sort_up([3, 1, 2]) == [1, 2, 3], f"Got: {sort_up([3, 1, 2])}"
assert sort_up([2, 2, 1]) == [1, 2, 2], f"Got: {sort_up([2, 2, 1])}"
assert sort_up([5]) == [5], f"Got: {sort_up([5])}"
assert sort_up([]) == [], f"Got: {sort_up([])}"
assert sort_up([-1, -3, 0]) == [-3, -1, 0], f"Got: {sort_up([-1, -3, 0])}"
assert sort_up([5, 3, 9, 1]) == [1, 3, 5, 9], f"Got: {sort_up([5, 3, 9, 1])}"
_src = [3, 1, 2]
sort_up(_src)
assert _src == [3, 1, 2], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def sort_up(lst: list) -> list:
    """ Return a new ascending list of lst's numbers, e.g. [1, 2, 3] for [3, 1, 2]. """
    remaining = list(lst)
    result = []
    while remaining:
        smallest = remaining[0]
        for number in remaining:
            if number < smallest:
                smallest = number
        remaining.remove(smallest)
        result.append(smallest)
    return result
```

### Wrong answers the tests must catch

```python # wrong: calls sorted(), the shortcut
def sort_up(lst: list) -> list:
    """ Hands the work to sorted. """
    return sorted(lst)
```

```python # wrong: sorts a copy with list.sort(), still the shortcut
def sort_up(lst: list) -> list:
    """ Uses .sort() on a copy. """
    copy = list(lst)
    copy.sort()
    return copy
```

```python # wrong: pulls the largest each time, so it comes out descending
def sort_up(lst: list) -> list:
    """ Comparison the wrong way, so it sorts high to low. """
    remaining = list(lst)
    result = []
    while remaining:
        biggest = remaining[0]
        for number in remaining:
            if number > biggest:
                biggest = number
        remaining.remove(biggest)
        result.append(biggest)
    return result
```

### Give-aways the Description must never contain

```text # forbidden
sorted\(
\.sort\(
<\s*smallest
```

### Shortcuts the tests reject outright

```text # banned
sorted(
.sort(
```
