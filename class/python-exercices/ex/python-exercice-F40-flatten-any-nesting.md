---
title: "Python F40 - Flatten Any Nesting"
---

# Flatten Any Nesting

## Instructions

Write a function `flatten_deep(nested: list) -> list` that returns one flat list holding every value found anywhere inside `nested`, however deeply it is buried.

Return the new list, do not print it.

## Description

### Goal

`F30` took off exactly one layer of brackets. This time there is no promise about
how deep the boxes go: a value may sit at the top, or inside a list, inside a
list, inside a list. Dig all of it out and lay it in one flat line, left to right.

### Rules

- Every value comes out, no matter how deep it was.
- Order is the order you meet things reading left to right.
- Empty lists contribute nothing and disappear entirely.
- A string is a **value**, not a box. `"ab"` comes out as `"ab"`, never as `"a"` and `"b"`.
- Build and return a **new** list; `nested` must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `flatten_deep([[[1, 2]], [3], [[4], 5]])` | `[1, 2, 3, 4, 5]` |
| `flatten_deep([1, [2, [3, [4]]]])` | `[1, 2, 3, 4]` |
| `flatten_deep([1, 2])` | `[1, 2]` |
| `flatten_deep([[], []])` | `[]` |
| `flatten_deep([])` | `[]` |

The second row is the point of the exercise. The `4` is four layers down, and
nothing in your code is allowed to know the number four.

### Things you will need

`isinstance` answers one question: is this thing a list, or is it a plain value?

```python
for thing in [7, ["a"], "hola"]:
    print(isinstance(thing, list))
```

A function is allowed to call itself. Here is one that counts down without any
list involved:

```python
def countdown(num: int) -> list:
    """ Return the numbers from num down to 1. """
    if num <= 0:
        return []
    return [num] + countdown(num - 1)


print(countdown(4))
```

Notice what makes it stop: a case that answers without calling itself again.

### Which order do you need?

You meet one thing at a time, and it is one of two kinds. For a plain value the
job is obvious. For a list, you are facing exactly the same problem you started
with, only smaller. What can you call to solve that smaller problem, and how do
its results join the answer you are building?

## Starter code

```python # template
def flatten_deep(nested: list) -> list:
    """ Return every value inside nested at any depth, e.g. [1, 2, 3] for [1, [2, [3]]].

    >>> flatten_deep([1, [2, [3]]])
    [1, 2, 3]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(flatten_deep([[[1, 2]], [3], [[4], 5]]))
```

## Tests

```python # tests
assert flatten_deep([[[1, 2]], [3], [[4], 5]]) == [1, 2, 3, 4, 5], \
    f"Got: {flatten_deep([[[1, 2]], [3], [[4], 5]])}"
assert flatten_deep([]) == [], f"Got: {flatten_deep([])}"
# Already flat: nothing to dig, nothing to lose
assert flatten_deep([1, 2]) == [1, 2], f"Got: {flatten_deep([1, 2])}"
# One level only would leave [2, [3, [4]]] behind: this pins "any depth"
assert flatten_deep([1, [2, [3, [4]]]]) == [1, 2, 3, 4], \
    f"Got: {flatten_deep([1, [2, [3, [4]]]])}"
# Two levels only would still leave the 5 boxed
assert flatten_deep([[[[5]]]]) == [5], f"Got: {flatten_deep([[[[5]]]])}"
# Values at different depths, mixed together, keep their left-to-right order
assert flatten_deep([1, [2], [[3]], 4]) == [1, 2, 3, 4], \
    f"Got: {flatten_deep([1, [2], [[3]], 4])}"
assert flatten_deep([[9, [8]], 7]) == [9, 8, 7], f"Got: {flatten_deep([[9, [8]], 7])}"
# Empty lists vanish at every depth
assert flatten_deep([[], []]) == [], f"Got: {flatten_deep([[], []])}"
assert flatten_deep([[[], [1]], []]) == [1], f"Got: {flatten_deep([[[], [1]], []])}"
# A string is a value, never a box to open
assert flatten_deep(["ab", ["cd"]]) == ["ab", "cd"], \
    f"Got: {flatten_deep(['ab', ['cd']])}"
assert flatten_deep([["hola"]]) == ["hola"], f"Got: {flatten_deep([['hola']])}"
# Repeats are kept and order is never sorted
assert flatten_deep([[3, 1], [[1]]]) == [3, 1, 1], f"Got: {flatten_deep([[3, 1], [[1]]])}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [1, [2, [3, [4, [5, [6]]]]]]
assert flatten_deep(_generated) == [1, 2, 3, 4, 5, 6], f"Got: {flatten_deep(_generated)}"
# The caller's structure comes back untouched
_original = [1, [2, [3]]]
flatten_deep(_original)
assert _original == [1, [2, [3]]], f"Got: the input became {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def flatten_deep(nested: list) -> list:
    """ Return every value inside nested at any depth. """
    flat = []
    for thing in nested:
        if isinstance(thing, list):
            for value in flatten_deep(thing):
                flat.append(value)
        else:
            flat.append(thing)
    return flat
```

### Wrong answers the tests must catch

```python # wrong: takes off exactly one layer, like F30
def flatten_deep(nested: list) -> list:
    flat = []
    for row in nested:
        for cell in row:
            flat.append(cell)
    return flat
```

```python # wrong: goes exactly two layers down and stops
def flatten_deep(nested: list) -> list:
    flat = []
    for thing in nested:
        if isinstance(thing, list):
            for inner in thing:
                if isinstance(inner, list):
                    for deeper in inner:
                        flat.append(deeper)
                else:
                    flat.append(inner)
        else:
            flat.append(thing)
    return flat
```

```python # wrong: returns the input untouched
def flatten_deep(nested: list) -> list:
    return list(nested)
```

```python # wrong: opens strings as well, so "ab" falls apart into "a" and "b"
def flatten_deep(nested: list) -> list:
    flat = []
    for thing in nested:
        if isinstance(thing, list):
            for value in flatten_deep(thing):
                flat.append(value)
        elif isinstance(thing, str) and len(thing) > 1:
            for char in thing:
                flat.append(char)
        else:
            flat.append(thing)
    return flat
```

```python # wrong: keeps only the values sitting at the top level
def flatten_deep(nested: list) -> list:
    flat = []
    for thing in nested:
        if not isinstance(thing, list):
            flat.append(thing)
    return flat
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+nested
flatten_deep\(\w+\)
flat\.append
```

### Shortcuts the tests reject outright

```text # banned
```
