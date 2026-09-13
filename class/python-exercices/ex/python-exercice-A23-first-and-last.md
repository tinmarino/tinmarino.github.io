---
title: "Python A23 - First and Last"
---

# First and Last

## Instructions

Write a function `ends(lst: list) -> list` that returns a new two-element list `[first, last]` holding the first and last elements of `lst`, or `[]` when `lst` is empty.

Return the list, do not print it.

## Description

### Goal

Hand back a small list with just the two ends of `lst`: its first element and
its last. For `[3, 1, 4, 1, 5]` that is `[3, 5]`. When there is only one
element it is both the first and the last, so the answer is `[x, x]`. An empty
list has no ends, so hand back `[]`.

### Rules

- Return a new list, do not print it.
- A one-element list gives `[x, x]`: the same value twice.
- The empty list has no first or last element &mdash; reaching for one crashes,
  so check for it first and return `[]`.

### Examples

| Call | Returns |
|---|---|
| `ends([3, 1, 4, 1, 5])` | `[3, 5]` |
| `ends([7, 8])` | `[7, 8]` |
| `ends([9])` | `[9, 9]` |
| `ends([])` | `[]` |

### Things you will need

Position `0` is the first element of a list and position `-1` is the last:

```python
for row in [[10, 20, 30], [4, 5]]:
    print(row[0], row[-1])
```

You build a new list by putting values inside square brackets, `[a, b]`.

### Which order do you need?

What must you check before you read the first and last elements, so an empty
list does not crash you?

## Starter code

```python # template
def ends(lst: list) -> list:
    """ Return [first, last] of `lst`, or [] when empty, e.g. [3, 5] for [3, 1, 4, 1, 5].

    >>> ends([3, 1, 4, 1, 5])
    [3, 5]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(ends([3, 1, 4, 1, 5]))
```

## Tests

```python # tests
assert ends([3, 1, 4, 1, 5]) == [3, 5], f"Got: {ends([3, 1, 4, 1, 5])}"
assert ends([7, 8]) == [7, 8], f"Got: {ends([7, 8])}"
assert ends([9]) == [9, 9], f"Got: {ends([9])}"
assert ends([]) == [], f"Got: {ends([])}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def ends(lst: list) -> list:
    """ Return [first, last] of `lst`, or [] when empty, e.g. [3, 5] for [3, 1, 4, 1, 5]. """
    if lst == []:
        return []
    return [lst[0], lst[-1]]
```

### Wrong answers the tests must catch

```python # wrong: puts the ends in the wrong order
def ends(lst: list) -> list:
    """ Return [last, first] instead of [first, last]. """
    if lst == []:
        return []
    return [lst[-1], lst[0]]
```

```python # wrong: returns a tuple, not a list
def ends(lst: list) -> list:
    """ Hand back a tuple by leaving out the brackets. """
    if lst == []:
        return []
    return lst[0], lst[-1]
```

### Give-aways the Description must never contain

```text # forbidden
\[lst\[0\],\s*lst\[-1\]\]
return\s+\[lst\[0\]
```

### Shortcuts the tests reject outright

```text # banned
```
