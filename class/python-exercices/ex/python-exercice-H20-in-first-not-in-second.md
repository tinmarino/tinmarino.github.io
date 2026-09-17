---
title: "Python H20 - In the First, Not in the Second"
---

# In the First, Not in the Second

## Instructions

Write a function `only_in_first(left: list, right: list) -> list` that returns a new list with the values of `left` that do **not** appear in `right`, keeping their original order and their repeats. Do not use `set(`.

Return a new list and leave both lists you were given unchanged.

## Description

### Goal

Two lists arrive: everything you own, and everything you already packed. You
want what is still missing, which is every value of the first list that is
absent from the second.

### Rules

- Keep the values in the order the first list had them.
- If a value appears twice in the first list and is absent from the second,
  it appears **twice** in your answer. You are filtering, not removing repeats.
- Values that live only in the second list are simply ignored.
- Build and return a **new** list; both inputs must come back unchanged.
- Do **not** use `set(`: it throws away both the order and the repeats, which
  are exactly what this exercise is about.

### Examples

| Call | Returns |
|---|---|
| `only_in_first([1, 2, 3, 4], [2, 4])` | `[1, 3]` |
| `only_in_first([1, 1, 2], [2])` | `[1, 1]` |
| `only_in_first([1, 2], [2, 9])` | `[1]` |
| `only_in_first([1, 2], [1, 2])` | `[]` |
| `only_in_first([1, 2], [])` | `[1, 2]` |
| `only_in_first([], [1])` | `[]` |

Look at the second row twice. The `1` is kept **both** times, because each copy
is judged on its own.

### Things you will need

`not in` asks whether a value is absent from a list:

```python
print(7 not in [4, 5, 9])
print(7 not in [4, 7, 9])
```

Collecting the chosen values into a fresh list is the pattern you already used
to keep the even numbers:

```python
kept = []
for word in ["uno", "dos", "tres"]:
    if word != "dos":
        kept.append(word)
print(kept)
```

### Which order do you need?

You walk the first list once. For each value, what one question decides whether
it joins the answer? And notice what that question is **not**: it never looks at
what you have collected so far.

## Starter code

```python # template
def only_in_first(left: list, right: list) -> list:
    """ Return the values of left absent from right, e.g. [1, 3] for ([1, 2, 3, 4], [2, 4]).

    >>> only_in_first([1, 2, 3, 4], [2, 4])
    [1, 3]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(only_in_first([1, 2, 3, 4], [2, 4]))
```

## Tests

```python # tests
# The point is the loop, so Check refuses the shortcut that would skip it.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("set(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert only_in_first([1, 2, 3, 4], [2, 4]) == [1, 3], f"Got: {only_in_first([1, 2, 3, 4], [2, 4])}"
# A repeat in the first list is kept EVERY time, not collapsed into one
assert only_in_first([1, 1, 2], [2]) == [1, 1], f"Got: {only_in_first([1, 1, 2], [2])}"
assert only_in_first([5, 5, 5], [9]) == [5, 5, 5], f"Got: {only_in_first([5, 5, 5], [9])}"
# A value living only in the second list changes nothing
assert only_in_first([1, 2], [2, 9]) == [1], f"Got: {only_in_first([1, 2], [2, 9])}"
# Order comes from the first list, not from sorting
assert only_in_first([3, 1, 2], [1]) == [3, 2], f"Got: {only_in_first([3, 1, 2], [1])}"
assert only_in_first([9, 5, 7], []) == [9, 5, 7], f"Got: {only_in_first([9, 5, 7], [])}"
assert only_in_first([1, 2], [1, 2]) == [], f"Got: {only_in_first([1, 2], [1, 2])}"
assert only_in_first([1, 1, 1], [1]) == [], f"Got: {only_in_first([1, 1, 1], [1])}"
assert only_in_first([], [1]) == [], f"Got: {only_in_first([], [1])}"
assert only_in_first([], []) == [], f"Got: {only_in_first([], [])}"
# Only the first value survives, so an answer that stops early is caught
assert only_in_first([1, 2, 3], [2, 3]) == [1], f"Got: {only_in_first([1, 2, 3], [2, 3])}"
# Only the last value survives, so an answer that stops early is caught here too
assert only_in_first([1, 2, 3], [1, 2]) == [3], f"Got: {only_in_first([1, 2, 3], [1, 2])}"
# Words work the same way
assert only_in_first(["pan", "sal"], ["sal"]) == ["pan"], \
    f"Got: {only_in_first(['pan', 'sal'], ['sal'])}"
# Neither list may be modified
_left, _right = [1, 2, 3, 4], [2, 4]
only_in_first(_left, _right)
assert _left == [1, 2, 3, 4], f"Got: the first list was modified into {_left}"
assert _right == [2, 4], f"Got: the second list was modified into {_right}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def only_in_first(left: list, right: list) -> list:
    """ Return a new list of the values of left absent from right. """
    result = []
    for item in left:
        if item not in right:
            result.append(item)
    return result
```

### Wrong answers the tests must catch

```python # wrong: uses set(), losing both the repeats and the order
def only_in_first(left: list, right: list) -> list:
    """ Throws away exactly what the exercise asks you to keep. """
    return list(set(left) - set(right))
```

```python # wrong: also refuses a value it has already collected
def only_in_first(left: list, right: list) -> list:
    """ Removes duplicates nobody asked it to remove. """
    result = []
    for item in left:
        if item not in right and item not in result:
            result.append(item)
    return result
```

```python # wrong: keeps the values that ARE in the second list
def only_in_first(left: list, right: list) -> list:
    """ Asks the opposite question. """
    result = []
    for item in left:
        if item in right:
            result.append(item)
    return result
```

```python # wrong: hands back the first list untouched
def only_in_first(left: list, right: list) -> list:
    """ Filters nothing at all. """
    return left
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+left\b
not\s+in\s+right\b
result\.append\(item\)
```

### Shortcuts the tests reject outright

```text # banned
set(
```
