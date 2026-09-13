---
title: "Python C28 - Reverse an Integer"
---

# Reverse an Integer

## Instructions

Write a function `reverse_int(num: int) -> int` that returns the digits of `num` reversed, as an int, without using `str(`.

`num` is zero or more; a single digit comes back unchanged.

## Description

### Goal

Given a non-negative integer, hand back a new integer made of the same digits
in reverse order. `1200` becomes `21` &mdash; the digits read backwards are
`0021`, and a number does not carry leading zeros, so they are simply gone.

### Rules

- `num` is always zero or greater.
- A single-digit number comes back unchanged.
- Any leading zero that reversing produces just disappears, because the result
  is a number, not text.
- Build the reversed number arithmetically &mdash; do **not** use `str(` to turn
  `num` into text and slice it. That is this exercise already solved by
  somebody else.
- `return` the number, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `reverse_int(1200)` | `21` |
| `reverse_int(123)` | `321` |
| `reverse_int(7)` | `7` |
| `reverse_int(0)` | `0` |
| `reverse_int(100)` | `1` |

### Things you will need

Two operators pull a number apart one digit at a time, on unrelated data:

```python
for count in [407, 30]:
    print(count % 10)    # last digit
    print(count // 10)   # same number with that digit dropped
```

You can also build a number up the same way you tear one down: start from
`0`, and each step slide the digits already collected one place to the left
before dropping the new one in:

```python
def build_from_digits(digits: list) -> int:
    """ Rebuild a number from a list of its digits, e.g. 407 for [4, 0, 7]. """
    built = 0
    for digit in digits:
        built = built * 10 + digit
    return built


print(build_from_digits([4, 0, 7]))   # 407
print(build_from_digits([9]))         # 9
```

### Which order do you need?

`reverse_int` pulls digits off `num` from the right, one at a time, the same
way `count % 10` and `count // 10` do above. If you feed each digit you pull
off into the building step above, in the order you pull them, what number do
you end up with &mdash; and why does that already put them in reverse?

## Starter code

```python # template
def reverse_int(num: int) -> int:
    """ Return the digits of num in reverse order, e.g. 21 for 1200.

    >>> reverse_int(1200)
    21
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(reverse_int(1200))
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
         for _b in ("str(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert reverse_int(0) == 0, f"Got: {reverse_int(0)}"
assert reverse_int(7) == 7, f"Got: {reverse_int(7)}"
assert reverse_int(123) == 321, f"Got: {reverse_int(123)}"
assert reverse_int(1200) == 21, f"Got: {reverse_int(1200)}"
# Trailing zeros collapse to a shorter number
assert reverse_int(100) == 1, f"Got: {reverse_int(100)}"
assert reverse_int(10) == 1, f"Got: {reverse_int(10)}"
# Single non-zero digit, same digit
assert reverse_int(9) == 9, f"Got: {reverse_int(9)}"
# Palindrome, reversed is unchanged
assert reverse_int(1221) == 1221, f"Got: {reverse_int(1221)}"
assert reverse_int(56000) == 65, f"Got: {reverse_int(56000)}"
assert reverse_int(908070) == 70809, f"Got: {reverse_int(908070)}"
assert isinstance(reverse_int(1200), int), f"Got: {type(reverse_int(1200))}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def reverse_int(num: int) -> int:
    """ Return the digits of num in reverse order, e.g. 21 for 1200. """
    result = 0
    remaining = num
    while remaining > 0:
        result = result * 10 + remaining % 10
        remaining //= 10
    return result
```

### Wrong answers the tests must catch

```python # wrong: sums the digits instead of shifting the result left
def reverse_int(num: int) -> int:
    result = 0
    remaining = num
    while remaining > 0:
        result = result + remaining % 10
        remaining //= 10
    return result
```

```python # wrong: stops one digit early, an off-by-one loop bound
def reverse_int(num: int) -> int:
    result = 0
    remaining = num
    while remaining > 1:
        result = result * 10 + remaining % 10
        remaining //= 10
    return result
```

```python # wrong: converts to text and slices it, the banned shortcut
def reverse_int(num: int) -> int:
    return int(str(num)[::-1])
```

### Give-aways the Description must never contain

```text # forbidden
result\s*=\s*result\s*\*\s*10
num\s*%\s*10
num\s*//\s*10
str\(num\)
```

### Shortcuts the tests reject outright

```text # banned
str(
```
