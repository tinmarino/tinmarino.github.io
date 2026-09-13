---
title: "Python E20 - Flatten One Level"
---

# Flatten One Level

## Instructions

Write a function `flatten_once(lst: list) -> list` that returns a single list holding every element of the sub-lists of `lst`, concatenated in order.

## Description

### Goal

You are handed a list of lists. Give back one flat list holding every element of
every sub-list, in the order they appear: first all of the first sub-list's
elements, then all of the second's, and so on.

### Rules

- Return a new list. The list you were given, and its sub-lists, must come out
  **unchanged**.
- Only **one** level comes off. A sub-list nested inside a sub-list stays a list
  in the result &mdash; you are not asked to flatten all the way down.
- An empty sub-list contributes nothing.
- `return` the list, do not `print` it.

### Examples

| Call | Returns |
|---|---|
| `flatten_once([[1, 2], [3], [4, 5]])` | `[1, 2, 3, 4, 5]` |
| `flatten_once([[], [1]])` | `[1]` |
| `flatten_once([])` | `[]` |
| `flatten_once([[1, [2, 3]], [4]])` | `[1, [2, 3], 4]` |

Look at the last row. `[2, 3]` came in nested one level down inside the first
sub-list, and it goes into the result exactly as it arrived &mdash; still a list,
still nested. Only the outer layer of brackets disappears.

### Things you will need

Adding one element at a time to a list you are building up:

```python
seen = []
for num in [10, 20, 30]:
    seen.append(num)
print(seen)    # [10, 20, 30]
```

A list can hold anything, sub-lists included, and walking one list's elements
says nothing about what is inside each element:

```python
for group in [["x", "y"], ["z"]]:
    print(group)
# prints ['x', 'y']
# then  ['z']
```

### Which order do you need?

You are walking a list of sub-lists, and inside each sub-list you want every
element, in order, added to the same running result. That is a loop that visits
sub-lists, and for each one, a loop that visits its elements. Which one goes
inside the other?

## Starter code

```python # template
def flatten_once(lst: list) -> list:
    """ Return every element of the sub-lists of lst, concatenated in order.

    >>> flatten_once([[1, 2], [3], [4, 5]])
    [1, 2, 3, 4, 5]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(flatten_once([[1, 2], [3], [4, 5]]))
```

## Tests

```python # tests
assert flatten_once([]) == [], f"Got: {flatten_once([])}"
assert flatten_once([[1, 2], [3], [4, 5]]) == [1, 2, 3, 4, 5], \
    f"Got: {flatten_once([[1, 2], [3], [4, 5]])}"
# An empty sub-list contributes nothing
assert flatten_once([[], [1]]) == [1], f"Got: {flatten_once([[], [1]])}"
assert flatten_once([[1], []]) == [1], f"Got: {flatten_once([[1], []])}"
assert flatten_once([[], []]) == [], f"Got: {flatten_once([[], []])}"
# A single sub-list
assert flatten_once([[7, 8, 9]]) == [7, 8, 9], f"Got: {flatten_once([[7, 8, 9]])}"
# Only one level comes off: a list nested two deep stays a list
assert flatten_once([[1, [2, 3]], [4]]) == [1, [2, 3], 4], \
    f"Got: {flatten_once([[1, [2, 3]], [4]])}"
# Order is preserved across sub-lists, not sorted
assert flatten_once([[3, 1], [2]]) == [3, 1, 2], f"Got: {flatten_once([[3, 1], [2]])}"
# Duplicates are kept, not deduplicated
assert flatten_once([[1, 1], [1]]) == [1, 1, 1], f"Got: {flatten_once([[1, 1], [1]])}"
# Strings are elements too, not something to be split further
assert flatten_once([["a", "b"], ["c"]]) == ["a", "b", "c"], \
    f"Got: {flatten_once([['a', 'b'], ['c']])}"
# The input, sub-lists included, is left unchanged
_original = [[1, 2], [3]]
flatten_once(_original)
assert _original == [[1, 2], [3]], f"Got: the input became {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def flatten_once(lst: list) -> list:
    """ Return every element of the sub-lists of lst, concatenated in order. """
    flat = []
    for group in lst:
        for item in group:
            flat.append(item)
    return flat
```

### Wrong answers the tests must catch

```python # wrong: appends each sub-list itself instead of its elements
def flatten_once(lst: list) -> list:
    flat = []
    for group in lst:
        flat.append(group)
    return flat
```

```python # wrong: only keeps the first sub-list
def flatten_once(lst: list) -> list:
    flat = []
    for item in lst[0] if lst else []:
        flat.append(item)
    return flat
```

```python # wrong: flattens two levels deep instead of stopping at one
def flatten_once(lst: list) -> list:
    flat = []
    for group in lst:
        for item in group:
            if isinstance(item, list):
                for deeper in item:
                    flat.append(deeper)
            else:
                flat.append(item)
    return flat
```

```python # wrong: builds the result by mutating and returning the input's first sub-list
def flatten_once(lst: list) -> list:
    if not lst:
        return []
    flat = lst[0]
    for group in lst[1:]:
        for item in group:
            flat.append(item)
    return flat
```

```python # wrong: skips the first element of every sub-list
def flatten_once(lst: list) -> list:
    flat = []
    for group in lst:
        for item in group[1:]:
            flat.append(item)
    return flat
```

### Give-aways the Description must never contain

```text # forbidden
for\s+group\s+in\s+lst
for\s+item\s+in\s+group
flat\.append
flat\s*=\s*\[\]
```

### Shortcuts the tests reject outright

```text # banned
```
