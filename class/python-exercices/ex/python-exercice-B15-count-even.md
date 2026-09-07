---
title: "Python B15 - How Many Are Even"
---

# How Many Are Even

## Instructions

Write a function `count_even(lst: list) -> int` that returns how many numbers of `lst` are even.

Keep a running total in a variable. Return the count, do not print it.

## Description

### Goal

Walk a list of numbers and count the even ones. The answer is a single number: how
many there were. Zero is even.

### Rules

- Return the count, not the even numbers themselves.
- An empty list has zero even numbers.

### Examples

| Call | Returns |
|---|---|
| `count_even([1, 2, 3, 4])` | `2` |
| `count_even([2, 4, 6])` | `3` |
| `count_even([1, 3, 5])` | `0` |
| `count_even([])` | `0` |

### Things you will need

A number leaves a remainder of 0 when it is even:

```python
for value in [10, 7, 4]:
    print(value % 2)
```

Counting means keeping a total that starts at zero and grows as you go, the same
shape whatever you are counting:

```python
def how_many_short(words: list) -> int:
    """ Count the words shorter than four letters. """
    total = 0
    for word in words:
        if len(word) < 4:
            total += 1
    return total


print(how_many_short(["hi", "hello", "bye"]))
```

### Which order do you need?

When does the total go up, and when is a number simply skipped?

## Starter code

```python # template
def count_even(lst: list) -> int:
    """ Return how many numbers of lst are even, e.g. 2 for [1, 2, 3, 4].

    >>> count_even([1, 2, 3, 4])
    2
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(count_even([1, 2, 3, 4, 5, 6]))
```

## Tests

```python # tests
assert count_even([1, 2, 3, 4]) == 2, f"Got: {count_even([1, 2, 3, 4])}"
assert count_even([2, 4, 6]) == 3, f"Got: {count_even([2, 4, 6])}"
assert count_even([1, 3, 5]) == 0, f"Got: {count_even([1, 3, 5])}"
assert count_even([]) == 0, f"Got: {count_even([])}"
assert count_even([-2, 0, 1]) == 2, f"Got: {count_even([-2, 0, 1])}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def count_even(lst: list) -> int:
    """ Return how many numbers of lst are even, e.g. 2 for [1, 2, 3, 4]. """
    total = 0
    for number in lst:
        if number % 2 == 0:
            total += 1
    return total
```

### Wrong answers the tests must catch

```python # wrong: counts the odd numbers instead
def count_even(lst: list) -> int:
    """ Wrong remainder. """
    total = 0
    for number in lst:
        if number % 2 == 1:
            total += 1
    return total
```

```python # wrong: returns the even numbers, not how many
def count_even(lst: list) -> int:
    """ Returns a list, not a count. """
    return [number for number in lst if number % 2 == 0]
```

### Give-aways the Description must never contain

```text # forbidden
%\s*2\s*==\s*0
for\s+\w+\s+in\s+lst
```

### Shortcuts the tests reject outright

```text # banned
```
