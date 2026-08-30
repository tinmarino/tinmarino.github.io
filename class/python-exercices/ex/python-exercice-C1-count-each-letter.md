---
title: "Python C1 - Count Each Letter"
---

# Count Each Letter

## Instructions

Write a function `letter_count(stg: str) -> dict` that returns how many times each character of `stg` appears: a dict whose keys are the characters and whose values are the counts.

Every character counts, spaces and punctuation included. `Counter(` and `defaultdict(` from `collections` are this exercise already written, and `.count` is still off the table for the same reason as in `B1`, so **Check** turns all three down.

## Description

### One variable was enough, until now

Count every letter of a string. Not just the vowels of `B1` &mdash; all of them:
how many `b`, how many `n`, how many spaces.

With the technique from `B1` you need one variable per letter, and one `if` to pick
which variable to add to. That is twenty-six of each before you have even reached
the digits and the punctuation, and it only works for English. Nobody writes that
function once, let alone twice.

Python has a container built for exactly this situation. It is called a `dict`.

### Goal

Given a string, hand back a `dict` whose keys are the characters that appear in
it and whose values are how many times each one appears.

### Rules

- Every character counts: letters, digits, spaces, punctuation.
- Upper and lower case are different characters. `"B"` and `"b"` are two keys.
- A character that never appears must not be a key at all &mdash; no keys with a
  count of `0`.
- The empty string gives back an empty dict, `{}`.
- Count them yourself. Do **not** use `Counter(`, `defaultdict(` or `.count`: the
  first two are this exercise already written by somebody else, and the third asks
  the string a question the dict is here to answer.
- `return` the dict, do not `print` it.
- Key order does not matter. Two dicts holding the same pairs are `==` whatever
  order they were built in, so the tests will not quibble about it &mdash; and your
  **Run** output may well list the keys in a different order from the example in
  the docstring.

### Examples

| Call | Returns |
|---|---|
| `letter_count("banana")` | `{"b": 1, "a": 3, "n": 2}` |
| `letter_count("mississippi")` | `{"m": 1, "i": 4, "s": 4, "p": 2}` |
| `letter_count("no on")` | `{"n": 2, "o": 2, " ": 1}` |
| `letter_count("Bee")` | `{"B": 1, "e": 2}` |
| `letter_count("")` | `{}` |

### What a dict is

A list numbers its slots for you: `0`, `1`, `2`. A dict lets you choose the
labels. You look things up by the label, and the label can be a string:

```python
stock = {"apple": 4, "pear": 1}
print(stock["apple"])            # 4
stock["plum"] = 7                # a label that was not there is created
stock["pear"] = 9                # a label that was there is overwritten
print(stock)                     # {'apple': 4, 'pear': 9, 'plum': 7}
```

### Things you will need

An empty dict is `{}`. The `in` operator answers whether a label is already
present:

```python
stock = {"apple": 4, "pear": 1}
print("apple" in stock)          # True
print("plum" in stock)           # False
```

The `if` from `B1` runs its block when the answer is `True` and skips it
otherwise. Its other half is `else`, which runs exactly when the `if` did not:

```python
def describe(word: str) -> None:
    """ Print whether the given word is long or short. """
    if len(word) > 3:
        print(word, "is long")
    else:
        print(word, "is short")


describe("beetle")    # prints beetle is long
describe("ant")       # prints ant is short
```

Reading a label that is not there does not give you `0` &mdash; it raises
`KeyError` and stops your function. There is also a method
`dict.get(key, default)`, which hands back `default` instead of raising when the
label is missing; look it up. Both routes work. One of them is shorter, and
finding that out is worth the two minutes.

To walk a string one character at a time, take the characters directly:

```python
for letter in "python":
    print(letter)
```

### How do you know it is the first time?

Walk the string. Each character is either one you have already met earlier in
that same string, or one you are meeting for the first time. What the dict has to
do is not the same in those two cases, and neither is how you find out which case
you are in.

Work `"banana"` out on paper before you type anything. Six characters, three
labels: write down what the dict holds after each one. If you cannot say what
happens when you reach the second `a`, your code will not be able to say it
either.

One last thing, once it runs. Read back what you wrote and point at the line that
knows it is looking at letters. Then hand the function a sentence in Greek, or a
phone number, and see whether you were right.

## Starter code

