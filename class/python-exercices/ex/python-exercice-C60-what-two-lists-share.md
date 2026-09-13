---
title: "Python C60 - What Two Lists Share"
---

# What Two Lists Share

## Instructions

Write a function `common(first: list, second: list) -> list` that returns the items appearing in both lists, each one only once, in the order they first appear in `first`. Neither input is modified. Build it yourself &mdash; do **not** use `set(`.

## Description

### Two lists, one question

You have a list of the students who signed up for chess club, and another of the
students who signed up for the trip to the museum. Who signed up for both?

That is the whole exercise: given two lists, hand back the items that show up in
both of them.

### Goal

Given two lists, return a new list holding every item that appears in both,
without repeats, ordered the way it first shows up in `first`.

### Rules

- An item counts only if it appears in both `first` and `second`.
- Each shared item appears **once** in the result, even if it is repeated in
  `first`, `second`, or both.
- The order of the result follows the order of `first`: whichever shared item
  comes first there comes first in the result.
- Neither `first` nor `second` is changed by the call.
- If nothing is shared, or either list is empty, return `[]`.
- Build it yourself &mdash; do **not** use `set(`: it would answer the "once
  each" half of the question for you.
- `return` the list, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `common([1, 2, 2, 3], [2, 3, 4])` | `[2, 3]` |
| `common(["a", "b"], ["c"])` | `[]` |
| `common([], [1])` | `[]` |
| `common([3, 1, 2], [2, 3])` | `[3, 2]` |

### Things you will need

The `in` operator answers whether a value shows up anywhere in a list, checking
every position for you:

```python
fruit = ["apple", "pear", "plum"]
print("pear" in fruit)
print("kiwi" in fruit)
```

You already know how to build a list up one item at a time, appending only the
ones that pass a test:

```python
def keep_short(words: list) -> list:
    """ Return the words of at most 4 letters, in their original order.

    >>> keep_short(["cat", "giraffe", "owl"])
    ['cat', 'owl']
    """
    result = []
    for word in words:
        if len(word) <= 4:
            result.append(word)
    return result
```

### What stops the second `2` from showing up twice?

Walk `first` one item at a time. Each one is either in `second` or it is not
&mdash; that much you already have with `in`. But `[1, 2, 2, 3]` has two `2`s,
and the result must only have one. What do you check, on top of "is it in
`second`", before you append?

## Starter code

```python # template
def common(first: list, second: list) -> list:
    """ Return the items in both first and second, each once, first-seen order.

    >>> common([1, 2, 2, 3], [2, 3, 4])
    [2, 3]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(common([1, 2, 2, 3], [2, 3, 4]))
```

## Tests

```python # tests
# Refuse the shortcuts that skip the lesson. This is the ONE canonical guard,
# used identically in every exercise that bans anything: strip docstrings and
# comments off the student's own source (injected by the app and the verifier as
# __student_code__) so a note to yourself is never mistaken for the real thing,
# then match each banned construct whitespace-insensitively and on a word
# boundary — so `max (lst)` is caught but a helper of yours named `digit_sum` is
# not. Copy it verbatim; the only per-exercise change is the tuple of banned
# substrings, which must match the `# banned` fence exactly.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("set(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert common([], [1]) == [], f"Got: {common([], [1])}"
assert common([1], []) == [], f"Got: {common([1], [])}"
assert common([], []) == [], f"Got: {common([], [])}"
assert common(["a", "b"], ["c"]) == [], f"Got: {common(['a', 'b'], ['c'])}"
assert common([1, 2, 2, 3], [2, 3, 4]) == [2, 3], f"Got: {common([1, 2, 2, 3], [2, 3, 4])}"
# Order follows first, not second
assert common([3, 1, 2], [2, 3]) == [3, 2], f"Got: {common([3, 1, 2], [2, 3])}"
# Repeats on both sides still give a single entry
assert common([2, 2, 2], [2, 2]) == [2], f"Got: {common([2, 2, 2], [2, 2])}"
# Identical lists collapse to the unique items of first, in order
assert common([1, 1, 2, 3, 3], [1, 2, 3]) == [1, 2, 3], f"Got: {common([1, 1, 2, 3, 3], [1, 2, 3])}"
# Strings work the same way as numbers
_pets = common(["cat", "dog", "cat"], ["dog", "fox"])
assert _pets == ["dog"], f"Got: {_pets}"
# Neither input is modified
_first = [1, 2, 2, 3]
_second = [2, 3, 4]
common(_first, _second)
assert _first == [1, 2, 2, 3], f"Got: {_first}"
assert _second == [2, 3, 4], f"Got: {_second}"
assert isinstance(common([1, 2], [2, 3]), list), f"Got: {type(common([1, 2], [2, 3]))}"
# A longer, less tidy pair, so a wrong order or a missed dedup has room to show
_result = common([5, 1, 5, 2, 3, 1], [1, 3, 5, 9])
assert _result == [5, 1, 3], f"Got: {_result}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def common(first: list, second: list) -> list:
    """ Return the items in both first and second, each once, first-seen order. """
    result = []
    for item in first:
        if item in second and item not in result:
            result.append(item)
    return result
```

### Wrong answers the tests must catch

```python # wrong: forgets to dedupe, so a repeat in first shows up twice
def common(first: list, second: list) -> list:
    result = []
    for item in first:
        if item in second:
            result.append(item)
    return result
```

```python # wrong: orders by second instead of first
def common(first: list, second: list) -> list:
    result = []
    for item in second:
        if item in first and item not in result:
            result.append(item)
    return result
```

```python # wrong: mutates first while walking it
def common(first: list, second: list) -> list:
    result = []
    for item in first:
        if item in second and item not in result:
            result.append(item)
            first.remove(item)
    return result
```

```python # wrong: hands the whole job to set(), losing the order of first
def common(first: list, second: list) -> list:
    return list(set(first) & set(second))
```

### Give-aways the Description must never contain

```text # forbidden
item\s+not\s+in\s+result
item\s+in\s+second
result\.append\(item\)
set\(first\)
&\s*set\(
for\s+item\s+in\s+first\b
```

### Shortcuts the tests reject outright

```text # banned
set(
```
