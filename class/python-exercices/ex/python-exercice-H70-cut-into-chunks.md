---
title: "Python H70 - Cut Into Chunks"
---

# Cut Into Chunks

## Instructions

Write a function `chunks(lst: list, size: int) -> list` that returns a list of lists, cutting `lst` into pieces of `size` items each, with a shorter piece at the end when the items do not divide evenly.

Return the list of pieces, do not print it.

## Description

### Goal

You are printing name tags four to a page. Given the whole list and the page
size, hand back one list per page.

`([1, 2, 3, 4, 5], 2)` gives `[[1, 2], [3, 4], [5]]`: two full pieces and a last
one holding whatever was left over.

### Rules

- Every piece holds `size` items, except possibly the last one.
- The leftovers still count. `[5]` is a real piece and must appear.
- When the items divide evenly there is **no** leftover piece, and certainly not
  an empty one: `([1, 2, 3, 4], 2)` gives two pieces, not three.
- An empty list gives an empty list of pieces, `[]`.
- If `size` is larger than the whole list, you get one short piece.

### Examples

| Call | Returns |
|---|---|
| `chunks([1, 2, 3, 4, 5], 2)` | `[[1, 2], [3, 4], [5]]` |
| `chunks([1, 2, 3, 4], 2)` | `[[1, 2], [3, 4]]` |
| `chunks([1, 2, 3], 1)` | `[[1], [2], [3]]` |
| `chunks([1, 2], 5)` | `[[1, 2]]` |
| `chunks([], 2)` | `[]` |

Compare the first two rows. Five items leave one behind; four do not. The same
code has to get both right, and that is where most attempts break.

### Things you will need

A list can hold other lists, and you build it by appending whole lists into it:

```python
pages = []
pages.append(["ana", "luz"])
pages.append(["eva"])
print(pages)
```

`len` tells you how many items a list is holding right now, which is how you
know when something is full:

```python
basket = ["pan", "sal"]
print(len(basket))
print(len(basket) == 2)
```

### Which order do you need?

You are filling one piece at a time. What do you do to the piece you are filling
when it reaches the size you were given? And when the loop is over, what might
still be sitting in your hands &mdash; and how do you know whether it is worth
keeping?

## Starter code

```python # template
def chunks(lst: list, size: int) -> list:
    """ Return lst cut into lists of size items, e.g. [[1, 2], [3]] for ([1, 2, 3], 2).

    >>> chunks([1, 2, 3], 2)
    [[1, 2], [3]]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(chunks([1, 2, 3, 4, 5], 2))
```

## Tests

```python # tests
# Leftovers at the end: the short last piece must be there
assert chunks([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]], \
    f"Got: {chunks([1, 2, 3, 4, 5], 2)}"
# Divides evenly: there must be NO extra piece, and no empty one
assert chunks([1, 2, 3, 4], 2) == [[1, 2], [3, 4]], f"Got: {chunks([1, 2, 3, 4], 2)}"
assert chunks([1, 2, 3, 4, 5, 6], 3) == [[1, 2, 3], [4, 5, 6]], \
    f"Got: {chunks([1, 2, 3, 4, 5, 6], 3)}"
# Divides evenly, then one more item
assert chunks([1, 2, 3, 4, 5, 6, 7], 3) == [[1, 2, 3], [4, 5, 6], [7]], \
    f"Got: {chunks([1, 2, 3, 4, 5, 6, 7], 3)}"
# Pieces of one
assert chunks([1, 2, 3], 1) == [[1], [2], [3]], f"Got: {chunks([1, 2, 3], 1)}"
assert chunks([1], 1) == [[1]], f"Got: {chunks([1], 1)}"
# The piece is bigger than the list, so one short piece comes back
assert chunks([1, 2], 5) == [[1, 2]], f"Got: {chunks([1, 2], 5)}"
assert chunks([1], 4) == [[1]], f"Got: {chunks([1], 4)}"
# Exactly one full piece and nothing else
assert chunks([1, 2], 2) == [[1, 2]], f"Got: {chunks([1, 2], 2)}"
# Nothing at all gives no pieces, not one empty piece
assert chunks([], 2) == [], f"Got: {chunks([], 2)}"
assert chunks([], 1) == [], f"Got: {chunks([], 1)}"
# The answer must really be a list of lists
assert chunks([1, 2, 3], 2)[0] == [1, 2], f"Got: {chunks([1, 2, 3], 2)[0]}"
assert len(chunks([1, 2, 3, 4, 5], 2)) == 3, f"Got: {len(chunks([1, 2, 3, 4, 5], 2))}"
assert len(chunks([1, 2, 3, 4], 2)) == 2, f"Got: {len(chunks([1, 2, 3, 4], 2))}"
# Words cut the same way
assert chunks(["a", "b", "c"], 2) == [["a", "b"], ["c"]], \
    f"Got: {chunks(['a', 'b', 'c'], 2)}"
# The caller's list must come back untouched
_original = [1, 2, 3, 4, 5]
chunks(_original, 2)
assert _original == [1, 2, 3, 4, 5], f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def chunks(lst: list, size: int) -> list:
    """ Return lst cut into lists of size items, the last one possibly shorter. """
    result = []
    current = []
    for item in lst:
        current.append(item)
        if len(current) == size:
            result.append(current)
            current = []
    if current:
        result.append(current)
    return result
```

### Wrong answers the tests must catch

```python # wrong: throws the leftovers away
def chunks(lst: list, size: int) -> list:
    """ Never keeps the short last piece. """
    result = []
    current = []
    for item in lst:
        current.append(item)
        if len(current) == size:
            result.append(current)
            current = []
    return result
```

```python # wrong: always adds a last piece, even when it is empty
def chunks(lst: list, size: int) -> list:
    """ Adds an empty piece whenever the items divide evenly. """
    result = []
    current = []
    for item in lst:
        current.append(item)
        if len(current) == size:
            result.append(current)
            current = []
    result.append(current)
    return result
```

```python # wrong: cuts one item too late, making pieces of size + 1
def chunks(lst: list, size: int) -> list:
    """ Waits until the piece is over-full before cutting. """
    result = []
    current = []
    for item in lst:
        current.append(item)
        if len(current) > size:
            result.append(current)
            current = []
    if current:
        result.append(current)
    return result
```

```python # wrong: never cuts anything, handing back a flat copy
def chunks(lst: list, size: int) -> list:
    """ Forgets that the answer is a list of lists. """
    result = []
    for item in lst:
        result.append(item)
    return result
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
len\(current\)\s*==\s*size
result\.append\(current\)
```

### Shortcuts the tests reject outright

```text # banned
```