```python # template
def letter_count(stg: str) -> dict:
    """ Return a dict mapping each character of stg to how many times it appears.

    >>> letter_count("banana")
    {'b': 1, 'a': 3, 'n': 2}
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(letter_count("mississippi"))
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
         for _b in ("Counter(", "defaultdict(", "collections", ".count")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert letter_count("") == {}, f"Got: {letter_count('')}"
assert letter_count("a") == {"a": 1}, f"Got: {letter_count('a')}"
# Repeats are the point: one key, a count above 1
assert letter_count("aaa") == {"a": 3}, f"Got: {letter_count('aaa')}"
assert letter_count("hello") == {"h": 1, "e": 1, "l": 2, "o": 1}, f"Got: {letter_count('hello')}"
assert letter_count("banana") == {"b": 1, "a": 3, "n": 2}, f"Got: {letter_count('banana')}"
# A space is a character like any other
assert letter_count("no on") == {"n": 2, "o": 2, " ": 1}, f"Got: {letter_count('no on')}"
# Leading and trailing spaces are characters too: nothing is stripped
assert letter_count("  hi  ") == {" ": 4, "h": 1, "i": 1}, f"Got: {letter_count('  hi  ')}"
# Case is not folded: "B" and "b" are two keys
assert letter_count("Bee") == {"B": 1, "e": 2}, f"Got: {letter_count('Bee')}"
assert letter_count("Anna") == {"A": 1, "n": 2, "a": 1}, f"Got: {letter_count('Anna')}"
# Digits and punctuation are characters too
assert letter_count("2+2!") == {"2": 2, "+": 1, "!": 1}, f"Got: {letter_count('2+2!')}"
_phrase = letter_count("never odd or even")
assert _phrase["e"] == 4, f"Got: {_phrase}"
assert _phrase[" "] == 3, f"Got: {_phrase}"
assert _phrase["d"] == 2, f"Got: {_phrase}"
# Absent characters must not show up as keys counting 0
assert "z" not in _phrase, f"Got: {_phrase}"
assert len(_phrase) == 7, f"Got: {_phrase}"
# A longer string, so a count that stops early has somewhere to go wrong
_repeated = letter_count("".join(["ab"] * 7))
assert _repeated == {"a": 7, "b": 7}, f"Got: {_repeated}"
assert isinstance(letter_count("banana"), dict), f"Got: {type(letter_count('banana'))}"
# Drawn at random every run, so no table of the strings above can fake it
_SAMPLE = "".join(_random.choice("ab z!AB") for _ in range(120))
_counted = letter_count(_SAMPLE)
assert sum(_counted.values()) == len(_SAMPLE), f"Got: {_counted}"
assert set(_counted) == set(_SAMPLE), f"Got: {sorted(_counted)}"
for _char in set(_SAMPLE):
    assert _counted[_char] == _SAMPLE.count(_char), f"Got: {_counted[_char]} for {_char!r}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def letter_count(stg: str) -> dict:
    """ Return a dict mapping each character of stg to its number of occurrences. """
    counts = {}
    for char in stg:
        if char in counts:
            counts[char] += 1
        else:
            counts[char] = 1
    return counts
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: records every character as seen once, never adds
def letter_count(stg: str) -> dict:
    counts = {}
    for char in stg:
        counts[char] = 1
    return counts
```

```python # wrong: still counting only the vowels, as in exercise `B1`
def letter_count(stg: str) -> dict:
    counts = {}
    for char in stg:
        if char in "aeiou":
            if char in counts:
                counts[char] += 1
            else:
                counts[char] = 1
    return counts
```

```python # wrong: off by one, the first sighting is counted twice
def letter_count(stg: str) -> dict:
    counts = {}
    for char in stg:
        if char not in counts:
            counts[char] = 1
        counts[char] += 1
    return counts
```

```python # wrong: folds the case, so "B" and "b" become one key
def letter_count(stg: str) -> dict:
    counts = {}
    for char in stg.lower():
        counts[char] = counts.get(char, 0) + 1
    return counts
```

```python # wrong: skips the spaces instead of counting them
def letter_count(stg: str) -> dict:
    counts = {}
    for char in stg:
        if char != " ":
            counts[char] = counts.get(char, 0) + 1
    return counts
```

```python # wrong: gives every character in the alphabet a key, zeros included
def letter_count(stg: str) -> dict:
    counts = {}
    for char in "abcdefghijklmnopqrstuvwxyz":
        counts[char] = 0
    for char in stg:
        counts[char] = counts.get(char, 0) + 1
    return counts
```

```python # wrong: strips the string before counting
def letter_count(stg: str) -> dict:
    counts = {}
    for char in stg.strip():
        counts[char] = counts.get(char, 0) + 1
    return counts
```

```python # wrong: asks the string for each count instead of accumulating
def letter_count(stg: str) -> dict:
    counts = {}
    for char in stg:
        counts[char] = stg.count(char)
    return counts
```

```python # wrong: a lookup table of the strings the tests happen to use
def letter_count(stg: str) -> dict:
    table = {"": {}, "a": {"a": 1}, "aaa": {"a": 3},
             "hello": {"h": 1, "e": 1, "l": 2, "o": 1},
             "banana": {"b": 1, "a": 3, "n": 2},
             "no on": {"n": 2, "o": 2, " ": 1},
             "  hi  ": {" ": 4, "h": 1, "i": 1},
             "Bee": {"B": 1, "e": 2}, "Anna": {"A": 1, "n": 2, "a": 1},
             "2+2!": {"2": 2, "+": 1, "!": 1},
             "never odd or even": {"n": 2, "e": 4, "v": 2, "r": 2, " ": 3,
                                   "o": 2, "d": 2},
             "ababababababab": {"a": 7, "b": 7}}
    return table.get(stg, {})
```

```python # wrong: hands the first-time question to collections.defaultdict
from collections import defaultdict


def letter_count(stg: str) -> dict:
    counts = defaultdict(int)
    for char in stg:
        counts[char] += 1
    return dict(counts)
```

```python # wrong: hands the job to collections.Counter
from collections import Counter


def letter_count(stg: str) -> dict:
    return dict(Counter(stg))
```

### Give-aways the Description must never contain

```text # forbidden
\[char\]
get\(char
\bcounts\[
counts\s*=\s*\{
for\s+\w+\s+in\s+stg\b
\bstg\[
\bCounter\b
\.count
```

### Shortcuts the tests reject outright

```text # banned
Counter(
defaultdict(
collections
.count
```
