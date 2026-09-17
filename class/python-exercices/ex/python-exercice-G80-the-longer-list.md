---
title: "Python G80 - The Longer List"
---

# The Longer List

## Instructions

Write a function `longer(left: list, right: list) -> list` that returns whichever of the two lists holds more elements, or `left` when they are the same size.

Compare them yourself. Do **not** use `max(`.

## Description

### Goal

Two lists arrive. Hand back the one with more things in it.

This is the first exercise that takes **two** lists, and it is deliberately gentle:
you never look inside either of them. You only ask how big they are.

### Rules

- Return the list itself, not its length and not a copy.
- When both hold the same number of elements, hand back `left`.
- Two empty lists are the same size, so that rule decides them too.
- Compare them yourself. Do **not** use `max(`.

### Examples

| Call | Returns |
|---|---|
| `longer([1], [1, 2])` | `[1, 2]` |
| `longer([1, 2], [3])` | `[1, 2]` |
| `longer([1, 2], [3, 4])` | `[1, 2]` |
| `longer([], [1])` | `[1]` |
| `longer([], [])` | `[]` |

### Things you will need

`len(` tells you how many elements a list holds, and it works on a string the same way:

```python
for word in ["sol", "ballena"]:
    print(word, len(word))
```

You settled a question exactly like this back in `A13`, when you returned the larger
of two numbers.

### The tie is the whole exercise

Two of the five examples above are ties, and they are there on purpose.

If you write the comparison the obvious way round, ties fall out correctly without
you thinking about it. If you write it the *other* obvious way round, every tie comes
back wrong and the rest still passes.

So before you write the `if`, say out loud which list you want when neither is
bigger, and then check that the comparison you wrote actually says that. There is
only one comparison here, and it is carrying two rules at once.

## Starter code

```python # template
def longer(left: list, right: list) -> list:
    """ Return the longer of the two lists, or left when they are the same size.

    >>> longer([1], [1, 2])
    [1, 2]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(longer([1, 2, 3], [4, 5]))
```

## Tests

```python # tests
# The point of this one is the comparison you write, so Check refuses the shortcut.
# __student_code__ is the student's own source, injected by the app and the
# verifier. Strip docstrings and comments so a note to yourself is never mistaken
# for the real thing, then match each construct whitespace-insensitively (and on a
# word boundary) so a stray space cannot slip a banned call past the ban.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("max(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

# The right one is longer
assert longer([1], [1, 2]) == [1, 2], f"Got: {longer([1], [1, 2])}"
# The left one is longer
assert longer([1, 2], [3]) == [1, 2], f"Got: {longer([1, 2], [3])}"
# A TIE, and the two lists hold DIFFERENT things, so returning the wrong one shows
assert longer([1, 2], [3, 4]) == [1, 2], f"Got: {longer([1, 2], [3, 4])}"
assert longer(["a"], ["b"]) == ["a"], f"Got: {longer(['a'], ['b'])}"
# A tie of two empty lists still follows the same rule
assert longer([], []) == [], f"Got: {longer([], [])}"
# One side empty
assert longer([], [1]) == [1], f"Got: {longer([], [1])}"
assert longer([1], []) == [1], f"Got: {longer([1], [])}"
# A bigger gap, both directions
assert longer([1, 2, 3, 4], [5]) == [1, 2, 3, 4], f"Got: {longer([1, 2, 3, 4], [5])}"
assert longer([1], [5, 6, 7, 8]) == [5, 6, 7, 8], f"Got: {longer([1], [5, 6, 7, 8])}"
# The answer is a list, never a number: a length would be 2 here, not [7, 8]
assert longer([9], [7, 8]) == [7, 8], f"Got: {longer([9], [7, 8])}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_short = list(range(5))
_long = list(range(9))
assert longer(_short, _long) == _long, f"Got: {longer(_short, _long)}"
assert longer(_long, _short) == _long, f"Got: {longer(_long, _short)}"
# Both lists must come back untouched
_left_original = [1, 2]
_right_original = [3, 4, 5]
longer(_left_original, _right_original)
assert _left_original == [1, 2], f"Got: the input was modified into {_left_original}"
assert _right_original == [3, 4, 5], f"Got: the input was modified into {_right_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def longer(left: list, right: list) -> list:
    """ Return the longer of the two lists, or left when they are the same size. """
    if len(right) > len(left):
        return right
    return left
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: hands the choice to max(), which compares contents, not lengths
def longer(left: list, right: list) -> list:
    return max(left, right)
```

```python # wrong: gives the tie to right instead of left
def longer(left: list, right: list) -> list:
    if len(left) > len(right):
        return left
    return right
```

```python # wrong: returns the shorter one
def longer(left: list, right: list) -> list:
    if len(right) < len(left):
        return right
    return left
```

```python # wrong: returns how long the winner is, not the winner
def longer(left: list, right: list) -> list:
    if len(right) > len(left):
        return len(right)
    return len(left)
```

```python # wrong: always returns left
def longer(left: list, right: list) -> list:
    return left
```

### Give-aways the Description must never contain

```text # forbidden
\bmax\(
len\(right\)
len\(left\)
return\s+right
```

### Shortcuts the tests reject outright

```text # banned
max(
```
