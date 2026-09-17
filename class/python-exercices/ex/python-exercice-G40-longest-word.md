---
title: "Python G40 - The Longest Word"
---

# The Longest Word

## Instructions

Write a function `longest_word(lst: list) -> str` that returns the longest word of `lst`, or `""` when the list is empty.

Return the word itself, not its length.

## Description

### Goal

Walk a list of words and come back holding the longest one. You did this with
numbers in `B20`; the only thing that changes is what "biggest" means.

### Rules

- Return the **word**, not how long it was.
- When two words tie for longest, the **first** of them wins.
- An empty list has no words at all, so return `""` rather than crashing.

### Examples

| Call | Returns |
|---|---|
| `longest_word(["sol", "ballena", "mar"])` | `"ballena"` |
| `longest_word(["sol", "mar"])` | `"sol"` |
| `longest_word(["a", "bb", "ccc"])` | `"ccc"` |
| `longest_word(["uno"])` | `"uno"` |
| `longest_word([])` | `""` |

### Things you will need

`len` measures a word the same way it measures a list:

```python
for animal in ["perro", "gato"]:
    print(len(animal))
```

`B20` kept a champion and replaced it whenever something beat it. The same
shape works here.

### Which order do you need?

Two words are the same length. The rule says the earlier one wins. Does your
comparison replace the champion on a tie, or leave it standing?

## Starter code

```python # template
def longest_word(lst: list) -> str:
    """ Return the longest word of lst, e.g. "ballena" for ["sol", "ballena"].

    >>> longest_word(["sol", "ballena", "mar"])
    'ballena'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(longest_word(["sol", "ballena", "mar"]))
```

## Tests

```python # tests
_three = longest_word(["sol", "ballena", "mar"])
assert _three == "ballena", f"Got: {_three}"
# A tie: "sol" and "mar" are both three long, so the FIRST one wins
_tie = longest_word(["sol", "mar"])
assert _tie == "sol", f"Got: {_tie}"
# An empty list has no words, so it must not crash
try:
    _empty = longest_word([])
except (IndexError, ValueError) as _error:
    _empty = f"crashed on an empty list: {_error!r}"
assert _empty == "", f"Got: {_empty}"
assert longest_word(["uno"]) == "uno", f"Got: {longest_word(['uno'])}"
# The longest arrives first, so a loop that starts comparing too late misses it
_first = longest_word(["ballena", "sol"])
assert _first == "ballena", f"Got: {_first}"
# The longest arrives last, so a loop that stops too early misses it
_last = longest_word(["a", "bb", "ccc"])
assert _last == "ccc", f"Got: {_last}"
# Every word is empty: the answer is still a word, not a crash
_blanks = longest_word(["", ""])
assert _blanks == "", f"Got: {_blanks}"
# A dip in the middle: the first word longer than its neighbour is not the answer
_animals = longest_word(["gato", "pez", "caballo"])
assert _animals == "caballo", f"Got: {_animals}"
_src = ["sol", "ballena"]
longest_word(_src)
assert _src == ["sol", "ballena"], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def longest_word(lst: list) -> str:
    """ Return the longest word of lst, or "" when it is empty. """
    champion = ""
    for word in lst:
        if len(word) > len(champion):
            champion = word
    return champion
```

### Wrong answers the tests must catch

```python # wrong: a tie hands the prize to the later word
def longest_word(lst: list) -> str:
    """ Uses >= so a same-length word later on takes over. """
    champion = ""
    for word in lst:
        if len(word) >= len(champion):
            champion = word
    return champion
```

```python # wrong: never compares, just takes the first word
def longest_word(lst: list) -> str:
    """ Returns the front of the list. """
    if not lst:
        return ""
    return lst[0]
```

```python # wrong: compares the wrong way round and finds the shortest
def longest_word(lst: list) -> str:
    """ Keeps the smallest instead. """
    if not lst:
        return ""
    champion = lst[0]
    for word in lst:
        if len(word) < len(champion):
            champion = word
    return champion
```

```python # wrong: returns the length instead of the word
def longest_word(lst: list) -> str:
    """ Answers the wrong question. """
    champion = 0
    for word in lst:
        if len(word) > champion:
            champion = len(word)
    return champion
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
len\(\w+\)\s*>\s*len\(
champion\s*=\s*\w+
```

### Shortcuts the tests reject outright

```text # banned
```
