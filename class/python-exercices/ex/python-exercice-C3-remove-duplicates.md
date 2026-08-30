---
title: "Python C3 - Remove Duplicates"
---

# Remove Duplicates

## Instructions

Write a function `dedup(lst: list) -> list` that returns the elements of `lst` with every repeat dropped, keeping the first copy of each and leaving the order alone.

Write the loop yourself. `set()` and `dict.fromkeys()` do the whole job in one line, so **Check** turns them down.

## Description

### Goal

Three shopping lists got merged into one, and a good half of the items are on it twice.

That sheet is short enough to fix by hand. The same job comes back at a size that is not: the visitor IDs in a week of server log, four playlists dragged into one, three mailing lists somebody concatenated end to end. Twenty thousand rows, and the same question waiting at every one of them &mdash; have I seen this already?

Hand back a **new** list holding the same elements in the same order, each element appearing only once. An element keeps the place where it **first** appeared; every later copy of it disappears.

### Rules

- Return a new list. The list you were given must come out **unchanged**.
- Order is part of the answer. Nothing is sorted and nothing moves.
- Of the copies, the **first** one is the one that stays.
- An element that is empty is still an element. `0`, `""` and `None` are kept, and their repeats are dropped, exactly like anything else. *Have I seen this one before?* is not the same question as *is this one worth keeping?*
- The elements can be anything a list is allowed to hold &mdash; strings, numbers, and lists of their own. Whatever you compare them with has to cope with all three: `in` compares two elements and does not care what they are, and the containers that would make this fast cannot say the same.
- Build it yourself with a loop. Do **not** use `set()` or `dict.fromkeys()` &mdash; those are the whole answer in one line, and the long version has something to show you that the one-liner hides.

### Examples

| Call | Returns |
|---|---|
| `dedup(["milk", "eggs", "milk", "bread"])` | `["milk", "eggs", "bread"]` |
| `dedup([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])` | `[3, 1, 4, 5, 9, 2, 6]` |
| `dedup(["yes", "no", "yes"])` | `["yes", "no"]` |
| `dedup(["tea", "tea", "tea"])` | `["tea"]` |
| `dedup([0, "", 0, None])` | `[0, "", None]` |
| `dedup([["milk"], ["eggs"], ["milk"]])` | `[["milk"], ["eggs"]]` |
| `dedup(["bread", "milk"])` | `["bread", "milk"]` |
| `dedup([])` | `[]` |

### Things you will need

`in` asks whether a value is somewhere in a list, and `not in` asks the opposite. Both hand back `True` or `False`, so either one can drive an `if`:

```python
animals = ["cat", "dog"]
print("dog" in animals)          # True
print("horse" not in animals)    # True
```

The list is never touched here, so both answers stay true.

`in` does not care what the elements are, because `==` underneath it does not either. Two lists are equal when their contents are equal, so a list can be looked for inside a list of lists exactly like a string can:

```python
boxes = [["nail"], ["screw"]]
print(["nail"] in boxes)         # True
print(["bolt"] in boxes)         # False
```

The rest you already own from exercise `A2`.

### Which ones have you already seen?

You walk the input from left to right, one element at a time. When you arrive at an element you have to decide on the spot &mdash; keep it, or drop it.

That decision needs exactly one piece of knowledge: whether this element has turned up before. Having that knowledge means having somewhere to look it up, and there are two candidates. You can carry a second list of the elements you have already met, and consult that. Or you can consult the answer you are building, which as it happens holds precisely the elements you have already met. Both routes work, one of them is a line shorter, and finding out which is worth the two minutes.

Whichever you pick, answer this before you type anything, because the last section turns on it: what does one look-up cost you, and how many of them does a twenty-thousand-element list ask for?

### When Check is green, time it

Now the interesting part. Press **Run** once so the Console knows your `dedup`, open the **Console (iPython)** tab, and paste these four lines one at a time &mdash; in the Console, not in the editor, because `dict.fromkeys` anywhere in your own code makes **Check** refuse it.

```text
import time
big = list(range(20000))
start = time.perf_counter(); len(dedup(big)); print(time.perf_counter() - start)
start = time.perf_counter(); len(list(dict.fromkeys(big))); print(time.perf_counter() - start)
```

The semicolons only mean *and then*, so each of the last two lines reads the clock, does the job once, and prints how long that took in seconds. `len` is there to keep the Console from printing twenty thousand numbers at you.

`big` holds no repeats at all, so both calls hand back all 20 000 elements, and both are right. One of them you get to sit and watch &mdash; a couple of seconds, and longer on a phone. Let it finish: **Stop** kills the Console, taking `big` and your `dedup` with it, and you would have to start the whole demonstration again. The other one is over before you have finished reading the line, and the two numbers differ by three or four zeros.

So take the fast one and go home? `dict.fromkeys` keeps the order, it is correct, and it is instant &mdash; and it refuses a list of lists. Paste `list(dict.fromkeys([["milk"], ["eggs"]]))` and read what comes back. `set()` is just as quick and loses the order on top of it: try `list(set(["milk", "eggs", "milk", "bread"]))`. Your loop does not care what the elements are, and that is what those seconds bought you.

Your loop is not broken, and it is not badly written. So where did the time go?

## Starter code

```python # template
def dedup(lst: list) -> list:
    """ Return a new list with the elements of lst, each kept only the first time.

    >>> dedup(["milk", "eggs", "milk", "bread"])
    ['milk', 'eggs', 'bread']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(dedup(["milk", "eggs", "milk", "bread"]))
```

## Tests

