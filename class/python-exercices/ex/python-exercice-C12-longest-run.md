---
title: "Python C12 - Longest Run of One Character"
---

# Longest Run of One Character

## Instructions

Write a function `longest_run(stg: str) -> int` that returns the length of the longest run of a single repeated character in `stg`, or `0` when `stg` is empty.

## Description

### Goal

A run is a stretch where the same character repeats with nothing else in
between. `"aabbbbc"` has a run of two `a`, a run of four `b`, and a run of one
`c`. The longest of those is `4`, so that is what comes back.

### Rules

- Compare characters that sit right next to each other, not characters that
  merely appear somewhere in the string.
- A single character on its own is a run of length `1`.
- The empty string has no runs at all, so it returns `0`.
- `return` the length, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `longest_run("aabbbbc")` | `4` |
| `longest_run("abc")` | `1` |
| `longest_run("")` | `0` |
| `longest_run("aaaa")` | `4` |
| `longest_run("aabbaa")` | `2` |

### Things you will need

Walking a string one character at a time, and comparing each one to the one
before it:

```python
for word in ["ballroom", "carpet"]:
    for pos in range(1, len(word)):
        print(word[pos] == word[pos - 1])
```

Keeping the best value seen so far while you walk something is the same shape
as `B10`'s counter, except now you compare a running value against a record
instead of only ever adding one:

```python
def largest(nums: list) -> int:
    """ Return the largest number in nums. """
    best = 0
    for num in nums:
        if num > best:
            best = num
    return best


print(largest([3, 1, 4, 1, 5, 9, 2, 6]))
```

### Two counters, not one

You need to know how long the run you are *currently* inside is, and
separately, how long the longest run you have *seen so far* is. Those are two
different numbers, and they do not always change together: the current run
keeps growing character after character, but the best-so-far only changes when
the current run beats it. What has to happen to the current-run counter the
moment the character changes?

## Starter code

```python # template
def longest_run(stg: str) -> int:
    """ Return the length of the longest run of one repeated character in stg.

    >>> longest_run("aabbbbc")
    4
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(longest_run("aabbbbc"))
```

## Tests

```python # tests
import random as _random

assert longest_run("") == 0, f"Got: {longest_run('')}"
assert longest_run("a") == 1, f"Got: {longest_run('a')}"
assert longest_run("abc") == 1, f"Got: {longest_run('abc')}"
assert longest_run("aaaa") == 4, f"Got: {longest_run('aaaa')}"
assert longest_run("aabbbbc") == 4, f"Got: {longest_run('aabbbbc')}"
assert longest_run("aabbaa") == 2, f"Got: {longest_run('aabbaa')}"
# The longest run can sit at the very end
assert longest_run("abccccc") == 5, f"Got: {longest_run('abccccc')}"
# ...or at the very start
assert longest_run("cccccab") == 5, f"Got: {longest_run('cccccab')}"
# A tie between two runs of the same length: either one is the longest
assert longest_run("aabb") == 2, f"Got: {longest_run('aabb')}"
# Digits and spaces are characters too
assert longest_run("11 2233") == 2, f"Got: {longest_run('11 2233')}"
assert isinstance(longest_run("aabbbbc"), int), f"Got: {type(longest_run('aabbbbc'))}"
# Drawn at random every run, so no table of the strings above can fake it
def _brute_longest_run(stg: str) -> int:
    """ Reference longest-run length computed the slow, obvious way. """
    if not stg:
        return 0
    best = 1
    current = 1
    for pos in range(1, len(stg)):
        if stg[pos] == stg[pos - 1]:
            current += 1
            if current > best:
                best = current
        else:
            current = 1
    return best


_SAMPLE = "".join(_random.choice("ab") for _ in range(80))
assert longest_run(_SAMPLE) == _brute_longest_run(_SAMPLE), f"Got: {longest_run(_SAMPLE)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def longest_run(stg: str) -> int:
    """ Return the length of the longest run of one repeated character in stg. """
    if not stg:
        return 0
    best = 1
    current = 1
    for pos in range(1, len(stg)):
        if stg[pos] == stg[pos - 1]:
            current += 1
            if current > best:
                best = current
        else:
            current = 1
    return best
```

### Wrong answers the tests must catch

```python # wrong: never resets the current run, so it never drops
def longest_run(stg: str) -> int:
    if not stg:
        return 0
    best = 1
    current = 1
    for pos in range(1, len(stg)):
        if stg[pos] == stg[pos - 1]:
            current += 1
        if current > best:
            best = current
    return current
```

```python # wrong: counts the most frequent character overall, not a run
def longest_run(stg: str) -> int:
    if not stg:
        return 0
    counts = {}
    for char in stg:
        counts[char] = counts.get(char, 0) + 1
    return max(counts.values())
```

```python # wrong: off by one, forgets the character before the first gap
def longest_run(stg: str) -> int:
    if not stg:
        return 0
    best = 0
    current = 1
    for pos in range(1, len(stg)):
        if stg[pos] == stg[pos - 1]:
            current += 1
            if current > best:
                best = current
        else:
            current = 1
    return best
```

```python # wrong: empty string crashes instead of returning 0
def longest_run(stg: str) -> int:
    best = 1
    current = 1
    for pos in range(1, len(stg)):
        if stg[pos] == stg[pos - 1]:
            current += 1
            if current > best:
                best = current
        else:
            current = 1
    return best
```

### Give-aways the Description must never contain

```text # forbidden
current\s*\+=\s*1
current\s*=\s*1\b
best\s*=\s*current
if\s+stg\[pos\]\s*==\s*stg\[pos\s*-\s*1\]
```

### Shortcuts the tests reject outright

```text # banned
```
