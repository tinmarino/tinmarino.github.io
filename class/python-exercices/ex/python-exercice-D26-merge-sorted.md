---
title: "Python D26 - Merge Two Sorted Lists"
---

# Merge Two Sorted Lists

## Instructions

Write a function `merge(first: list, second: list) -> list` that returns one sorted list holding every element of two lists that are already sorted, keeping duplicates, without calling `sorted(` or `.sort(`.

## Description

### Goal

You are handed two lists, each already in order, and asked for one list that holds
every element of both, still in order. Nothing is thrown away, so a value that
appears twice keeps both copies.

### Rules

- Both `first` and `second` arrive already sorted. You do not have to check that.
- Return one new list, in order, with every element from both. Duplicates are kept.
- Neither `first` nor `second` may come out changed.
- Build the order yourself &mdash; do **not** call `sorted(` or `.sort(` anywhere.

### Examples

| Call | Returns |
|---|---|
| `merge([1, 4], [2, 3, 5])` | `[1, 2, 3, 4, 5]` |
| `merge([], [1, 2])` | `[1, 2]` |
| `merge([1], [1])` | `[1, 1]` |
| `merge([], [])` | `[]` |
| `merge([2, 2], [2])` | `[2, 2, 2]` |

### Things you will need

Two separate counters can walk two separate lists at the same time, each stopping
at its own list's length:

```python
letters = ["a", "c", "e"]
digits = ["1", "3"]
pos_letter, pos_digit = 0, 0
while pos_letter < len(letters) and pos_digit < len(digits):
    print(letters[pos_letter], digits[pos_digit])
    pos_letter += 1
    pos_digit += 1
```

That loop stops as soon as either counter runs out, even though one list may still
have elements left in it. A slice with only a start takes everything from that
position to the end, and `extend` adds every element of one list onto another,
one at a time:

```python
tail = ["x", "y", "z"]
basket = ["a", "b"]
basket.extend(tail[1:])
print(basket)          # prints ['a', 'b', 'y', 'z']
```

### Which finger moves?

At every step you are looking at one element from each list: whichever one
`first` is up to, and whichever one `second` is up to. Exactly one of those two
elements belongs next in the result &mdash; the smaller of the two, since both lists
are already sorted. Once you have placed it, only the finger that pointed at it
has anything left to do. What happens to the other finger, and what do you do
once one list runs out and the other still has elements left in it?

## Starter code

```python # template
def merge(first: list, second: list) -> list:
    """ Return one sorted list holding every element of first and second.

    >>> merge([1, 4], [2, 3, 5])
    [1, 2, 3, 4, 5]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(merge([1, 4], [2, 3, 5]))
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
         for _b in ("sorted(", ".sort(")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

# Both empty, then one side empty
assert merge([], []) == [], f"Got: {merge([], [])}"
assert merge([], [1, 2]) == [1, 2], f"Got: {merge([], [1, 2])}"
assert merge([1, 2], []) == [1, 2], f"Got: {merge([1, 2], [])}"
# A single element on each side
assert merge([1], [1]) == [1, 1], f"Got: {merge([1], [1])}"
assert merge([1], [2]) == [1, 2], f"Got: {merge([1], [2])}"
assert merge([2], [1]) == [1, 2], f"Got: {merge([2], [1])}"
# The worked example, and duplicates kept on both sides
assert merge([1, 4], [2, 3, 5]) == [1, 2, 3, 4, 5], f"Got: {merge([1, 4], [2, 3, 5])}"
assert merge([2, 2], [2]) == [2, 2, 2], f"Got: {merge([2, 2], [2])}"
assert merge([1, 1, 3], [1, 2]) == [1, 1, 1, 2, 3], f"Got: {merge([1, 1, 3], [1, 2])}"
# One side runs out well before the other
assert merge([1, 2, 3], [10]) == [1, 2, 3, 10], f"Got: {merge([1, 2, 3], [10])}"
assert merge([10], [1, 2, 3]) == [1, 2, 3, 10], f"Got: {merge([10], [1, 2, 3])}"
# Every element of one side is smaller than every element of the other
assert merge([1, 2, 3], [4, 5, 6]) == [1, 2, 3, 4, 5, 6], \
    f"Got: {merge([1, 2, 3], [4, 5, 6])}"
assert merge([4, 5, 6], [1, 2, 3]) == [1, 2, 3, 4, 5, 6], \
    f"Got: {merge([4, 5, 6], [1, 2, 3])}"
# Negative numbers are ordered like any other
assert merge([-5, -1, 2], [-3, 0, 4]) == [-5, -3, -1, 0, 2, 4], \
    f"Got: {merge([-5, -1, 2], [-3, 0, 4])}"
# Interleaved, alternating which side supplies the next element
assert merge([1, 3, 5, 7], [2, 4, 6, 8]) == [1, 2, 3, 4, 5, 6, 7, 8], \
    f"Got: {merge([1, 3, 5, 7], [2, 4, 6, 8])}"
# Built rather than written out, so a memorised table cannot masquerade as an answer
_evens = list(range(0, 40, 2))
_odds = list(range(1, 40, 2))
assert merge(_evens, _odds) == list(range(40)), f"Got: {merge(_evens, _odds)}"
# Neither input list is changed
_first = [1, 4]
_second = [2, 3, 5]
assert merge(_first, _second) == [1, 2, 3, 4, 5], f"Got: {merge(_first, _second)}"
assert _first == [1, 4], f"Got: first was changed into {_first}"
assert _second == [2, 3, 5], f"Got: second was changed into {_second}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def merge(first: list, second: list) -> list:
    """ Return one sorted list holding every element of first and second. """
    result = []
    pos_first, pos_second = 0, 0
    while pos_first < len(first) and pos_second < len(second):
        if first[pos_first] <= second[pos_second]:
            result.append(first[pos_first])
            pos_first += 1
        else:
            result.append(second[pos_second])
            pos_second += 1
    result.extend(first[pos_first:])
    result.extend(second[pos_second:])
    return result
```

