---
title: "Python C24 - Caesar Shift"
---

# Caesar Shift

## Instructions

Write a function `caesar(stg: str, num: int) -> str` that returns `stg` with every lowercase letter moved `num` places forward through the alphabet, wrapping past `z` back to `a`, and every other character left unchanged.

`num` is zero or more.

## Description

### Goal

A Caesar shift is the oldest trick in cryptography: slide every letter forward
by a fixed number of places. `a` shifted by `1` becomes `b`, `b` becomes `c`, and
so on. The trick is what happens when you fall off the end: `z` shifted by `1`
does not vanish, it becomes `a` again. The alphabet is a circle, not a line.

Given a string and a shift amount, return the string with every lowercase
letter moved `num` places forward, wrapping around from `z` back to `a`.

### Rules

- Only lowercase letters move. Uppercase letters, digits, spaces and
  punctuation pass through unchanged.
- `num` can be `0` (nothing moves) or larger than `26` (it still just wraps
  around, possibly more than once).
- Build the wraparound yourself with arithmetic on the letter's position &mdash;
  that is the part worth doing by hand once.
- `return` the string, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `caesar("abc", 1)` | `"bcd"` |
| `caesar("xyz", 3)` | `"abc"` |
| `caesar("hi, bob", 1)` | `"ij, cpc"` |
| `caesar("abc", 0)` | `"abc"` |
| `caesar("z", 26)` | `"z"` |
| `caesar("", 5)` | `""` |

### Things you will need

Every character has a numeric code, and `ord`/`chr` move between the two:

```python
print(ord("a"))          # 97
print(chr(97))            # a
print(ord("d") - ord("a"))   # 3, "d" is the 4th letter after "a"
```

The `%` operator is the remainder of a division, and it is what turns a
straight count into a circle: it never gives back more than `25` no matter how
big the number on its left is.

```python
print(27 % 26)    # 1
print(26 % 26)    # 0
print(3 % 26)     # 3
```

To check whether a character is a lowercase letter, `str.islower()` answers on
a single character just as well as on a whole string:

```python
for char in "Ab3 z":
    print(char, char.islower())
```

### What position does a letter land on after it wraps?

`ord(char) - ord("a")` gives you a letter's position from `0` to `25`. Adding
`num` to that position can push it past `25`. What operation turns "past the
end" back into "the start"? Once you have the new position, `chr` and
`ord("a")` take you back to a character.

## Starter code

```python # template
def caesar(stg: str, num: int) -> str:
    """ Return stg with every lowercase letter shifted num places forward,
    wrapping past z back to a. Other characters are unchanged.

    >>> caesar("abc", 1)
    'bcd'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(caesar("hi, bob", 1))
```

## Tests

```python # tests
import random as _random

assert caesar("", 5) == "", f"Got: {caesar('', 5)!r}"
assert caesar("abc", 0) == "abc", f"Got: {caesar('abc', 0)!r}"
assert caesar("abc", 1) == "bcd", f"Got: {caesar('abc', 1)!r}"
# Wraparound: z falls off the end and lands back on a
assert caesar("xyz", 3) == "abc", f"Got: {caesar('xyz', 3)!r}"
assert caesar("z", 1) == "a", f"Got: {caesar('z', 1)!r}"
assert caesar("z", 26) == "z", f"Got: {caesar('z', 26)!r}"
# Non-letters pass through untouched, and case is not folded
assert caesar("hi, bob", 1) == "ij, cpc", f"Got: {caesar('hi, bob', 1)!r}"
assert caesar("Hi Bob!", 1) == "Hj Bpc!", f"Got: {caesar('Hi Bob!', 1)!r}"
assert caesar("2 + 2", 3) == "2 + 2", f"Got: {caesar('2 + 2', 3)!r}"
# A shift bigger than 26 still just wraps, possibly more than once
assert caesar("abc", 27) == "bcd", f"Got: {caesar('abc', 27)!r}"
assert caesar("abc", 52) == "abc", f"Got: {caesar('abc', 52)!r}"
assert caesar("xyz", 29) == "abc", f"Got: {caesar('xyz', 29)!r}"
assert isinstance(caesar("abc", 1), str), f"Got: {type(caesar('abc', 1))}"

# Cross-checked against a second, independent way of computing the same shift
_ALPHABET = "abcdefghijklmnopqrstuvwxyz"


def _shift_by_index(phrase: str, num: int) -> str:
    """ Return phrase shifted by num, using alphabet.index instead of ord/chr. """
    return "".join(
        _ALPHABET[(_ALPHABET.index(char) + num) % 26] if char in _ALPHABET else char
        for char in phrase
    )


def _run_random_checks() -> None:
    """ Cross-check caesar against _shift_by_index on random phrases. """
    for _ in range(20):
        phrase = "".join(_random.choice(_ALPHABET + " ,.!Z9") for _ in range(15))
        num = _random.randint(0, 80)
        expected = _shift_by_index(phrase, num)
        assert caesar(phrase, num) == expected, f"Got: {caesar(phrase, num)!r}"


_run_random_checks()
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def caesar(stg: str, num: int) -> str:
    """ Return stg with every lowercase letter shifted num places forward,
    wrapping past z back to a. Other characters are unchanged. """
    result = []
    for char in stg:
        if char.islower():
            position = (ord(char) - ord("a") + num) % 26
            result.append(chr(ord("a") + position))
        else:
            result.append(char)
    return "".join(result)
```

### Wrong answers the tests must catch

```python # wrong: forgets to wrap, breaks past z
def caesar(stg: str, num: int) -> str:
    result = []
    for char in stg:
        if char.islower():
            result.append(chr(ord(char) + num))
        else:
            result.append(char)
    return "".join(result)
```

```python # wrong: shifts every character, uppercase and punctuation included
def caesar(stg: str, num: int) -> str:
    result = []
    for char in stg:
        position = (ord(char) - ord("a") + num) % 26
        result.append(chr(ord("a") + position))
    return "".join(result)
```

```python # wrong: shifts backward instead of forward
def caesar(stg: str, num: int) -> str:
    result = []
    for char in stg:
        if char.islower():
            position = (ord(char) - ord("a") - num) % 26
            result.append(chr(ord("a") + position))
        else:
            result.append(char)
    return "".join(result)
```

```python # wrong: only ever handles a shift of exactly 1, ignores num
def caesar(stg: str, num: int) -> str:
    result = []
    for char in stg:
        if char.islower():
            position = (ord(char) - ord("a") + 1) % 26
            result.append(chr(ord("a") + position))
        else:
            result.append(char)
    return "".join(result)
```

### Give-aways the Description must never contain

```text # forbidden
ord\(char\)\s*-\s*ord\("a"\)\s*\+\s*num
chr\(ord\("a"\)\s*\+
%\s*26\s*\)\s*\)
\.islower\(\)\s*:\s*\n\s*position
```

### Shortcuts the tests reject outright

```text # banned
```
