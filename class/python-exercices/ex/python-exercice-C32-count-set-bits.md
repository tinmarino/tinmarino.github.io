---
title: "Python C32 - Count the Set Bits"
---

# Count the Set Bits

## Instructions

Write a function `count_bits(num: int) -> int` that returns how many 1s appear in the binary form of `num`, without calling `bin(`.

`num` is zero or more.

## Description

### Goal

Every non-negative integer has a binary form: a string of 0s and 1s that
means the same number written in base two. Count how many of those digits are
`1`.

### Rules

- `num` is zero or more.
- Return the count as an `int`.
- `0` has no `1` at all: return `0`.
- Do not use `bin(` &mdash; it hands you the binary digits as a ready-made
  string, which is the whole exercise done for you.
- Return the value, do not print it.

### Examples

| Call | Returns |
|---|---|
| `count_bits(13)` | `3` |
| `count_bits(0)` | `0` |
| `count_bits(8)` | `1` |
| `count_bits(1)` | `1` |

### Things you will need

`C26` counted the base-ten digits of a number by repeatedly dividing by ten and
keeping the remainder:

```python
def digit_count(num: int) -> int:
    """ Count the base-ten digits of num by dividing until nothing is left. """
    total = 0
    remaining = num
    while remaining > 0:
        total += 1
        remaining = remaining // 10
    return total


for value in [405, 90]:
    print(digit_count(value))
```

Nothing there is special to ten. Divide by two instead and the remainder at
each step, `remaining % 2`, is one binary digit &mdash; either `0` or `1`.

```python
def binary_digits(num: int) -> None:
    """ Print each binary digit of num, least significant first. """
    remaining = num
    while remaining > 0:
        print(remaining % 2)
        remaining = remaining // 2


for value in [6, 9]:
    binary_digits(value)
```

### Which base is which?

`C26` divided by ten and counted every step. Here you still divide, and you
still stop at the same moment &mdash; but not every step counts any more.
Which remainders are worth keeping, and which are worth throwing away?

## Starter code

```python # template
def count_bits(num: int) -> int:
    """ Return how many 1s appear in the binary form of num.

    >>> count_bits(13)
    3
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(count_bits(13))
```

## Tests

```python # tests
# Refuse the shortcuts that skip the lesson. This is the ONE canonical guard,
# used identically in every exercise that bans anything: strip docstrings and
# comments off the student's own source (injected by the app and the verifier as
# __student_code__) so a note to yourself is never mistaken for the real thing,
# then match each banned construct whitespace-insensitively and on a word
# boundary — so `max (lst)` is caught but a helper of yours named `digit_sum` is
# not. Copy it verbatim; the only per-exercise change is the tuple of banned
# substrings, which must match the `# banned` fence exactly.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("bin(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert count_bits(0) == 0, f"Got: {count_bits(0)}"
assert count_bits(1) == 1, f"Got: {count_bits(1)}"
assert count_bits(8) == 1, f"Got: {count_bits(8)}"
# 13 is 1101 in binary
assert count_bits(13) == 3, f"Got: {count_bits(13)}"
# 2 is a power of two, 3 is one less than a power of two
assert count_bits(2) == 1, f"Got: {count_bits(2)}"
assert count_bits(3) == 2, f"Got: {count_bits(3)}"
# 255 is eight 1s in a row
assert count_bits(255) == 8, f"Got: {count_bits(255)}"
# 256 is a single 1 followed by eight 0s
assert count_bits(256) == 1, f"Got: {count_bits(256)}"
assert count_bits(1023) == 10, f"Got: {count_bits(1023)}"
assert isinstance(count_bits(13), int), f"Got: {type(count_bits(13))}"
for _num in range(200):
    _expected = sum(1 for _char in format(_num, "b") if _char == "1")
    assert count_bits(_num) == _expected, f"Got: {count_bits(_num)} for {_num}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def count_bits(num: int) -> int:
    """ Return how many 1s appear in the binary form of num. """
    total = 0
    remaining = num
    while remaining > 0:
        if remaining % 2 == 1:
            total = total + 1
        remaining = remaining // 2
    return total
```

### Wrong answers the tests must catch

```python # wrong: counts every division step, not just the 1s
def count_bits(num: int) -> int:
    total = 0
    remaining = num
    while remaining > 0:
        total = total + 1
        remaining = remaining // 2
    return total
```

```python # wrong: uses bin( to read off the digits directly
def count_bits(num: int) -> int:
    return bin(num).count("1")
```

```python # wrong: stops one step early, dropping the last remaining bit
def count_bits(num: int) -> int:
    total = 0
    remaining = num
    while remaining > 1:
        if remaining % 2 == 1:
            total = total + 1
        remaining = remaining // 2
    return total
```

```python # wrong: divides by ten instead of two, still counting base-ten digits
def count_bits(num: int) -> int:
    total = 0
    remaining = num
    while remaining > 0:
        if remaining % 10 == 1:
            total = total + 1
        remaining = remaining // 10
    return total
```

### Give-aways the Description must never contain

```text # forbidden
remaining\s*%\s*2\s*==\s*1
\bbin\(
total\s*=\s*total\s*\+\s*1
```

### Shortcuts the tests reject outright

```text # banned
bin(
```
