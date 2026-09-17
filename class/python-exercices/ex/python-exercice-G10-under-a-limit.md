---
title: "Python G10 - Keep What Is Under a Limit"
---

# Keep What Is Under a Limit

## Instructions

Write a function `under(lst: list, limit: int) -> list` that returns a new list holding only the numbers of `lst` that are strictly under `limit`, in their original order.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

You have already kept the even numbers of a list. This time *you* decide where
the line falls: keep every number that sits below `limit`, drop the rest.

### Rules

- **Strictly** under: a number exactly equal to `limit` does not make it.
- Keep the survivors in the order they appeared.
- Build and return a **new** list; the input must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `under([1, 5, 9], 5)` | `[1]` |
| `under([5, 5, 5], 5)` | `[]` |
| `under([1, 2, 3], 10)` | `[1, 2, 3]` |
| `under([-3, 0, 4], 0)` | `[-3]` |
| `under([], 5)` | `[]` |

### Things you will need

Comparing two numbers hands you a `True` or a `False`:

```python
for price in [12, 5, 30]:
    print(price < 10)
```

Collecting the chosen ones into a new list is what you did in `B12`.

### Which order do you need?

In `B12` the question was the same for every number, always "is it even?".
Here the question moves with the second argument. For each number you visit,
what has to be compared against what?

## Starter code

```python # template
def under(lst: list, limit: int) -> list:
    """ Return a new list of the numbers of lst under limit, e.g. [1] for ([1, 5, 9], 5).

    >>> under([1, 5, 9], 5)
    [1]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(under([1, 5, 9, 2], 5))
```

## Tests

```python # tests
assert under([1, 5, 9], 5) == [1], f"Got: {under([1, 5, 9], 5)}"
# 5 is not under 5, so a <= test lets it through by mistake
assert under([5, 5, 5], 5) == [], f"Got: {under([5, 5, 5], 5)}"
assert under([1, 2, 3], 10) == [1, 2, 3], f"Got: {under([1, 2, 3], 10)}"
# Zero as the limit, with a negative that does belong
assert under([-3, 0, 4], 0) == [-3], f"Got: {under([-3, 0, 4], 0)}"
assert under([], 5) == [], f"Got: {under([], 5)}"
# The survivors are not next to each other, and their order is kept
assert under([7, 2, 9, 1], 5) == [2, 1], f"Got: {under([7, 2, 9, 1], 5)}"
assert under([9, 8], 5) == [], f"Got: {under([9, 8], 5)}"
_src = [1, 5, 9]
under(_src, 5)
assert _src == [1, 5, 9], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def under(lst: list, limit: int) -> list:
    """ Return a new list of the numbers of lst under limit. """
    result = []
    for number in lst:
        if number < limit:
            result.append(number)
    return result
```

### Wrong answers the tests must catch

```python # wrong: lets a number equal to the limit through
def under(lst: list, limit: int) -> list:
    """ Uses <= so the limit itself survives. """
    return [number for number in lst if number <= limit]
```

```python # wrong: keeps the ones over the limit
def under(lst: list, limit: int) -> list:
    """ Compares the wrong way round. """
    return [number for number in lst if number > limit]
```

```python # wrong: filters nothing
def under(lst: list, limit: int) -> list:
    """ Hands the list straight back. """
    return lst
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
<\s*limit
```

### Shortcuts the tests reject outright

```text # banned
```
