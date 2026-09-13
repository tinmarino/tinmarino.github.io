---
title: "Python D12 - Running Totals"
---

# Running Totals

## Instructions

Write a function `running_total(lst: list) -> list` that returns a new list the same length as `lst`, where each position holds the sum of every element up to and including it.

Return a new list; do not modify `lst`.

## Description

### Goal

A bank statement does not just show what you spent today, it shows the balance after
each line. That balance is a running total: the same accumulator you already know, one
snapshot at a time instead of one number at the very end.

Given a list of numbers, return a new list of the same length where position `i` holds
the sum of `lst[0]` through `lst[i]`.

### Rules

- The result is a new list. `lst` itself must come out unchanged.
- Return the list, do not print it.
- The empty list returns the empty list.

### Examples

| Call | Returns |
|---|---|
| `running_total([1, 2, 3])` | `[1, 3, 6]` |
| `running_total([5])` | `[5]` |
| `running_total([])` | `[]` |
| `running_total([4, -1, 2])` | `[4, 3, 5]` |
| `running_total([0, 0, 3])` | `[0, 0, 3]` |

### Things you will need

You have almost certainly already added up every number in a list, keeping one running
number as you go:

```python
def sum_all(prices: list) -> int:
    """ Return the sum of every price. """
    total = 0
    for price in prices:
        total = total + price
    return total

print(sum_all([2, 5, 1]))   # prints 8
```

The only thing new here is that this exercise wants every intermediate value of
`total`, not just the last one. Building up a list one element at a time is
`append`:

```python
squares = []
for num in [1, 2, 3]:
    squares.append(num * num)
print(squares)   # prints [1, 4, 9]
```

### What changes between the two loops?

The prices loop above keeps one number and throws away every value it had before the
last one. The squares loop keeps every value it computes. Your loop needs to update a
running number **and** keep every value that number ever held. Which of the two loops
above does that suggest you should start from?

## Starter code

```python # template
def running_total(lst: list) -> list:
    """ Return a new list where each position holds the sum up to and including it.

    >>> running_total([1, 2, 3])
    [1, 3, 6]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(running_total([1, 2, 3]))
```

## Tests

```python # tests
import itertools as _itertools
assert running_total([]) == [], f"Got: {running_total([])}"
assert running_total([5]) == [5], f"Got: {running_total([5])}"
assert running_total([1, 2, 3]) == [1, 3, 6], f"Got: {running_total([1, 2, 3])}"
assert running_total([4, -1, 2]) == [4, 3, 5], f"Got: {running_total([4, -1, 2])}"
assert running_total([0, 0, 3]) == [0, 0, 3], f"Got: {running_total([0, 0, 3])}"
assert running_total([-1, -2, -3]) == [-1, -3, -6], \
    f"Got: {running_total([-1, -2, -3])}"
assert running_total([10]) == [10], f"Got: {running_total([10])}"
assert running_total([1, -1, 1, -1]) == [1, 0, 1, 0], \
    f"Got: {running_total([1, -1, 1, -1])}"
_result = running_total([2, 3, 5, 7])
assert _result == [2, 5, 10, 17], f"Got: {_result}"
assert isinstance(_result, list), f"Got: {type(_result)}"
_given = [1, 2, 3, 4]
running_total(_given)
assert _given == [1, 2, 3, 4], f"Got: the input was modified into {_given}"
_built = list(range(1, 21))
_expected = list(_itertools.accumulate(_built))
assert running_total(_built) == _expected, f"Got: {running_total(_built)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def running_total(lst: list) -> list:
    """ Return a new list where each position holds the sum up to and including it. """
    result = []
    total = 0
    for num in lst:
        total = total + num
        result.append(total)
    return result
```

### Wrong answers the tests must catch

```python # wrong: returns the final total instead of every step
def running_total(lst: list) -> list:
    total = 0
    for num in lst:
        total = total + num
    return [total]
```

```python # wrong: appends the current element instead of the running total
def running_total(lst: list) -> list:
    result = []
    total = 0
    for num in lst:
        total = total + num
        result.append(num)
    return result
```

```python # wrong: resets the total before adding, so every entry is just the last number
def running_total(lst: list) -> list:
    result = []
    for num in lst:
        total = 0
        total = total + num
        result.append(total)
    return result
```

```python # wrong: mutates the caller's list instead of building a new one
def running_total(lst: list) -> list:
    total = 0
    for pos in range(len(lst)):
        total = total + lst[pos]
        lst[pos] = total
    return lst
```

```python # wrong: shifts every value by one position, off by one on the start
def running_total(lst: list) -> list:
    result = [0]
    total = 0
    for num in lst:
        result.append(total)
        total = total + num
    return result[:len(lst)]
```

### Give-aways the Description must never contain

```text # forbidden
total\s*=\s*total\s*\+\s*num
result\.append\(total\)
for\s+num\s+in\s+lst
```

### Shortcuts the tests reject outright

```text # banned
```