### Wrong answers the tests must catch

```python # wrong: calls sorted() on the concatenation, so lists of unequal length
# still pass by luck but a genuinely different pair does not compare equal element
# for element the way the reference builds it -- caught by the built-up case
def merge(first: list, second: list) -> list:
    return sorted(first) + sorted(second)
```

```python # wrong: sorts each input in place with .sort(), so the caller's own
# lists come back changed even though the merged result is correct
def merge(first: list, second: list) -> list:
    first.sort()
    second.sort()
    result = []
    pos_first, pos_second = 0, 0
    while pos_first < len(first) and pos_second < len(second):
        if first[pos_first] <= second[pos_second]:
            result.append(first[pos_first])
            pos_first += 1
        else:
            result.append(second[pos_second])
            pos_second += 1
    result.extend(first[pos_first:])
    result.extend(second[pos_second:])
    return result
```

```python # wrong: forgets the leftovers, so whichever side runs out first drops
# the rest of the other side on the floor
def merge(first: list, second: list) -> list:
    result = []
    pos_first, pos_second = 0, 0
    while pos_first < len(first) and pos_second < len(second):
        if first[pos_first] <= second[pos_second]:
            result.append(first[pos_first])
            pos_first += 1
        else:
            result.append(second[pos_second])
            pos_second += 1
    return result
```

```python # wrong: moves both fingers on every step, so half of one list is skipped
def merge(first: list, second: list) -> list:
    result = []
    pos_first, pos_second = 0, 0
    while pos_first < len(first) and pos_second < len(second):
        if first[pos_first] <= second[pos_second]:
            result.append(first[pos_first])
        else:
            result.append(second[pos_second])
        pos_first += 1
        pos_second += 1
    result.extend(first[pos_first:])
    result.extend(second[pos_second:])
    return result
```

```python # wrong: consumes the caller's lists with pop(0) instead of walking them
def merge(first: list, second: list) -> list:
    result = []
    while first and second:
        if first[0] <= second[0]:
            result.append(first.pop(0))
        else:
            result.append(second.pop(0))
    result.extend(first)
    result.extend(second)
    return result
```

### Give-aways the Description must never contain

```text # forbidden
pos_first
pos_second
while\s+pos\w*\s*<\s*len\(first\)
first\[pos\w*\]\s*<=\s*second\[pos\w*\]
result\.append\(first\[
result\.append\(second\[
result\.extend\(first\[
result\.extend\(second\[
two[- ]pointer
```

### Shortcuts the tests reject outright

```text # banned
sorted(
.sort(
```
