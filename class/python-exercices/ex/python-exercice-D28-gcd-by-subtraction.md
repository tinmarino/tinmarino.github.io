---
title: "Python D28 - GCD by Subtraction"
---

# GCD by Subtraction

## Instructions

Write a function `gcd(first: int, second: int) -> int` that returns the greatest common divisor of two positive integers, using only repeated subtraction of the smaller from the larger. Do not use `%` and do not `import math`.

## Description

### Goal

The greatest common divisor of two numbers is the biggest number that divides both of
them with nothing left over. `48` and `18` share `1`, `2`, `3` and `6` as divisors, and
`6` is the biggest of those, so `gcd(48, 18)` is `6`.

You could find that by checking every number up to the smaller one. There is a much
shorter way, and it does not touch `%` or `math` at all.

### Rules

- `first` and `second` are both `1` or more.
- Do **not** use `%` &mdash; the whole point is to get there without it.
- Do **not** `import math` &mdash; no borrowing `math.gcd`.
- Return the answer. Do not print it.

### Examples

| Call | Returns |
|---|---|
| `gcd(48, 18)` | `6` |
| `gcd(7, 7)` | `7` |
| `gcd(9, 3)` | `3` |
| `gcd(1, 1)` | `1` |
| `gcd(100, 1)` | `1` |

### Things you will need

The only tools here are comparison and subtraction, both on numbers that have nothing to
do with this exercise:

```python
def meet_in_the_middle(tab: int, chair: int) -> int:
    """ Shrink tab and chair towards each other by repeated subtraction.

    >>> meet_in_the_middle(120, 45)
    15
    """
    while tab != chair:
        if tab > chair:
            tab = tab - chair
        else:
            chair = chair - tab
    return tab


print(meet_in_the_middle(120, 45))     # prints 15
```

That loop keeps shrinking the bigger of two numbers by the smaller one, over and over,
until they meet. Whatever they meet at is worth noticing.

### Why does taking the small one away not lose anything?

If a number divides both `first` and `second`, does it still divide `first - second`?
Work that out on paper with `48` and `18` before you write the loop, and you will see why
shrinking the pair this way never throws away the answer you are looking for &mdash; it
only makes the numbers smaller until one of them **is** the answer.

## Starter code

```python # template
def gcd(first: int, second: int) -> int:
    """ Return the greatest common divisor of first and second, both 1 or more.

    >>> gcd(48, 18)
    6
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(gcd(48, 18))
```

## Tests

```python # tests
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
         for _b in ("%", "math")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert gcd(48, 18) == 6, f"Got: {gcd(48, 18)}"
assert gcd(7, 7) == 7, f"Got: {gcd(7, 7)}"
assert gcd(9, 3) == 3, f"Got: {gcd(9, 3)}"
assert gcd(3, 9) == 3, f"Got: {gcd(3, 9)}"
# Both arguments equal to 1
assert gcd(1, 1) == 1, f"Got: {gcd(1, 1)}"
# One argument is 1: nothing but 1 can divide both
assert gcd(100, 1) == 1, f"Got: {gcd(100, 1)}"
assert gcd(1, 100) == 1, f"Got: {gcd(1, 100)}"
# Two numbers that share nothing but 1
assert gcd(17, 5) == 1, f"Got: {gcd(17, 5)}"
# One divides the other exactly
assert gcd(12, 4) == 4, f"Got: {gcd(12, 4)}"
assert gcd(4, 12) == 4, f"Got: {gcd(4, 12)}"
# Larger numbers, where a slow subtraction loop must still land on the right answer
assert gcd(1071, 462) == 21, f"Got: {gcd(1071, 462)}"
assert gcd(252, 105) == 21, f"Got: {gcd(252, 105)}"
assert gcd(360, 210) == 30, f"Got: {gcd(360, 210)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def gcd(first: int, second: int) -> int:
    """ Return the greatest common divisor of first and second, both 1 or more. """
    big, small = first, second
    while big != small:
        if big > small:
            big = big - small
        else:
            small = small - big
    return big
```

### Wrong answers the tests must catch

```python # wrong: uses % to jump straight to the remainder
def gcd(first: int, second: int) -> int:
    big, small = first, second
    while small != 0:
        big, small = small, big % small
    return big
```

```python # wrong: borrows math.gcd instead of computing it
def gcd(first: int, second: int) -> int:
    import math
    return math.gcd(first, second)
```

```python # wrong: stops as soon as either number reaches 1, so it misses shared factors
def gcd(first: int, second: int) -> int:
    big, small = first, second
    while big != small and small != 1 and big != 1:
        if big > small:
            big = big - small
        else:
            small = small - big
    return small if small != 0 else big
```

```python # wrong: subtracts only once instead of looping until they meet
def gcd(first: int, second: int) -> int:
    if first > second:
        return first - second
    return second - first
```

```python # wrong: returns the smaller number outright, right only when it happens to divide
def gcd(first: int, second: int) -> int:
    return min(first, second)
```

### Give-aways the Description must never contain

```text # forbidden
while\s+big\s*!=\s*small
big\s*-\s*small
first\s*%\s*second
\bmath\.gcd\(
if\s+big\s*>\s*small
```

### Shortcuts the tests reject outright

```text # banned
%
math
```
