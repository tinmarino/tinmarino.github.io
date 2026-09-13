---
title: "Python D16 - Is It Sorted"
---

# Is It Sorted

## Instructions

Write a function `is_sorted(lst: list) -> bool` that returns `True` when `lst` is in non-decreasing order.

Return the answer, do not print it. **Check** refuses `sorted(` &mdash; comparing the list against its own sorted copy answers the question, but it skips the lesson.

## Description

### Goal

Before a spreadsheet lets you assume a column is in order, something checked. Given a list, return `True` when it is already sorted from smallest to largest, and `False` when it is not.

### Rules

- "Non-decreasing" means each element is no smaller than the one before it. Equal neighbours are fine: `[2, 2, 3]` counts as sorted.
- The empty list and a list with one element both count as sorted &mdash; there is no pair to disagree.
- Return `True` or `False`. Do not print anything.
- Build it yourself &mdash; do **not** use `sorted(`.

### Examples

| Call | Returns |
|---|---|
| `is_sorted([1, 2, 2, 3])` | `True` |
| `is_sorted([1, 3, 2])` | `False` |
| `is_sorted([])` | `True` |
| `is_sorted([5])` | `True` |
| `is_sorted([3, 3, 3])` | `True` |
| `is_sorted([9, 8])` | `False` |

### Things you will need

You need to look at two elements at once: one and the one right after it. Walking the *indices* rather than the elements gives you both:

```python
crew = ["Ada", "Bo", "Cy"]
for pos in range(len(crew) - 1):
    print(crew[pos], crew[pos + 1])
```

`range(len(crew) - 1)` stops one short of the end on purpose &mdash; the last element has nobody after it to compare against. `and` lets you keep several conditions true across a loop, folding into one running answer:

```python
def all_positive(nums: list) -> bool:
    """ Return True when every number in nums is positive. """
    still_positive = True
    for num in nums:
        still_positive = still_positive and num > 0
    return still_positive


print(all_positive([4, 9, 2, 7]))   # prints True
```

### One bad pair is enough

You do not need to know the whole list is sorted to know it is *not*. The moment you find one neighbour smaller than the one before it, the answer is already settled. What does that let you do the instant you find it, instead of waiting for the loop to finish?

## Starter code

```python # template
def is_sorted(lst: list) -> bool:
    """ Return True when lst is in non-decreasing order.

    >>> is_sorted([1, 2, 2, 3])
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(is_sorted([1, 2, 2, 3]))
```

## Tests

```python # tests
# Refuse the shortcuts that skip the lesson. __student_code__ is the student's own
# source, injected by the app and the verifier; strip its docstrings and comments
# so a note to yourself is never mistaken for the real thing, then match each
# construct whitespace-insensitively and on a word boundary, so a stray space
# cannot slip a banned call past the ban that names it.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("sorted(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

# The answer is a bool, not a number that happens to be truthy
assert isinstance(is_sorted([1, 2]), bool), f"Got: {type(is_sorted([1, 2]))}"
# Nothing to disagree: empty and single element
assert is_sorted([]) is True, f"Got: {is_sorted([])}"
assert is_sorted([5]) is True, f"Got: {is_sorted([5])}"
assert is_sorted([0]) is True, f"Got: {is_sorted([0])}"
# Equal neighbours count as sorted
assert is_sorted([2, 2, 3]) is True, f"Got: {is_sorted([2, 2, 3])}"
assert is_sorted([3, 3, 3]) is True, f"Got: {is_sorted([3, 3, 3])}"
# Two elements, both orders
assert is_sorted([1, 2]) is True, f"Got: {is_sorted([1, 2])}"
assert is_sorted([9, 8]) is False, f"Got: {is_sorted([9, 8])}"
# A clean run
assert is_sorted([1, 2, 2, 3]) is True, f"Got: {is_sorted([1, 2, 2, 3])}"
assert is_sorted([1, 2, 3, 4, 5]) is True, f"Got: {is_sorted([1, 2, 3, 4, 5])}"
# One bad pair, in different places
assert is_sorted([1, 3, 2]) is False, f"Got: {is_sorted([1, 3, 2])}"
assert is_sorted([3, 1, 2]) is False, f"Got: {is_sorted([3, 1, 2])}"
assert is_sorted([1, 2, 3, 2]) is False, f"Got: {is_sorted([1, 2, 3, 2])}"
# Sorted for a long stretch, then it drops right at the end
assert is_sorted([1, 2, 3, 4, 5, 6, 7, 0]) is False, \
    f"Got: {is_sorted([1, 2, 3, 4, 5, 6, 7, 0])}"
# Strictly decreasing throughout
assert is_sorted([5, 4, 3, 2, 1]) is False, f"Got: {is_sorted([5, 4, 3, 2, 1])}"
# Negative numbers work the same way
assert is_sorted([-3, -1, 0, 2]) is True, f"Got: {is_sorted([-3, -1, 0, 2])}"
assert is_sorted([-1, -3, 0, 2]) is False, f"Got: {is_sorted([-1, -3, 0, 2])}"
# Built rather than written out, so a memorised table cannot masquerade as an answer
_long_sorted = list(range(100, 140))
assert is_sorted(_long_sorted) is True, f"Got: {is_sorted(_long_sorted)}"
_long_broken = list(range(100, 140))
_long_broken[30], _long_broken[31] = _long_broken[31], _long_broken[30]
assert is_sorted(_long_broken) is False, f"Got: {is_sorted(_long_broken)}"
# The input must come out unchanged
_given = [1, 3, 2]
assert is_sorted(_given) is False, f"Got: {is_sorted(_given)}"
assert _given == [1, 3, 2], f"Got: the input was modified into {_given}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def is_sorted(lst: list) -> bool:
    """ Return True when lst is in non-decreasing order. """
    for pos in range(len(lst) - 1):
        if lst[pos] > lst[pos + 1]:
            return False
    return True
```

### Wrong answers the tests must catch

```python # wrong: strict comparison, so equal neighbours are rejected
def is_sorted(lst: list) -> bool:
    for pos in range(len(lst) - 1):
        if lst[pos] >= lst[pos + 1]:
            return False
    return True
```

```python # wrong: only looks at the first pair, ignoring the rest of the list
def is_sorted(lst: list) -> bool:
    if len(lst) < 2:
        return True
    return lst[0] <= lst[1]
```

```python # wrong: overwrites the verdict instead of keeping the first failure
def is_sorted(lst: list) -> bool:
    verdict = True
    for pos in range(len(lst) - 1):
        verdict = lst[pos] <= lst[pos + 1]
    return verdict
```

```python # wrong: compares each element to the first instead of its neighbour
def is_sorted(lst: list) -> bool:
    for pos in range(len(lst) - 1):
        if lst[0] > lst[pos + 1]:
            return False
    return True
```

```python # wrong: compares the direction backwards, catching decreases as increases
def is_sorted(lst: list) -> bool:
    for pos in range(len(lst) - 1):
        if lst[pos] < lst[pos + 1]:
            return False
    return True
```

```python # wrong: mutates the input while checking it
def is_sorted(lst: list) -> bool:
    for pos in range(len(lst) - 1):
        if lst[pos] > lst[pos + 1]:
            lst.pop()
            return False
    return True
```

### Give-aways the Description must never contain

```text # forbidden
range\(len\(lst\)\s*-\s*1\)
lst\[pos\]\s*>\s*lst\[pos\s*\+\s*1\]
lst\[pos\s*\+\s*1\]
return\s+False
sorted\(lst\)
lst\s*==\s*sorted
```

### Shortcuts the tests reject outright

```text # banned
sorted(
```
