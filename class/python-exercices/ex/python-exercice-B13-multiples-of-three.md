---
title: "Python B13 - Multiples of Three"
---

# Multiples of Three

## Instructions

Write a function `multiples_of_three() -> list` that returns the list of every multiple of 3 from 1 to 100 included: `[3, 6, 9, ..., 99]`.

It takes no arguments. Return the list, do not print it.

## Description

### Goal

Hand back the multiples of three that fall between 1 and 100, in order, as a list.
The first is `3` and the last is `99`.

### Rules

- Include 100 in the range you look at, but 100 is not itself a multiple of 3.
- Zero is a multiple of 3, but it is below 1, so it is **not** in the answer.
- Return the list, do not print it.

### Examples

| Call | Returns |
|---|---|
| `multiples_of_three()[0]` | `3` |
| `multiples_of_three()[-1]` | `99` |
| `len(multiples_of_three())` | `33` |

### Things you will need

`range` walks through a run of whole numbers, and `%` tells you what is left over
after a division:

```python
for number in range(1, 8):
    print(number, number % 3)
```

### Which order do you need?

Where does the run of numbers start, and where does it stop so that 99 is kept but
0 is left out?

## Starter code

```python # template
def multiples_of_three() -> list:
    """ Return the multiples of 3 from 1 to 100, e.g. starting [3, 6, 9, ...].

    >>> multiples_of_three()[0]
    3
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(multiples_of_three())
```

## Tests

```python # tests
_got = multiples_of_three()
_want = [number for number in range(1, 101) if number % 3 == 0]
assert _got == _want, f"Got: {_got}"
assert _got[0] == 3, f"Got: {_got[0]}"
assert _got[-1] == 99, f"Got: {_got[-1]}"
assert len(_got) == 33, f"Got: {len(_got)}"
assert 0 not in _got, f"Got: 0 should not be present in {_got}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def multiples_of_three() -> list:
    """ Return the multiples of 3 from 1 to 100, e.g. starting [3, 6, 9, ...]. """
    return [number for number in range(1, 101) if number % 3 == 0]
```

### Wrong answers the tests must catch

```python # wrong: starts at zero, so 0 slips in
def multiples_of_three() -> list:
    """ Lower bound too low. """
    return [number for number in range(0, 101) if number % 3 == 0]
```

```python # wrong: stops too early and loses 99
def multiples_of_three() -> list:
    """ Upper bound too low. """
    return [number for number in range(1, 99) if number % 3 == 0]
```

### Give-aways the Description must never contain

```text # forbidden
range\(1,\s*101\)
%\s*3\s*==\s*0
```

### Shortcuts the tests reject outright

```text # banned
```
