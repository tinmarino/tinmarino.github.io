---
title: "Python D60 - Is It a Rotation"
---

# Is It a Rotation

## Instructions

Write a function `is_rotation(stg: str, other: str) -> bool` that returns `True` when `other` is `stg` rotated by some amount, and `False` otherwise.

Two empty strings are rotations of each other. Strings of different length never are. Build it yourself &mdash; do not write a loop that tries every rotation one by one.

## Description

### Goal

A rotation slides the front of a string to the back: `"waterbottle"` rotated by
three is `"erbottlewat"`. Given two strings, return `True` when the second is
some rotation of the first, and `False` when it is not.

### Rules

- `stg` and `other` of different lengths are never rotations of each other.
  Return `False` immediately.
- Two empty strings are rotations of each other: `is_rotation("", "")` is `True`.
- A rotation by zero counts too: `stg` is a rotation of itself.
- Return `True` or `False`. Do not print anything, and do not modify either
  input string (strings can't be modified anyway, but don't build a new one
  and call it the answer to a different question).
- Solve it with **one** check, not a loop that slides the string one step at a
  time and compares. That loop works, but it is not the point of this
  exercise.

### Examples

| Call | Returns |
|---|---|
| `is_rotation("waterbottle", "erbottlewat")` | `True` |
| `is_rotation("abc", "acb")` | `False` |
| `is_rotation("", "")` | `True` |
| `is_rotation("abcde", "abcde")` | `True` |
| `is_rotation("abcde", "cdeab")` | `True` |
| `is_rotation("abcde", "abced")` | `False` |
| `is_rotation("abc", "abcd")` | `False` |

### Things you will need

Gluing a string to itself, and asking whether one string sits inside another:

```python
for word in ["cat", "dog"]:
    print(word + word, "atc" in (word + word))
```

### Where does a rotation point hide?

Write `"waterbottle"` twice in a row, back to back, with nothing between the
two copies. Every rotation of the original eleven letters &mdash; all eleven of
them &mdash; is sitting somewhere inside those twenty-two letters, read left to
right without skipping. Why does gluing a string to itself capture every
rotation at once, and what has to be true of the *lengths* before you go
looking for one inside the other?

## Starter code

```python # template
def is_rotation(stg: str, other: str) -> bool:
    """ Return True when other is stg rotated by some amount.

    >>> is_rotation("waterbottle", "erbottlewat")
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(is_rotation("waterbottle", "erbottlewat"))
```

## Tests

```python # tests
# The answer is a bool, not a value that happens to be truthy
assert isinstance(is_rotation("abc", "abc"), bool), \
    f"Got: {type(is_rotation('abc', 'abc'))}"
# Two empty strings are rotations of each other
assert is_rotation("", "") is True, f"Got: {is_rotation('', '')}"
# Rotation by zero: a string is a rotation of itself
assert is_rotation("abcde", "abcde") is True, f"Got: {is_rotation('abcde', 'abcde')}"
assert is_rotation("a", "a") is True, f"Got: {is_rotation('a', 'a')}"
# The worked example
assert is_rotation("waterbottle", "erbottlewat") is True, \
    f"Got: {is_rotation('waterbottle', 'erbottlewat')}"
# Every rotation amount of a short string
assert is_rotation("abcde", "abcde") is True, f"Got: {is_rotation('abcde', 'abcde')}"
assert is_rotation("abcde", "bcdea") is True, f"Got: {is_rotation('abcde', 'bcdea')}"
assert is_rotation("abcde", "cdeab") is True, f"Got: {is_rotation('abcde', 'cdeab')}"
assert is_rotation("abcde", "deabc") is True, f"Got: {is_rotation('abcde', 'deabc')}"
assert is_rotation("abcde", "eabcd") is True, f"Got: {is_rotation('abcde', 'eabcd')}"
# Same letters, wrong order: not a rotation
assert is_rotation("abc", "acb") is False, f"Got: {is_rotation('abc', 'acb')}"
assert is_rotation("abcde", "abced") is False, f"Got: {is_rotation('abcde', 'abced')}"
# Different lengths: never a rotation, even when one hides inside the other
assert is_rotation("abc", "abcd") is False, f"Got: {is_rotation('abc', 'abcd')}"
assert is_rotation("ab", "abab") is False, f"Got: {is_rotation('ab', 'abab')}"
assert is_rotation("", "a") is False, f"Got: {is_rotation('', 'a')}"
assert is_rotation("a", "") is False, f"Got: {is_rotation('a', '')}"
# Repeated letters, where a naive length check alone would not be enough
assert is_rotation("aabb", "abba") is True, f"Got: {is_rotation('aabb', 'abba')}"
assert is_rotation("aabb", "abab") is False, f"Got: {is_rotation('aabb', 'abab')}"
assert is_rotation("aaab", "aaba") is True, f"Got: {is_rotation('aaab', 'aaba')}"
# A single repeated character: every rotation looks the same
assert is_rotation("aaaa", "aaaa") is True, f"Got: {is_rotation('aaaa', 'aaaa')}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def is_rotation(stg: str, other: str) -> bool:
    """ Return True when other is stg rotated by some amount. """
    if len(stg) != len(other):
        return False
    return other in (stg + stg)
```

### Wrong answers the tests must catch

```python # wrong: skips the length check, so a longer string can hide inside the doubled short one
def is_rotation(stg: str, other: str) -> bool:
    return other in (stg + stg)
```

```python # wrong: checks membership without doubling, so only a single rotation point is ever seen
def is_rotation(stg: str, other: str) -> bool:
    if len(stg) != len(other):
        return False
    return other in stg
```

```python # wrong: compares sorted letters, which tests for an anagram, not a rotation
def is_rotation(stg: str, other: str) -> bool:
    if len(stg) != len(other):
        return False
    return sorted(stg) == sorted(other)
```

```python # wrong: only tries rotating by one step, not by every amount
def is_rotation(stg: str, other: str) -> bool:
    if len(stg) != len(other) or not stg:
        return len(stg) == len(other)
    return stg[1:] + stg[:1] == other
```

### Give-aways the Description must never contain

```text # forbidden
other\s+in\s*\(?\s*stg\s*\+\s*stg
return\s+other\s+in
len\(stg\)\s*!=\s*len\(other\)
len\(stg\)\s*==\s*len\(other\)
```

### Shortcuts the tests reject outright

```text # banned
```
