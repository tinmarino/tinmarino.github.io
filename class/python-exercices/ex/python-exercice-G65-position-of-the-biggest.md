---
title: "Python G65 - Position of the Biggest"
---

# Position of the Biggest

## Instructions

Write a function `argmax(lst: list) -> int` that returns the position of the biggest number in `lst`, or `-1` when the list is empty.

Find it yourself with a loop. Do **not** use `max(` or `.index(`.

## Description

### Goal

In `B20` you found the biggest number. Here you have to find **where it lives**.

That sounds like the same exercise with one extra step, and it very nearly is
&mdash; but the extra step is the interesting part, because a position survives
things a value does not.

### Rules

- Return the position, counting from `0`, not the number itself.
- An empty list returns `-1`, because there is no position to report.
- If the biggest number appears more than once, report the **first** place it sits.
- The list must come back **unchanged**.
- Find it yourself with a loop. Do **not** use `max(` or `.index(`.

### Examples

The numbers are overnight temperatures again, in degrees.

| Call | Returns |
|---|---|
| `argmax([3, 9, 4])` | `1` |
| `argmax([9, 3, 4])` | `0` |
| `argmax([3, 4, 9])` | `2` |
| `argmax([9, 3, 9])` | `0` |
| `argmax([-5, -3, -9])` | `1` |
| `argmax([])` | `-1` |

### Things you will need

You already know the shape of this from `B20`: hold on to the best thing you have
seen, and replace it when something better turns up.

You also know from `G60` that a position is a number you count yourself:

```python
def count_up(word: str) -> int:
    """ Return how many letters word has, counted one at a time. """
    seen = 0
    for _ in word:
        seen += 1
    return seen


print(count_up("abc"))
```

### One champion, or two?

Here is the thing worth sitting with. You are now tracking **two** facts about the
same winner: how big it was, and where it was. They always change together, and they
must never drift apart &mdash; updating one without the other is the single most
common way this goes wrong.

Which raises a genuinely nice question: do you actually need to remember both? If you
are holding on to a position, and the list is right there in front of you, is the
value ever more than a lookup away?

### Where do you start, this time?

`B20` warned you that starting your champion at `0` is a trap, because a list of
temperatures below freezing never beats it. That trap is still open here, and the
`[-5, -3, -9]` example is the one that springs it.

## Starter code

```python # template
def argmax(lst: list) -> int:
    """ Return the position of the biggest number in lst, or -1 when lst is empty.

    >>> argmax([3, 9, 4])
    1
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(argmax([-3, -8, 0, -5, -11, -6, 2]))
```

## Tests

```python # tests
# The point of this one is the loop you write, so Check refuses the shortcuts.
# __student_code__ is the student's own source, injected by the app and the
# verifier. Strip docstrings and comments so a note to yourself is never mistaken
# for the real thing, then match each construct whitespace-insensitively (and on a
# word boundary) so a stray space cannot slip a banned call past the ban.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("max(", ".index(")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert argmax([]) == -1, f"Got: {argmax([])}"
assert argmax([7]) == 0, f"Got: {argmax([7])}"
# The biggest is in the middle, so returning 0 or the last position both fail,
# and returning the VALUE 9 instead of the position 1 fails too
assert argmax([3, 9, 4]) == 1, f"Got: {argmax([3, 9, 4])}"
# The biggest is first: a loop that starts comparing too late misses it
assert argmax([9, 3, 4]) == 0, f"Got: {argmax([9, 3, 4])}"
# The biggest is last: a loop that stops too early misses it
assert argmax([3, 4, 9]) == 2, f"Got: {argmax([3, 4, 9])}"
# A TIE: the biggest sits at 0 and at 2, and the first one wins
assert argmax([9, 3, 9]) == 0, f"Got: {argmax([9, 3, 9])}"
assert argmax([1, 9, 9]) == 1, f"Got: {argmax([1, 9, 9])}"
# Every number is negative, so a champion starting at 0 is never beaten
assert argmax([-5, -3, -9]) == 1, f"Got: {argmax([-5, -3, -9])}"
assert argmax([-1]) == 0, f"Got: {argmax([-1])}"
assert argmax([-100, -200]) == 0, f"Got: {argmax([-100, -200])}"
# All equal: the first position, not a crash and not the last
assert argmax([2, 2, 2]) == 0, f"Got: {argmax([2, 2, 2])}"
# Zero is a real answer, not the absence of one
assert argmax([-8, 0, -8]) == 1, f"Got: {argmax([-8, 0, -8])}"
# A dip early on: the first number that beats its neighbour is NOT the answer
assert argmax([5, 3, 9]) == 2, f"Got: {argmax([5, 3, 9])}"
assert argmax([8, 2, 4, 1, 30]) == 4, f"Got: {argmax([8, 2, 4, 1, 30])}"
# The position and the value differ everywhere, so confusing them is caught
assert argmax([4, 8, 15, 16, 23, 42]) == 5, f"Got: {argmax([4, 8, 15, 16, 23, 42])}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [(_step * 37) % 101 - 50 for _step in range(101)]
assert argmax(_generated) == 30, f"Got: {argmax(_generated)}"
# The caller's list must come back untouched
_original = [3, 9, 4]
argmax(_original)
assert _original == [3, 9, 4], f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def argmax(lst: list) -> int:
    """ Return the position of the biggest number in lst, or -1 when lst is empty. """
    if not lst:
        return -1
    best = 0
    pos = 0
    for value in lst:
        if value > lst[best]:
            best = pos
        pos += 1
    return best
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: hands both halves away to max() and list.index()
def argmax(lst: list) -> int:
    if not lst:
        return -1
    return lst.index(max(lst))
```

```python # wrong: returns the biggest VALUE instead of its position
def argmax(lst: list) -> int:
    if not lst:
        return -1
    best = lst[0]
    for value in lst:
        if value > best:
            best = value
    return best
```

```python # wrong: uses >= so a later tie steals the answer from the first one
def argmax(lst: list) -> int:
    if not lst:
        return -1
    best = 0
    pos = 0
    for value in lst:
        if value >= lst[best]:
            best = pos
        pos += 1
    return best
```

```python # wrong: starts the champion at zero, so an all-negative list never beats it
def argmax(lst: list) -> int:
    if not lst:
        return -1
    best = 0
    champion = 0
    pos = 0
    for value in lst:
        if value > champion:
            champion = value
            best = pos
        pos += 1
    return best
```

```python # wrong: compares the wrong way round, so it finds the smallest
def argmax(lst: list) -> int:
    if not lst:
        return -1
    best = 0
    pos = 0
    for value in lst:
        if value < lst[best]:
            best = pos
        pos += 1
    return best
```

### Give-aways the Description must never contain

```text # forbidden
\bmax\(
\.index\(
for\s+\w+\s+in\s+lst
lst\[best\]
\bbest\s*=\s*pos
\bpos\s*\+=
```

### Shortcuts the tests reject outright

```text # banned
max(
.index(
```
