---
title: "Python G30 - First Letter of Every Word"
---

# First Letter of Every Word

## Instructions

Write a function `initials(lst: list) -> list` that returns a new list holding the first letter of every word of `lst`.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

Turn a list of words into a list of their initials, one for one, in order.
`["ana", "luz"]` becomes `["a", "l"]`.

### Rules

- One letter comes out for each word that goes in, so the answer is as long as
  the input.
- The case is left alone: `"Ana"` gives `"A"`, not `"a"`.
- A word with no letters at all has no first letter, so it contributes the
  empty string `""`. Reaching into it blindly will crash.
- Build and return a **new** list; the input must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `initials(["ana", "luz"])` | `["a", "l"]` |
| `initials(["Ana"])` | `["A"]` |
| `initials(["sol", "", "mar"])` | `["s", "", "m"]` |
| `initials([""])` | `[""]` |
| `initials([])` | `[]` |

### Things you will need

A string is a row of characters, and the one at the front is numbered `0`:

```python
for animal in ["perro", "gato"]:
    print(animal[0])
```

An empty string has no character to ask for, and `len` is how you find that
out before you ask:

```python
print(len(""))
```

### Which order do you need?

Most words hand over their first letter without a fuss. One kind of word
cannot. What do you have to check before you reach in?

## Starter code

```python # template
def initials(lst: list) -> list:
    """ Return the first letter of every word of lst, e.g. ["a", "l"] for ["ana", "luz"].

    >>> initials(["ana", "luz"])
    ['a', 'l']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(initials(["ana", "luz", "sol"]))
```

## Tests

```python # tests
assert initials(["ana", "luz"]) == ["a", "l"], f"Got: {initials(['ana', 'luz'])}"
# A word with no letters has no first one: reaching in crashes
try:
    _empty_word = initials([""])
except IndexError as _error:
    _empty_word = f"crashed on an empty word: {_error!r}"
assert _empty_word == [""], f"Got: {_empty_word}"
assert initials([]) == [], f"Got: {initials([])}"
# The first letter is not the last one: "luz" tells the two apart
_three = initials(["sol", "luz", "mar"])
assert _three == ["s", "l", "m"], f"Got: {_three}"
# The case survives untouched
assert initials(["Ana"]) == ["A"], f"Got: {initials(['Ana'])}"
assert initials(["x"]) == ["x"], f"Got: {initials(['x'])}"
# An empty word sitting between two real ones keeps its place in the answer
try:
    _mixed = initials(["sol", "", "mar"])
except IndexError as _error:
    _mixed = f"crashed on an empty word: {_error!r}"
assert _mixed == ["s", "", "m"], f"Got: {_mixed}"
_src = ["ana", "luz"]
initials(_src)
assert _src == ["ana", "luz"], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def initials(lst: list) -> list:
    """ Return the first letter of every word of lst. """
    result = []
    for word in lst:
        if len(word) == 0:
            result.append("")
        else:
            result.append(word[0])
    return result
```

### Wrong answers the tests must catch

```python # wrong: crashes on a word with no letters
def initials(lst: list) -> list:
    """ Reaches in without looking. """
    return [word[0] for word in lst]
```

```python # wrong: hands back the whole words
def initials(lst: list) -> list:
    """ Cuts nothing off. """
    return list(lst)
```

```python # wrong: takes the last letter instead of the first
def initials(lst: list) -> list:
    """ Reads from the wrong end. """
    result = []
    for word in lst:
        if len(word) == 0:
            result.append("")
        else:
            result.append(word[-1])
    return result
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
lst\[0\]
word\[0\]
```

### Shortcuts the tests reject outright

```text # banned
```
