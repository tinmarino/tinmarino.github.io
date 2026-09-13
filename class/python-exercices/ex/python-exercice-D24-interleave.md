---
title: "Python D24 - Interleave Two Lists"
---

# Interleave Two Lists

## Instructions

Write a function `interleave(first: list, second: list) -> list` that weaves the two lists together one element at a time. When one list runs out, the whole tail of the other is appended.

Return the new list, do not print it.

## Description

### Goal

Two people are walking side by side, one step each, in turn. Every step one of them
takes lands in the same order it was taken. If one of them reaches the end first, the
other just keeps walking alone and every remaining step still counts.

`interleave` does that to two lists: take one element from `first`, then one from
`second`, then one from `first` again, and so on, until both lists are used up.

### Rules

- Take elements strictly in turn: `first[0]`, `second[0]`, `first[1]`, `second[1]`, ...
- When one list has no more elements, stop alternating and append everything that is
  still left in the other list, in its own order.
- Neither `first` nor `second` may be modified. Return a new list.
- The lists do not have to be the same length, and either one may be empty.

### Examples

| Call | Returns |
|---|---|
| `interleave([1, 2], ["a", "b"])` | `[1, "a", 2, "b"]` |
| `interleave([1], ["a", "b", "c"])` | `[1, "a", "b", "c"]` |
| `interleave([1, 2, 3], [])` | `[1, 2, 3]` |
| `interleave([], ["a", "b"])` | `["a", "b"]` |
| `interleave([], [])` | `[]` |

### Things you will need

You need to walk both lists by position, not by content, since you are reading one
from each in turn:

```python
letters = ["x", "y", "z"]
digits = [9, 8]
for pos in range(3):
    if pos < len(letters):
        print(letters[pos])
```

`min` and `max` tell you the smaller or larger of two numbers, which is handy for
finding how far both lists can be walked together before one of them runs dry:

```python
print(min(3, 5))   # prints 3
print(max(3, 5))   # prints 5
```

A slice with only a start gives you everything from that position to the end &mdash;
exactly the shape of "whatever tail is left":

```python
tail = ["p", "q", "r", "s"]
print(tail[2:])   # prints ['r', 's']
```

### How far can you walk in step?

Both lists can be read side by side only up to the length of the **shorter** one.
After that, only one of them still has anything left. How do you find where that
switch happens, and how do you grab everything on the other side of it in one go?

## Starter code

```python # template
def interleave(first: list, second: list) -> list:
    """ Return first and second woven together one element at a time.

    >>> interleave([1, 2], ["a", "b"])
    [1, 'a', 2, 'b']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(interleave([1, 2, 3], ["a", "b"]))
```

## Tests

```python # tests
assert interleave([1, 2], ["a", "b"]) == [1, "a", 2, "b"], \
    f"Got: {interleave([1, 2], ['a', 'b'])}"
assert interleave([1], ["a", "b", "c"]) == [1, "a", "b", "c"], \
    f"Got: {interleave([1], ['a', 'b', 'c'])}"
assert interleave([], []) == [], f"Got: {interleave([], [])}"
# One side empty
assert interleave([1, 2, 3], []) == [1, 2, 3], f"Got: {interleave([1, 2, 3], [])}"
assert interleave([], ["a", "b"]) == ["a", "b"], f"Got: {interleave([], ['a', 'b'])}"
# Single elements
assert interleave([1], []) == [1], f"Got: {interleave([1], [])}"
assert interleave([], [1]) == [1], f"Got: {interleave([], [1])}"
assert interleave([1], [2]) == [1, 2], f"Got: {interleave([1], [2])}"
# Equal length, longer
_first = [1, 2, 3, 4]
_second = ["a", "b", "c", "d"]
assert interleave(_first, _second) == [1, "a", 2, "b", 3, "c", 4, "d"], \
    f"Got: {interleave(_first, _second)}"
# second runs out first, by more than one
assert interleave([1, 2, 3, 4, 5], ["a"]) == [1, "a", 2, 3, 4, 5], \
    f"Got: {interleave([1, 2, 3, 4, 5], ['a'])}"
# first runs out first, by more than one
assert interleave(["a"], [1, 2, 3, 4, 5]) == ["a", 1, 2, 3, 4, 5], \
    f"Got: {interleave(['a'], [1, 2, 3, 4, 5])}"
# Values that are themselves falsy must still show up
assert interleave([0, None], [False, ""]) == [0, False, None, ""], \
    f"Got: {interleave([0, None], [False, ''])}"
# Neither input list is modified
_left = [1, 2, 3]
_right = ["a", "b"]
_result = interleave(_left, _right)
assert _result == [1, "a", 2, "b", 3], f"Got: {_result}"
assert _left == [1, 2, 3], f"Got: first was changed into {_left}"
assert _right == ["a", "b"], f"Got: second was changed into {_right}"
# Built rather than written out, so a memorised table cannot masquerade as an answer
_long_first = list(range(20))
_long_second = list(range(100, 105))
_expected = []
for _pos in range(20):
    _expected.append(_long_first[_pos])
    if _pos < 5:
        _expected.append(_long_second[_pos])
assert interleave(_long_first, _long_second) == _expected, \
    f"Got: {interleave(_long_first, _long_second)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def interleave(first: list, second: list) -> list:
    """ Return first and second woven together one element at a time. """
    woven = []
    shared = min(len(first), len(second))
    for pos in range(shared):
        woven.append(first[pos])
        woven.append(second[pos])
    woven.extend(first[shared:])
    woven.extend(second[shared:])
    return woven
```

### Wrong answers the tests must catch

```python # wrong: assumes both lists are the same length, so the tail is dropped
def interleave(first: list, second: list) -> list:
    woven = []
    for pos in range(len(first)):
        woven.append(first[pos])
        woven.append(second[pos])
    return woven
```

```python # wrong: uses the shorter length but drops the leftover tail entirely
def interleave(first: list, second: list) -> list:
    woven = []
    shared = min(len(first), len(second))
    for pos in range(shared):
        woven.append(first[pos])
        woven.append(second[pos])
    return woven
```

```python # wrong: appends the tail of first even when first ran out first
def interleave(first: list, second: list) -> list:
    woven = []
    shared = min(len(first), len(second))
    for pos in range(shared):
        woven.append(first[pos])
        woven.append(second[pos])
    woven.extend(first[shared:])
    return woven
```

```python # wrong: mutates first instead of building a new list
def interleave(first: list, second: list) -> list:
    shared = min(len(first), len(second))
    for pos in range(shared):
        first.insert(2 * pos + 1, second[pos])
    first.extend(second[shared:])
    return first
```

```python # wrong: starts from second instead of first
def interleave(first: list, second: list) -> list:
    woven = []
    shared = min(len(first), len(second))
    for pos in range(shared):
        woven.append(second[pos])
        woven.append(first[pos])
    woven.extend(first[shared:])
    woven.extend(second[shared:])
    return woven
```

### Give-aways the Description must never contain

```text # forbidden
zip\(
extend\(
shared\s*=\s*min
min\(len\(first\)
woven\b
for\s+pos\s+in\s+range\(shared
```

### Shortcuts the tests reject outright

None: there is no one-liner that skips this lesson.

```text # banned
```
