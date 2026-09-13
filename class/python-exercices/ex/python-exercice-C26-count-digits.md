---
title: "Python C26 - Count the Digits"
---

# Count the Digits

## Instructions

Write a function `digit_count(num: int) -> int` that returns how many digits `num` has, ignoring any leading minus sign. Do **not** use `str(` or `len(`: peel the number apart with arithmetic instead.

## Description

### Goal

Given an integer, hand back how many digits it is written with. A minus sign is
not a digit, so it never counts.

### Rules

- Negative numbers count the same as their positive twin: `-405` has 3 digits,
  same as `405`.
- `0` has 1 digit, even though there is nothing to peel off it.
- `return` the count, do not `print` it.
- Do it with arithmetic &mdash; do **not** use `str(` or `len(`: turning the
  number into text and measuring the text is this exercise already done for you.

### Examples

| Call | Returns |
|---|---|
| `digit_count(405)` | `3` |
| `digit_count(-405)` | `3` |
| `digit_count(7)` | `1` |
| `digit_count(0)` | `1` |
| `digit_count(1000)` | `4` |

### Things you will need

Integer division `//` and the remainder `%` both drop the fractional part, on
unrelated data:

```python
print(70 // 10)    # 7
print(70 % 10)     # 0
print(7 // 10)     # 0
```

A `while` loop keeps running as long as its condition holds, and stops the
moment it does not:

```python
def drain(level: int) -> None:
    """ Print the level, then count down to 0. """
    while level > 0:
        print("draining", level)
        level = level - 1
```

`abs` turns a negative number into its positive twin, on a value that has
nothing to do with digit counting:

```python
print(abs(-9))    # 9
print(abs(9))     # 9
```

### When does the draining stop?

Take `abs(num)` and keep dividing it by 10, counting one division each time.
Watch it on paper for `405`: `405`, then `40`, then `4`, then `0` &mdash; three
divisions before it reaches `0`. Now watch `0` itself: it starts at `0`, and the
loop never has a reason to run at all. What must the count already be before the
loop even looks at it?

## Starter code

```python # template
def digit_count(num: int) -> int:
    """ Return how many digits num has, ignoring a leading minus sign.

    >>> digit_count(-405)
    3
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(digit_count(-405))
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
         for _b in ("str(", "len(")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert digit_count(0) == 1, f"Got: {digit_count(0)}"
assert digit_count(7) == 1, f"Got: {digit_count(7)}"
assert digit_count(9) == 1, f"Got: {digit_count(9)}"
assert digit_count(-7) == 1, f"Got: {digit_count(-7)}"
assert digit_count(10) == 2, f"Got: {digit_count(10)}"
assert digit_count(42) == 2, f"Got: {digit_count(42)}"
assert digit_count(405) == 3, f"Got: {digit_count(405)}"
assert digit_count(-405) == 3, f"Got: {digit_count(-405)}"
assert digit_count(1000) == 4, f"Got: {digit_count(1000)}"
assert digit_count(-1000) == 4, f"Got: {digit_count(-1000)}"
assert digit_count(999999) == 6, f"Got: {digit_count(999999)}"
assert isinstance(digit_count(405), int), f"Got: {type(digit_count(405))}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def digit_count(num: int) -> int:
    """ Return how many digits num has, ignoring a leading minus sign. """
    remaining = abs(num)
    if remaining == 0:
        return 1
    count = 0
    while remaining > 0:
        remaining = remaining // 10
        count += 1
    return count
```

### Wrong answers the tests must catch

```python # wrong: 0 gives 0 digits instead of 1
def digit_count(num: int) -> int:
    remaining = abs(num)
    count = 0
    while remaining > 0:
        remaining = remaining // 10
        count += 1
    return count
```

```python # wrong: the minus sign is counted as a digit
def digit_count(num: int) -> int:
    remaining = num
    if remaining == 0:
        return 1
    count = 0
    if remaining < 0:
        count += 1
        remaining = -remaining
    while remaining > 0:
        remaining = remaining // 10
        count += 1
    return count
```

```python # wrong: off by one, counts one extra pass
def digit_count(num: int) -> int:
    remaining = abs(num)
    count = 1
    while remaining > 0:
        remaining = remaining // 10
        count += 1
    return count
```

```python # wrong: divides by 100 instead of 10, halving the count for longer numbers
def digit_count(num: int) -> int:
    remaining = abs(num)
    if remaining == 0:
        return 1
    count = 0
    while remaining > 0:
        remaining = remaining // 100
        count += 1
    return count
```

```python # wrong: hands the job to str() and len()
def digit_count(num: int) -> int:
    return len(str(abs(num)))
```

### Give-aways the Description must never contain

```text # forbidden
\bstr\(num\)
\blen\(str
while\s+remaining
remaining\s*=\s*abs
count\s*\+=\s*1
```

### Shortcuts the tests reject outright

```text # banned
str(
len(
```
