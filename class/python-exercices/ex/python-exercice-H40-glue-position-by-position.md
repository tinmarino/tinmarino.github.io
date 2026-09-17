---
title: "Python H40 - Glue Them Position by Position"
---

# Glue Them Position by Position

## Instructions

Write a function `glue(left: list, right: list) -> list` that returns a new list where each position holds the two strings of that position stuck together, the one from `left` first.

The two lists always have the same length. Return a new list, do not print it.

## Description

### Goal

Two lists of word halves arrive and you have to put them back together, in
order, the first half in front. `["Py", "is"]` and `["thon", " ok"]` give
`["Python", "is ok"]`.

### Rules

- The first list supplies the **front** of each word, the second the back.
  Getting them the other way round gives `"thonPy"`, which is not a word.
- The answer has the **same length** as the inputs.
- The two lists always have the same length.
- An empty string is a perfectly good half: it just adds nothing.
- Build and return a **new** list; both inputs must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `glue(["Py", "is"], ["thon", " ok"])` | `["Python", "is ok"]` |
| `glue(["a"], ["b"])` | `["ab"]` |
| `glue(["a"], [""])` | `["a"]` |
| `glue(["", "b"], ["a", ""])` | `["a", "b"]` |
| `glue([], [])` | `[]` |

### Things you will need

`+` on two strings sticks them together, and the order you write them is the
order they come out:

```python
print("hola" + "mundo")
print("mundo" + "hola")
```

`zip` walks two lists side by side, handing you one value from each per turn:

```python
for letter, size in zip(["a", "b"], ["x", "y"]):
    print(letter, size)
```

### Which order do you need?

Each turn hands you two halves. Which one goes in front? The examples answer it
for you if you read `"Python"` carefully.

## Starter code

```python # template
def glue(left: list, right: list) -> list:
    """ Return a new list sticking each pair of strings together, e.g. ["ab"] for (["a"], ["b"]).

    >>> glue(["a"], ["b"])
    ['ab']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(glue(["Py", "is"], ["thon", " ok"]))
```

## Tests

```python # tests
assert glue(["Py", "is"], ["thon", " ok"]) == ["Python", "is ok"], \
    f"Got: {glue(['Py', 'is'], ['thon', ' ok'])}"
# Swapping the halves gives "ba", so the order of the join is really pinned
assert glue(["a"], ["b"]) == ["ab"], f"Got: {glue(['a'], ['b'])}"
assert glue(["b"], ["a"]) == ["ba"], f"Got: {glue(['b'], ['a'])}"
# Three positions, all of them glued
assert glue(["x", "y", "z"], ["1", "2", "3"]) == ["x1", "y2", "z3"], \
    f"Got: {glue(['x', 'y', 'z'], ['1', '2', '3'])}"
# An empty half contributes nothing but must not be skipped
assert glue(["a"], [""]) == ["a"], f"Got: {glue(['a'], [''])}"
assert glue([""], ["b"]) == ["b"], f"Got: {glue([''], ['b'])}"
assert glue(["", "b"], ["a", ""]) == ["a", "b"], f"Got: {glue(['', 'b'], ['a', ''])}"
assert glue([], []) == [], f"Got: {glue([], [])}"
# The answer is as long as one input, never as long as both together
assert len(glue(["a", "b"], ["c", "d"])) == 2, f"Got: {len(glue(['a', 'b'], ['c', 'd']))}"
# Real halves, so a wrong pairing is visible at a glance
assert glue(["ca", "pe"], ["sa", "rro"]) == ["casa", "perro"], \
    f"Got: {glue(['ca', 'pe'], ['sa', 'rro'])}"
# Neither list may be modified
_left, _right = ["Py", "is"], ["thon", " ok"]
glue(_left, _right)
assert _left == ["Py", "is"], f"Got: the first list was modified into {_left}"
assert _right == ["thon", " ok"], f"Got: the second list was modified into {_right}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def glue(left: list, right: list) -> list:
    """ Return a new list sticking each pair of strings together, left half first. """
    result = []
    for front, back in zip(left, right):
        result.append(front + back)
    return result
```

### Wrong answers the tests must catch

```python # wrong: glues the halves the other way round
def glue(left: list, right: list) -> list:
    """ Builds "thonPy" instead of "Python". """
    result = []
    for front, back in zip(left, right):
        result.append(back + front)
    return result
```

```python # wrong: sticks the two lists together instead of their strings
def glue(left: list, right: list) -> list:
    """ Concatenates the lists, so the answer is twice too long. """
    return left + right
```

```python # wrong: hands back the first list untouched
def glue(left: list, right: list) -> list:
    """ Never looks at the second list. """
    return left
```

```python # wrong: glues everything into a single string
def glue(left: list, right: list) -> list:
    """ Loses the one-entry-per-position shape. """
    joined = ""
    for front, back in zip(left, right):
        joined += front + back
    return [joined]
```

### Give-aways the Description must never contain

```text # forbidden
zip\(left
zip\(\s*left\s*,\s*right
front\s*\+\s*back
```

### Shortcuts the tests reject outright

```text # banned
```
