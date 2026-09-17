---
title: "Python G50 - What the Basket Costs"
---

# What the Basket Costs

## Instructions

Write a function `basket_total(items: list) -> int` that returns how many pesos the whole basket costs.

Add the prices up yourself. Do **not** use `sum(`.

## Description

### Goal

A shopping basket is not a list of numbers. It is a list of *things*, and each
thing carries its own price:

```text
[["pan", 1200], ["té", 2300], ["vino", 8900]]
```

Hand back the total in pesos. `[["pan", 1200], ["té", 2300]]` costs `3500`.

### Rules

- Return the number, do not print it.
- An empty basket costs `0`.
- Add the prices up yourself with a running total. Do **not** use `sum(`.

### Examples

| Call | Returns |
|---|---|
| `basket_total([["pan", 1200], ["té", 2300]])` | `3500` |
| `basket_total([["marraqueta", 990]])` | `990` |
| `basket_total([["pan", 1200], ["vino", 8900], ["té", 2300]])` | `12400` |
| `basket_total([])` | `0` |

### Something new: the list holds pairs, not numbers

Every list you have added up so far handed you a number on each turn of the loop.
This one hands you a small list of two things, and you have to say which of the two
you meant.

That is the only new idea here, and it is one you already know from `A23`: a list is
read by position. Position `0` is the name, position `1` is the price.

```python
for person in [["ana", 34], ["luz", 52]]:
    print(person[0])
```

That loop prints the names. Change the `0` and it prints the ages instead.

### Which of the two do you want?

Your running total from `B16` does not change at all. The only question is what
you add to it on each turn, now that the loop no longer hands you a bare number.

## Starter code

```python # template
def basket_total(items: list) -> int:
    """ Return the total price in pesos, e.g. 3500 for [["pan", 1200], ["té", 2300]].

    >>> basket_total([["pan", 1200], ["té", 2300]])
    3500
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(basket_total([["pan", 1200], ["té", 2300], ["vino", 8900]]))
```

## Tests

```python # tests
# The point of this one is the loop you write, so Check refuses the shortcut.
# __student_code__ is the student's own source, injected by the app and the
# verifier. Strip docstrings and comments so a note to yourself is never mistaken
# for the real thing, then match each construct whitespace-insensitively (and on a
# word boundary) so a stray space cannot slip a banned call past the ban.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("sum(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert basket_total([]) == 0, f"Got: {basket_total([])}"
assert basket_total([["marraqueta", 990]]) == 990, f"Got: {basket_total([['marraqueta', 990]])}"
# Two items whose total is not either price, so returning one of them is caught
assert basket_total([["pan", 1200], ["té", 2300]]) == 3500, \
    f"Got: {basket_total([['pan', 1200], ['té', 2300]])}"
# Three items: the count (3) and the first price (1200) are both far from 12400
assert basket_total([["pan", 1200], ["vino", 8900], ["té", 2300]]) == 12400, \
    f"Got: {basket_total([['pan', 1200], ['vino', 8900], ['té', 2300]])}"
# The dearest item is last, so a loop that stops early misses it
assert basket_total([["té", 100], ["vino", 9000]]) == 9100, \
    f"Got: {basket_total([['té', 100], ['vino', 9000]])}"
# Prices that repeat: adding is not the same as counting the different ones
assert basket_total([["pan", 500], ["pan", 500], ["pan", 500]]) == 1500, \
    f"Got: {basket_total([['pan', 500], ['pan', 500], ['pan', 500]])}"
# A free sample is a real price, not a missing one
assert basket_total([["muestra", 0], ["pan", 1200]]) == 1200, \
    f"Got: {basket_total([['muestra', 0], ['pan', 1200]])}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [[f"item{_step}", _step * 7] for _step in range(20)]
assert basket_total(_generated) == 1330, f"Got: {basket_total(_generated)}"
# The caller's basket must come back untouched
_original = [["pan", 1200], ["té", 2300]]
basket_total(_original)
assert _original == [["pan", 1200], ["té", 2300]], \
    f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def basket_total(items: list) -> int:
    """ Return the total price in pesos, e.g. 3500 for [["pan", 1200], ["té", 2300]]. """
    total = 0
    for item in items:
        total += item[1]
    return total
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: hands the adding to sum()
def basket_total(items: list) -> int:
    return sum(price for _, price in items)
```

```python # wrong: counts the things instead of adding their prices
def basket_total(items: list) -> int:
    total = 0
    for _ in items:
        total += 1
    return total
```

```python # wrong: returns the first price and never loops
def basket_total(items: list) -> int:
    if not items:
        return 0
    return items[0][1]
```

```python # wrong: adds position 0, the name, so nothing numeric accumulates
def basket_total(items: list) -> int:
    total = 0
    for item in items:
        total += len(item[0])
    return total
```

```python # wrong: keeps only the dearest item instead of adding them up
def basket_total(items: list) -> int:
    total = 0
    for item in items:
        if item[1] > total:
            total = item[1]
    return total
```

### Give-aways the Description must never contain

```text # forbidden
\bsum\(
for\s+\w+\s+in\s+items
item\[1\]
\+=\s*\w+\[1\]
```

### Shortcuts the tests reject outright

```text # banned
sum(
```