```python # tests
import random as _random

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
         for _b in ("set(", "dict.fromkeys")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

_sheet = ["milk", "eggs", "milk", "bread"]
_got = dedup(_sheet)
assert _got == ["milk", "eggs", "bread"], f"Got: {_got}"
assert dedup([]) == [], f"Got: {dedup([])}"
assert dedup(["tea"]) == ["tea"], f"Got: {dedup(['tea'])}"
# Every element the same: exactly one survivor
_same = ["tea", "tea", "tea", "tea"]
_got = dedup(_same)
assert _got == ["tea"], f"Got: {_got}"
# The FIRST copy stays, so this is not ["no", "yes"]
assert dedup(["yes", "no", "yes"]) == ["yes", "no"], f"Got: {dedup(['yes', 'no', 'yes'])}"
# Unsorted on purpose: removing repeats is not sorting
_digits = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
_got = dedup(_digits)
assert _got == [3, 1, 4, 5, 9, 2, 6], f"Got: {_got}"
assert dedup([1, "1", 1, "1"]) == [1, "1"], f"Got: {dedup([1, '1', 1, '1'])}"
# An element that is empty is still an element: kept once, and its repeats dropped.
# "Have I seen this one?" is not "is this one true?"
assert dedup([0, 1, 0]) == [0, 1], f"Got: {dedup([0, 1, 0])}"
assert dedup(["", "tea", ""]) == ["", "tea"], f"Got: {dedup(['', 'tea', ''])}"
assert dedup([None, "tea", None]) == [None, "tea"], f"Got: {dedup([None, 'tea', None])}"
assert dedup([0, "", 0, None]) == [0, "", None], f"Got: {dedup([0, '', 0, None])}"
# Nothing to remove, and still a new list
_pair = ["bread", "milk"]
_got = dedup(_pair)
assert _got == ["bread", "milk"], f"Got: {_got}"
assert _got is not _pair, "Got: the very list you were given, not a new one"
_original = ["jam", "tea", "jam"]
dedup(_original)
assert _original == ["jam", "tea", "jam"], f"Got: the input was modified into {_original}"
# An element may be anything a list holds. `in` compares any two objects; a set or a
# dict first has to hash them, and a list cannot be hashed.
_nested = [["milk"], ["eggs"], ["milk"], []]
try:
    _got = dedup(_nested)
except TypeError as _exc:
    _got = f"TypeError: {_exc}"
assert _got == [["milk"], ["eggs"], []], f"Got: {_got}"
# Built fresh every run, so a memorised table cannot fake it
_big = [_random.choice(["x", "y", "z"]) for _ in range(60)]
_expected = []
for _item in _big:
    if _item not in _expected:
        _expected.append(_item)
assert dedup(_big) == _expected, f"Got: {dedup(_big)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def dedup(lst: list) -> list:
    """ Return a new list keeping only the first copy of each element of lst. """
    out = []
    for item in lst:
        if item not in out:
            out.append(item)
    return out
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: takes the set() shortcut, and loses the order with it
def dedup(lst: list) -> list:
    return list(set(lst))
```

```python # wrong: takes the dict.fromkeys shortcut
def dedup(lst: list) -> list:
    return list(dict.fromkeys(lst))
```

```python # wrong: remembers what it has seen in a dict, which cannot hold every element
def dedup(lst: list) -> list:
    out = []
    seen = {}
    for item in lst:
        if item not in seen:
            seen[item] = True
            out.append(item)
    return out
```

```python # wrong: returns the input unchanged
def dedup(lst: list) -> list:
    return lst
```

```python # wrong: keeps the last copy instead of the first
def dedup(lst: list) -> list:
    out = []
    for index, item in enumerate(lst):
        if item not in lst[index + 1:]:
            out.append(item)
    return out
```

```python # wrong: only drops a repeat that sits next to its twin
def dedup(lst: list) -> list:
    out = []
    for index, item in enumerate(lst):
        if index == 0 or item != lst[index - 1]:
            out.append(item)
    return out
```

```python # wrong: throws away every element that was repeated, keeping none of it
def dedup(lst: list) -> list:
    out = []
    for item in lst:
        if lst.count(item) == 1:
            out.append(item)
    return out
```

```python # wrong: drops the empty elements instead of deduplicating them
def dedup(lst: list) -> list:
    out = []
    for item in lst:
        if item and item not in out:
            out.append(item)
    return out
```

```python # wrong: uses None as the "nothing yet" marker, so a real None is eaten
def dedup(lst: list) -> list:
    out = []
    last = None
    for item in lst:
        if item != last and item not in out:
            out.append(item)
        last = item
    return out
```

```python # wrong: flags "seen it" with the element instead of True, so a falsy one never counts
def dedup(lst: list) -> list:
    out = []
    for item in lst:
        found = ""
        for other in out:
            if other == item:
                found = item
        if not found:
            out.append(item)
    return out
```

```python # wrong: sorts the result, so the order is no longer the input's
def dedup(lst: list) -> list:
    out = []
    for item in lst:
        if item not in out:
            out.append(item)
    return sorted(out)
```

```python # wrong: deletes the repeats from the caller's own list
def dedup(lst: list) -> list:
    index = 0
    while index < len(lst):
        if lst[index] in lst[:index]:
            del lst[index]
        else:
            index += 1
    return lst
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
if\s+\w+\s+not\s+in\s+(out|result|seen|kept|unique|answer)\b
not\s+in\s+(out|result|seen|kept|unique|answer)\b
\.append\(
^\s*(out|result|seen|kept|unique)\s*=\s*\[\s*\]
```

### Shortcuts the tests reject outright

```text # banned
set(
dict.fromkeys
```
