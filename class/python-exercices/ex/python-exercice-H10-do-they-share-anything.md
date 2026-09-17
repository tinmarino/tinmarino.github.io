---
title: "Python H10 - Do They Share Anything?"
---

# Do They Share Anything?

## Instructions

Write a function `shares_any(left: list, right: list) -> bool` that returns `True` when at least one value of `left` also appears in `right`, and `False` otherwise.

Return the answer, do not print it.

## Description

### Goal

You have two shopping lists and one question: is there anything on both? You do
not care what it is, or how many there are. One match anywhere is enough.

### Rules

- The answer is `True` as soon as **one** value appears on both lists.
- If they have nothing in common the answer is `False`.
- An empty list shares nothing with anybody, so `False`.
- Return the boolean, do not print it.

### Examples

| Call | Returns |
|---|---|
| `shares_any([1, 2], [5, 2])` | `True` |
| `shares_any([1, 2], [3, 4])` | `False` |
| `shares_any([1, 2, 3], [9, 8, 3])` | `True` |
| `shares_any([], [1])` | `False` |
| `shares_any([], [])` | `False` |

Notice the second row: both lists hold something, and the answer is still
`False`. Having values is not the same as having a value **in common**.

### Things you will need

The `in` operator asks whether a value sits inside a list, and hands you back a
boolean:

```python
print(7 in [4, 7, 9])
print(7 in [4, 5, 9])
```

A function can hand back an answer the moment it knows it, without finishing
the loop:

```python
def has_a_big_one(numbers: list) -> bool:
    """ Say whether any number is over one hundred. """
    for value in numbers:
        if value > 100:
            return True
    return False


print(has_a_big_one([4, 300, 9]))
```

### Which order do you need?

You walk one of the two lists. For each value you meet, what single question do
you ask about the other list, and at what moment do you already know the final
answer?

## Starter code

```python # template
def shares_any(left: list, right: list) -> bool:
    """ Return True when some value of left also appears in right, e.g. True for ([1, 2], [5, 2]).

    >>> shares_any([1, 2], [5, 2])
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(shares_any([1, 2], [5, 2]))
```

## Tests

```python # tests
assert shares_any([1, 2], [5, 2]) is True, f"Got: {shares_any([1, 2], [5, 2])}"
# Both lists hold something, yet share nothing: having values is not sharing one
assert shares_any([1, 2], [3, 4]) is False, f"Got: {shares_any([1, 2], [3, 4])}"
# The only match sits at the very end of both lists
assert shares_any([1, 2, 3], [9, 8, 3]) is True, f"Got: {shares_any([1, 2, 3], [9, 8, 3])}"
# The only match sits at the very start
assert shares_any([4, 1, 2], [4, 8, 9]) is True, f"Got: {shares_any([4, 1, 2], [4, 8, 9])}"
# One value shared out of three: not all of them, just one
assert shares_any([1, 2, 3], [3, 7, 8]) is True, f"Got: {shares_any([1, 2, 3], [3, 7, 8])}"
assert shares_any([1, 2], [1, 2]) is True, f"Got: {shares_any([1, 2], [1, 2])}"
assert shares_any([7], [7]) is True, f"Got: {shares_any([7], [7])}"
assert shares_any([7], [8]) is False, f"Got: {shares_any([7], [8])}"
assert shares_any([], [1]) is False, f"Got: {shares_any([], [1])}"
assert shares_any([1], []) is False, f"Got: {shares_any([1], [])}"
assert shares_any([], []) is False, f"Got: {shares_any([], [])}"
# Repeats on one side do not change the answer
assert shares_any([5, 5], [5]) is True, f"Got: {shares_any([5, 5], [5])}"
assert shares_any([5, 5], [6]) is False, f"Got: {shares_any([5, 5], [6])}"
# It is about values, so it works on words too
assert shares_any(["pan", "té"], ["té"]) is True, f"Got: {shares_any(['pan', 'té'], ['té'])}"
assert shares_any(["pan"], ["vino"]) is False, f"Got: {shares_any(['pan'], ['vino'])}"
# Neither list may be modified
_left, _right = [1, 2], [5, 2]
shares_any(_left, _right)
assert _left == [1, 2], f"Got: the first list was modified into {_left}"
assert _right == [5, 2], f"Got: the second list was modified into {_right}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def shares_any(left: list, right: list) -> bool:
    """ Return True when some value of left also appears in right. """
    for item in left:
        if item in right:
            return True
    return False
```

### Wrong answers the tests must catch

```python # wrong: says yes whenever both lists hold something
def shares_any(left: list, right: list) -> bool:
    """ Confuses "has values" with "has a value in common". """
    return len(left) > 0 and len(right) > 0
```

```python # wrong: demands that every value be shared, not just one
def shares_any(left: list, right: list) -> bool:
    """ Answers a stricter question than the one asked. """
    for item in left:
        if item not in right:
            return False
    return True
```

```python # wrong: compares the two lists for equality
def shares_any(left: list, right: list) -> bool:
    """ Only says yes when the lists are identical. """
    return left == right
```

```python # wrong: gives up after looking at a single value
def shares_any(left: list, right: list) -> bool:
    """ Checks one value and decides, so a later match is missed. """
    for item in left:
        return item in right
    return False
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+left\b
\bin\s+right\b
```

### Shortcuts the tests reject outright

```text # banned
```
