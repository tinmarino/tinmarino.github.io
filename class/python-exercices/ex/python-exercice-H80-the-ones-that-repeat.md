---
title: "Python H80 - The Ones That Repeat"
---

# The Ones That Repeat

## Instructions

Write a function `repeated(lst: list) -> list` that returns the values appearing more than once in `lst`, each listed a single time, in the order they first appeared. Do not use `.count(`.

Return a new list, do not print it.

## Description

### Goal

You are checking a guest list for double bookings. You want the names that show
up more than once &mdash; each troublemaker named **once**, no matter how many
times they wrote themselves in.

`[1, 2, 2, 3, 3]` gives `[2, 3]`.

### Rules

- A value belongs in the answer when it appears **two or more** times.
- Each such value appears exactly **once** in your answer, even if it showed up
  five times.
- The order is the order of the value's **first** appearance in the input.
- A value appearing once is not interesting and is left out.
- Build and return a **new** list; the input must come back unchanged.
- Do **not** use `.count(`: doing the counting yourself is the exercise.

### Examples

| Call | Returns |
|---|---|
| `repeated([1, 2, 2, 3, 3])` | `[2, 3]` |
| `repeated([1, 1, 1])` | `[1]` |
| `repeated([1, 2, 3])` | `[]` |
| `repeated([3, 1, 3, 1])` | `[3, 1]` |
| `repeated([])` | `[]` |

The second row is the one that catches most attempts: three copies of `1` still
produce a single `1`, not two.

### Things you will need

You can count sightings by hand with a running total, the way you counted the
even numbers in `B15`:

```python
def count_a(word: str) -> int:
    """ Count how many times the letter a appears in word. """
    total = 0
    for letter in word:
        if letter == "a":
            total += 1
    return total


print(count_a("banana"))
```

And `not in` lets a list refuse something it is already holding:

```python
kept = []
for word in ["sol", "mar", "sol"]:
    if word not in kept:
        kept.append(word)
print(kept)
```

### Which order do you need?

Two questions have to come out true before a value joins the answer: one about
how often it appears in the input, and one about whether you have already
written it down. Which of the two saves you the most work if you ask it first?

## Starter code

```python # template
def repeated(lst: list) -> list:
    """ Return the values of lst appearing more than once, once each, e.g. [2] for [1, 2, 2].

    >>> repeated([1, 2, 2, 3, 3])
    [2, 3]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(repeated([1, 2, 2, 3, 3]))
```

## Tests

```python # tests
# Counting it yourself is the exercise, so Check refuses the shortcut.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in (".count(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert repeated([1, 2, 2, 3, 3]) == [2, 3], f"Got: {repeated([1, 2, 2, 3, 3])}"
# THREE copies still produce ONE entry, not two
assert repeated([1, 1, 1]) == [1], f"Got: {repeated([1, 1, 1])}"
assert repeated([4, 4, 4, 4]) == [4], f"Got: {repeated([4, 4, 4, 4])}"
assert repeated([1, 1, 1, 2, 2]) == [1, 2], f"Got: {repeated([1, 1, 1, 2, 2])}"
# Nothing repeats, so nothing comes back
assert repeated([1, 2, 3]) == [], f"Got: {repeated([1, 2, 3])}"
assert repeated([7]) == [], f"Got: {repeated([7])}"
assert repeated([]) == [], f"Got: {repeated([])}"
# The order is that of the FIRST appearance, not sorted and not last-seen
assert repeated([3, 1, 3, 1]) == [3, 1], f"Got: {repeated([3, 1, 3, 1])}"
assert repeated([9, 2, 9, 2, 5]) == [9, 2], f"Got: {repeated([9, 2, 9, 2, 5])}"
assert repeated([5, 9, 5, 1, 9]) == [5, 9], f"Got: {repeated([5, 9, 5, 1, 9])}"
# The repeats sit far apart, at the two ends
assert repeated([8, 1, 2, 3, 8]) == [8], f"Got: {repeated([8, 1, 2, 3, 8])}"
# Simple pair
assert repeated([5, 5]) == [5], f"Got: {repeated([5, 5])}"
# Singles mixed in among the repeats must be dropped
assert repeated([1, 2, 1, 3, 4, 4]) == [1, 4], f"Got: {repeated([1, 2, 1, 3, 4, 4])}"
# Words repeat the same way
assert repeated(["ana", "luz", "ana"]) == ["ana"], f"Got: {repeated(['ana', 'luz', 'ana'])}"
assert repeated(["a", "b", "c"]) == [], f"Got: {repeated(['a', 'b', 'c'])}"
# Zero is a value like any other
assert repeated([0, 0, 1]) == [0], f"Got: {repeated([0, 0, 1])}"
# The caller's list must come back untouched
_original = [1, 2, 2, 3, 3]
repeated(_original)
assert _original == [1, 2, 2, 3, 3], f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def repeated(lst: list) -> list:
    """ Return the values of lst appearing more than once, once each, in order. """
    result = []
    for item in lst:
        if item in result:
            continue
        total = 0
        for other in lst:
            if other == item:
                total += 1
        if total > 1:
            result.append(item)
    return result
```

### Wrong answers the tests must catch

```python # wrong: uses the banned .count() instead of counting by hand
def repeated(lst: list) -> list:
    """ Right answer, forbidden road. """
    result = []
    for item in lst:
        if lst.count(item) > 1 and item not in result:
            result.append(item)
    return result
```

```python # wrong: writes the value down again on every extra sighting
def repeated(lst: list) -> list:
    """ Three copies of a value produce two entries. """
    result = []
    seen = []
    for item in lst:
        if item in seen:
            result.append(item)
        else:
            seen.append(item)
    return result
```

```python # wrong: keeps only the values appearing exactly twice
def repeated(lst: list) -> list:
    """ Loses anything that appears three times or more. """
    result = []
    for item in lst:
        if item in result:
            continue
        total = 0
        for other in lst:
            if other == item:
                total += 1
        if total == 2:
            result.append(item)
    return result
```

```python # wrong: returns the distinct values instead of the repeated ones
def repeated(lst: list) -> list:
    """ Removes duplicates rather than reporting them. """
    result = []
    for item in lst:
        if item not in result:
            result.append(item)
    return result
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
total\s*>\s*1
result\.append\(item\)
```

### Shortcuts the tests reject outright

```text # banned
.count(
```
