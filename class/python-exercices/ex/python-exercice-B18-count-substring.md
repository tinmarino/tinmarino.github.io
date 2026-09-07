---
title: "Python B18 - Count a Substring"
---

# Count a Substring

## Instructions

Write a function `count_sub(needle: str, haystack: str) -> int` that returns how many times `needle` appears inside `haystack`. Do **not** use `.count()`.

Return the count, do not print it.

## Description

### Goal

Count the appearances of one short string inside a longer one. In
`"the py is python for py"` the piece `"py"` appears three times.

### Rules

- Do **not** use `.count()`. Search through the text yourself.
- Matches do not overlap: after you find one, keep looking from just past it.
- `needle` is never empty. Return the count as a number.

### Examples

| Call | Returns |
|---|---|
| `count_sub("py", "the py is python for py")` | `3` |
| `count_sub("na", "banana")` | `2` |
| `count_sub("ban", "banana")` | `1` |
| `count_sub("z", "banana")` | `0` |

### Things you will need

A string can tell you where a piece first appears, giving `-1` when it is nowhere:

```python
print("hello world".find("o"))
print("hello world".find("z"))
```

`find` can also start looking from a given position, which is how you move past a
match you have already counted.

### Which order do you need?

Each time you find a match, where do you start the next search so the same match is
not counted twice?

## Starter code

```python # template
def count_sub(needle: str, haystack: str) -> int:
    """ Return how many times needle appears in haystack, e.g. 2 for ("na", "banana").

    >>> count_sub("na", "banana")
    2
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(count_sub("py", "the py is python for py"))
```

## Tests

```python # tests
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in (".count",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

_got = count_sub("py", "the py is python for py")
assert _got == 3, f"Got: {_got}"
assert count_sub("na", "banana") == 2, f"Got: {count_sub('na', 'banana')}"
assert count_sub("ban", "banana") == 1, f"Got: {count_sub('ban', 'banana')}"
assert count_sub("z", "banana") == 0, f"Got: {count_sub('z', 'banana')}"
assert count_sub("a", "banana") == 3, f"Got: {count_sub('a', 'banana')}"
assert count_sub("o", "python") == 1, f"Got: {count_sub('o', 'python')}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def count_sub(needle: str, haystack: str) -> int:
    """ Return how many times needle appears in haystack, e.g. 2 for ("na", "banana"). """
    total = 0
    start = haystack.find(needle)
    while start != -1:
        total += 1
        start = haystack.find(needle, start + len(needle))
    return total
```

### Wrong answers the tests must catch

```python # wrong: uses the built-in count
def count_sub(needle: str, haystack: str) -> int:
    """ Hands the work to count. """
    return haystack.count(needle)
```

```python # wrong: returns where the first match is, not how many
def count_sub(needle: str, haystack: str) -> int:
    """ Returns a position, not a total. """
    return haystack.find(needle)
```

### Give-aways the Description must never contain

```text # forbidden
\.count\(
haystack\.find
while\s+start
```

### Shortcuts the tests reject outright

```text # banned
.count
```
