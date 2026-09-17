---
title: "Python G70 - Keep Every Nth Element"
---

# Keep Every Nth Element

## Instructions

Write a function `every_nth(lst: list, step: int) -> list` that returns a new list holding the element at position `0`, then `step`, then `2 * step`, and so on.

Write the loop yourself. Do **not** use a slice such as `lst[::step]`.

## Description

### Goal

Thin a list out. With `step` of `2` you keep the first, skip one, keep the next:
`["a", "b", "c", "d", "e"]` becomes `["a", "c", "e"]`.

The first element is **always** kept, whatever `step` is, because position `0` is
where the counting starts.

### Rules

- Return a new list; the one you were given must come back unchanged.
- Keep positions `0`, `step`, `2 * step`, `3 * step`, and so on.
- The list does not have to divide evenly. You keep whatever you land on and stop
  when you run off the end.
- A `step` of `1` keeps everything. A `step` bigger than the list keeps just the
  first element.
- Write the loop yourself. Do **not** use a slice such as `lst[::step]`.

### Examples

| Call | Returns |
|---|---|
| `every_nth(["a", "b", "c", "d", "e"], 2)` | `["a", "c", "e"]` |
| `every_nth(["a", "b", "c", "d", "e", "f"], 2)` | `["a", "c", "e"]` |
| `every_nth(["a", "b", "c", "d", "e", "f", "g"], 3)` | `["a", "d", "g"]` |
| `every_nth(["a", "b", "c"], 1)` | `["a", "b", "c"]` |
| `every_nth(["a", "b", "c"], 5)` | `["a"]` |
| `every_nth([], 2)` | `[]` |

### Things you will need

You counted positions for yourself in `G60`. The other half of this is the
remainder operator, which you met in `B12` deciding whether a number was even.

It does more than even and odd. Watch what `% 3` does as a counter climbs:

```python
for pos in range(7):
    print(pos, pos % 3)
```

That prints `0 1 2 0 1 2 0` down the right-hand column. The zeros are not scattered
at random: they land on `0`, `3` and `6`.

### Which positions are the zeros?

Look at that column again and read off *where* the zeros fall. Then look at the
`step` of `3` example above and read off which letters you were asked to keep.

If those two lists of numbers are the same list of numbers, you already have the
test that decides whether an element joins the result &mdash; and the exercise is
the filter you have written a dozen times, with a different question inside the
`if`.

One warning, because it is the mistake everybody makes once: a counter that starts
at `1` puts its zeros in the wrong places entirely.

## Starter code

```python # template
def every_nth(lst: list, step: int) -> list:
    """ Return a new list of the elements at positions 0, step, 2 * step, and so on.

    >>> every_nth(["a", "b", "c", "d", "e"], 2)
    ['a', 'c', 'e']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(every_nth(["a", "b", "c", "d", "e", "f", "g"], 3))
```

## Tests

```python # tests
# The point of this one is the loop you write, so Check refuses the shortcut.
# __student_code__ is the student's own source, injected by the app and the
# verifier. Strip docstrings and comments so a note to yourself is never mistaken
# for the real thing, then match each construct whitespace-insensitively (and on a
# word boundary) so a stray space cannot slip a banned call past the ban.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("[::",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert every_nth([], 2) == [], f"Got: {every_nth([], 2)}"
# Five elements and a step of 2: the list does NOT divide evenly
assert every_nth(["a", "b", "c", "d", "e"], 2) == ["a", "c", "e"], \
    f"Got: {every_nth(['a', 'b', 'c', 'd', 'e'], 2)}"
# Six elements and a step of 2: it divides evenly, and the answer is the same
assert every_nth(["a", "b", "c", "d", "e", "f"], 2) == ["a", "c", "e"], \
    f"Got: {every_nth(['a', 'b', 'c', 'd', 'e', 'f'], 2)}"
# A step of 3, so a counter that starts at 1 lands on b, e and nothing else
assert every_nth(["a", "b", "c", "d", "e", "f", "g"], 3) == ["a", "d", "g"], \
    f"Got: {every_nth(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3)}"
# A step of 1 keeps everything
assert every_nth(["a", "b", "c"], 1) == ["a", "b", "c"], \
    f"Got: {every_nth(['a', 'b', 'c'], 1)}"
# A step bigger than the list keeps only the first
assert every_nth(["a", "b", "c"], 5) == ["a"], f"Got: {every_nth(['a', 'b', 'c'], 5)}"
# A single element is always kept, whatever the step
assert every_nth(["solo"], 3) == ["solo"], f"Got: {every_nth(['solo'], 3)}"
# Numbers, where keeping the FIRST of each group and the LAST differ visibly
assert every_nth([1, 2, 3, 4, 5, 6, 7, 8], 4) == [1, 5], \
    f"Got: {every_nth([1, 2, 3, 4, 5, 6, 7, 8], 4)}"
assert every_nth([1, 2, 3, 4, 5, 6], 3) == [1, 4], \
    f"Got: {every_nth([1, 2, 3, 4, 5, 6], 3)}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = list(range(20))
assert every_nth(_generated, 6) == [0, 6, 12, 18], f"Got: {every_nth(_generated, 6)}"
# The caller's list must come back untouched
_original = ["a", "b", "c", "d"]
every_nth(_original, 2)
assert _original == ["a", "b", "c", "d"], f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def every_nth(lst: list, step: int) -> list:
    """ Return a new list of the elements at positions 0, step, 2 * step, and so on. """
    kept = []
    pos = 0
    for value in lst:
        if pos % step == 0:
            kept.append(value)
        pos += 1
    return kept
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: hands the whole job to a slice
def every_nth(lst: list, step: int) -> list:
    return lst[::step]
```

```python # wrong: counts from one, so the kept positions are all shifted
def every_nth(lst: list, step: int) -> list:
    kept = []
    pos = 1
    for value in lst:
        if pos % step == 0:
            kept.append(value)
        pos += 1
    return kept
```

```python # wrong: skips the first element and starts counting at step
def every_nth(lst: list, step: int) -> list:
    kept = []
    pos = 0
    for value in lst:
        pos += 1
        if pos % step == 0:
            kept.append(value)
    return kept
```

```python # wrong: ignores step and keeps everything
def every_nth(lst: list, step: int) -> list:
    kept = []
    for value in lst:
        kept.append(value)
    return kept
```

```python # wrong: hard-codes a step of two
def every_nth(lst: list, step: int) -> list:
    kept = []
    pos = 0
    for value in lst:
        if pos % 2 == 0:
            kept.append(value)
        pos += 1
    return kept
```

### Give-aways the Description must never contain

```text # forbidden
\[::
for\s+\w+\s+in\s+lst
%\s*step\s*==\s*0
pos\s*%\s*step
\.append\(value\)
```

### Shortcuts the tests reject outright

```text # banned
[::
```
