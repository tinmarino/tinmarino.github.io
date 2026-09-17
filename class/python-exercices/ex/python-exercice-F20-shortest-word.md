---
title: "Python F20 - The Shortest Word"
---

# The Shortest Word

## Instructions

Write a function `shortest_word(lst: list) -> str` that returns the shortest word of `lst`, or `""` when the list is empty.

Find it yourself with a loop. `min(`, `sorted(` and `.sort(` skip the exercise, so **Check** turns them down.

## Description

### Goal

Out of a list of words, hand back the short one. Not its length, not its
position &mdash; the word itself.

### Rules

- When several words tie for shortest, return the **first** of them.
- An empty list returns `""`, because there is no word to report.
- The list you were given must come out **unchanged**.
- Find it yourself with a loop. Do **not** use `min(`, `sorted(` or `.sort(` &mdash;
  writing the loop is the exercise.

### Examples

| Call | Returns |
|---|---|
| `shortest_word(["toto", "bid", "test", "bad"])` | `"bid"` |
| `shortest_word(["ballena", "sol"])` | `"sol"` |
| `shortest_word(["sol"])` | `"sol"` |
| `shortest_word([])` | `""` |

The first row is the one to think about. `"bid"` and `"bad"` are both three
letters long, and `"bid"` wins because you met it first. A later word has to be
**strictly** shorter to take the title.

### Things you will need

`len` measures a word, and two words can be compared by their lengths without any
list in sight:

```python
def shorter(first: str, second: str) -> str:
    """ Return whichever of the two words is shorter, keeping first on a tie. """
    if len(second) < len(first):
        return second
    return first


print(shorter("ant", "beetle"))
```

That settles two words. A list hands you its words one at a time, and you get one
look at each.

### Which order do you need?

What do you hold on to between one word and the next, and what does it start out
as when you have not looked at anything yet? Then ask the tie question again:
which comparison keeps the earlier word, `<` or `<=`?

## Starter code

```python # template
def shortest_word(lst: list) -> str:
    """ Return the shortest word of lst, the first one on a tie, or "" when empty.

    >>> shortest_word(["toto", "bid", "test", "bad"])
    'bid'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(shortest_word(["toto", "bid", "test", "bad"]))
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
         for _b in ("min(", "sorted(", ".sort(")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

try:
    _empty = shortest_word([])
except (IndexError, ValueError, TypeError) as _error:
    _empty = f"crashed on an empty list: {_error!r}"
assert _empty == "", f"Got: {_empty}"
# A tie: the FIRST of the equally short words wins, so <= loses here
assert shortest_word(["toto", "bid", "test", "bad"]) == "bid", \
    f"Got: {shortest_word(['toto', 'bid', 'test', 'bad'])}"
assert shortest_word(["sol", "mar"]) == "sol", f"Got: {shortest_word(['sol', 'mar'])}"
assert shortest_word(["aa", "bb", "cc"]) == "aa", \
    f"Got: {shortest_word(['aa', 'bb', 'cc'])}"
# The shortest is last, so returning the first word loses here
assert shortest_word(["ballena", "sol"]) == "sol", \
    f"Got: {shortest_word(['ballena', 'sol'])}"
assert shortest_word(["casa", "pez"]) == "pez", f"Got: {shortest_word(['casa', 'pez'])}"
# The shortest is first, so returning the last word loses here
assert shortest_word(["sol", "ballena"]) == "sol", \
    f"Got: {shortest_word(['sol', 'ballena'])}"
# A dip in the middle: the shortest sits neither at an end nor next to one
assert shortest_word(["casa", "ave", "arbol", "puerta"]) == "ave", \
    f"Got: {shortest_word(['casa', 'ave', 'arbol', 'puerta'])}"
assert shortest_word(["sol"]) == "sol", f"Got: {shortest_word(['sol'])}"
# The empty string is a real word here, and it is the shortest there is
assert shortest_word(["sol", ""]) == "", f"Got: {shortest_word(['sol', ''])}"
# Longest must not be confused for shortest
assert shortest_word(["a", "bb", "ccc"]) == "a", \
    f"Got: {shortest_word(['a', 'bb', 'ccc'])}"
assert shortest_word(["ccc", "bb", "a"]) == "a", \
    f"Got: {shortest_word(['ccc', 'bb', 'a'])}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = ["x" * (1 + (_step * 7) % 11) for _step in range(11)]
assert shortest_word(_generated) == "x", f"Got: {shortest_word(_generated)}"
# The caller's list must come back untouched
_original = ["toto", "bid", "test", "bad"]
shortest_word(_original)
assert _original == ["toto", "bid", "test", "bad"], \
    f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def shortest_word(lst: list) -> str:
    """ Return the shortest word of lst, the first one on a tie, or "" when empty. """
    if not lst:
        return ""
    champion = lst[0]
    for word in lst:
        if len(word) < len(champion):
            champion = word
    return champion
```

### Wrong answers the tests must catch

```python # wrong: uses <=, so a later tie steals the title
def shortest_word(lst: list) -> str:
    if not lst:
        return ""
    champion = lst[0]
    for word in lst:
        if len(word) <= len(champion):
            champion = word
    return champion
```

```python # wrong: calls min() instead of looping
def shortest_word(lst: list) -> str:
    if not lst:
        return ""
    return min(lst, key=len)
```

```python # wrong: sorts by length and takes the front
def shortest_word(lst: list) -> str:
    if not lst:
        return ""
    return sorted(lst, key=len)[0]
```

```python # wrong: sorts a copy in place with .sort()
def shortest_word(lst: list) -> str:
    if not lst:
        return ""
    copy = list(lst)
    copy.sort(key=len)
    return copy[0]
```

```python # wrong: returns the first word whatever its length
def shortest_word(lst: list) -> str:
    if not lst:
        return ""
    return lst[0]
```

```python # wrong: compares the wrong way round, so it finds the longest
def shortest_word(lst: list) -> str:
    if not lst:
        return ""
    champion = lst[0]
    for word in lst:
        if len(word) > len(champion):
            champion = word
    return champion
```

```python # wrong: returns the length instead of the word
def shortest_word(lst: list) -> str:
    if not lst:
        return ""
    champion = lst[0]
    for word in lst:
        if len(word) < len(champion):
            champion = word
    return len(champion)
```

### Give-aways the Description must never contain

```text # forbidden
champion\s*=\s*lst
for\s+\w+\s+in\s+lst\b
\bmin\(
\bsorted\(
\.sort\(
```

### Shortcuts the tests reject outright

```text # banned
min(
sorted(
.sort(
```
