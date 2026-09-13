---
title: "Python C16 - Run-Length Encode"
---

# Run-Length Encode

## Instructions

Write a function `encode(stg: str) -> str` that returns the run-length encoding of `stg`: each maximal run of one repeated character written as that character followed by its count.

## Description

### Goal

A run is a stretch of the same character repeated with nothing else in between. Walk `stg` and, for each run, write down the character once followed by how long the run was &mdash; count included even when it is `1`. Glue those pieces together and hand back the result.

### Rules

- Write the count after every character, including a run of length `1`.
- Runs are case-sensitive: `"A"` and `"a"` never belong to the same run.
- The empty string returns the empty string, `""`.
- `return` the string, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `encode("aaabb")` | `"a3b2"` |
| `encode("abc")` | `"a1b1c1"` |
| `encode("")` | `""` |
| `encode("aabccc")` | `"a2b1c3"` |
| `encode("Aaa")` | `"A1a2"` |

### Things you will need

Building a string piece by piece is cheaper with a list you `.append` to and
join once at the end, than with repeated `+=`:

```python
words = []
for word in ["never", "odd", "or", "even"]:
    words.append(word)
print("".join(words))          # neveroddoreven
```

You can turn a number into the digits of a string with `str`:

```python
print(str(3))                   # 3
print("a" + str(3))             # a3
```

Comparing the current character to the one before it tells you whether a run
just ended. Tracking that as you go is one job; counting how long the current
run has been running is a second job, done at the same time:

```python
def announce_runs(stg: str) -> None:
    """ Print where a new run of characters starts in stg. """
    last_seen = None
    for letter in stg:
        if letter != last_seen:
            print("new run starts at", letter)
        last_seen = letter


announce_runs("mississippi")
```

### What do you carry from one character to the next?

Two things change as you walk the string: which character the current run is
made of, and how long that run has gone on so far. When a new character does
not match the one the run is currently on, the run that just ended has to be
written down before the new one starts. What has to happen to the last run,
once the string itself runs out?

## Starter code

```python # template
def encode(stg: str) -> str:
    """ Return the run-length encoding of stg.

    >>> encode("aaabb")
    'a3b2'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(encode("aaabb"))
```

## Tests

```python # tests
import random as _random

assert encode("") == "", f"Got: {encode('')}"
assert encode("a") == "a1", f"Got: {encode('a')}"
assert encode("aaabb") == "a3b2", f"Got: {encode('aaabb')}"
assert encode("abc") == "a1b1c1", f"Got: {encode('abc')}"
assert encode("aabccc") == "a2b1c3", f"Got: {encode('aabccc')}"
# Case matters: a run never crosses a case change
assert encode("Aaa") == "A1a2", f"Got: {encode('Aaa')}"
# A run can end the string; it must still be written down
assert encode("aaa") == "a3", f"Got: {encode('aaa')}"
# Alternating characters: every run has length 1
assert encode("ababab") == "a1b1a1b1a1b1", f"Got: {encode('ababab')}"
# Spaces and punctuation are characters like any other
assert encode("  --!") == " 2-2!1", f"Got: {encode('  --!')}"
assert isinstance(encode("aaabb"), str), f"Got: {type(encode('aaabb'))}"
def _decode(stg: str) -> str:
    """ Undo run-length encoding, to check encode() against its own inverse. """
    pieces = []
    pos = 0
    while pos < len(stg):
        char = stg[pos]
        end = pos + 1
        digits = ""
        while end < len(stg) and stg[end].isdigit():
            digits += stg[end]
            end += 1
        pieces.append(char * int(digits))
        pos = end
    return "".join(pieces)


# Drawn at random every run, so no table of the strings above can fake it
_SAMPLE = "".join(_random.choice("ab") for _ in range(60))
_encoded = encode(_SAMPLE)
assert _decode(_encoded) == _SAMPLE, f"Got: {_encoded}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def encode(stg: str) -> str:
    """ Return the run-length encoding of stg. """
    pieces = []
    previous = None
    count = 0
    for char in stg:
        if char == previous:
            count += 1
        else:
            if previous is not None:
                pieces.append(previous + str(count))
            previous = char
            count = 1
    if previous is not None:
        pieces.append(previous + str(count))
    return "".join(pieces)
```

### Wrong answers the tests must catch

```python # wrong: drops the last run, never flushed after the loop ends
def encode(stg: str) -> str:
    pieces = []
    previous = None
    count = 0
    for char in stg:
        if char == previous:
            count += 1
        else:
            if previous is not None:
                pieces.append(previous + str(count))
            previous = char
            count = 1
    return "".join(pieces)
```

```python # wrong: counts every character instead of resetting per run
def encode(stg: str) -> str:
    pieces = []
    previous = None
    count = 0
    for char in stg:
        count += 1
        if char != previous:
            pieces.append(char + str(count))
            previous = char
    return "".join(pieces)
```

```python # wrong: folds the case, so a run can cross "A" and "a"
def encode(stg: str) -> str:
    pieces = []
    previous = None
    count = 0
    for char in stg.lower():
        if char == previous:
            count += 1
        else:
            if previous is not None:
                pieces.append(previous + str(count))
            previous = char
            count = 1
    if previous is not None:
        pieces.append(previous + str(count))
    return "".join(pieces)
```

```python # wrong: skips writing the count when a run has length 1
def encode(stg: str) -> str:
    pieces = []
    previous = None
    count = 0
    for char in stg:
        if char == previous:
            count += 1
        else:
            if previous is not None:
                pieces.append(previous + (str(count) if count > 1 else ""))
            previous = char
            count = 1
    if previous is not None:
        pieces.append(previous + (str(count) if count > 1 else ""))
    return "".join(pieces)
```

### Give-aways the Description must never contain

```text # forbidden
previous\s*=\s*None
previous\s*=\s*char
pieces\.append\(
count\s*\+=\s*1
if\s+char\s*==\s*previous
for\s+char\s+in\s+stg\b
```

### Shortcuts the tests reject outright

```text # banned
```
