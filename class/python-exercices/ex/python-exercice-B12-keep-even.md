---
title: "Python B12 - Keep Only the Even Numbers"
---

# Keep Only the Even Numbers

## Instructions

Write a function `only_even(lst: list) -> list` that returns a new list holding only the even numbers of `lst`, in their original order.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

Sift a list of numbers and keep the even ones, dropping the rest. Zero is even.

### Rules

- Keep the even numbers in the order they appeared.
- Build and return a **new** list; the input must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `only_even([1, 2, 3, 4])` | `[2, 4]` |
| `only_even([1, 3, 5])` | `[]` |
| `only_even([-2, -1, 0])` | `[-2, 0]` |
| `only_even([])` | `[]` |

### Things you will need

A number is even when the remainder of dividing it by two is zero:

```python
for value in [10, 7, 4]:
    print(value % 2)
```

You collected chosen items into a new list in `B11`.

### Which order do you need?

For each number you look at, what decides whether it joins the new list or is
skipped?

## Starter code

```python # template
def only_even(lst: list) -> list:
    """ Return a new list of only the even numbers of lst, e.g. [2, 4] for [1, 2, 3, 4].

    >>> only_even([1, 2, 3, 4])
    [2, 4]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(only_even([1, 2, 3, 4, 5, 6]))
```

## Tests

```python # tests
assert only_even([1, 2, 3, 4]) == [2, 4], f"Got: {only_even([1, 2, 3, 4])}"
assert only_even([1, 3, 5]) == [], f"Got: {only_even([1, 3, 5])}"
assert only_even([2, 4, 6]) == [2, 4, 6], f"Got: {only_even([2, 4, 6])}"
assert only_even([-2, -1, 0]) == [-2, 0], f"Got: {only_even([-2, -1, 0])}"
assert only_even([]) == [], f"Got: {only_even([])}"
_src = [1, 2, 3, 4]
only_even(_src)
assert _src == [1, 2, 3, 4], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def only_even(lst: list) -> list:
    """ Return a new list of only the even numbers of lst, e.g. [2, 4] for [1, 2, 3, 4]. """
    return [number for number in lst if number % 2 == 0]
```

### Wrong answers the tests must catch

```python # wrong: keeps the odd numbers instead
def only_even(lst: list) -> list:
    """ Tests the wrong remainder. """
    return [number for number in lst if number % 2 == 1]
```

```python # wrong: returns the list untouched
def only_even(lst: list) -> list:
    """ Filters nothing. """
    return lst
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst
%\s*2\s*==\s*0
```

### Shortcuts the tests reject outright

```text # banned
```
