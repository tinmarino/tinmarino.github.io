---
title: "Python G75 - Cheap and Expensive"
---

# Cheap and Expensive

## Instructions

Write a function `split_price(items: list, limit: int) -> list` that returns `[[cheap names], [expensive names]]`, where cheap means the price is below `limit`.

Return the names, not the whole records.

## Description

### Goal

Walk the basket once and come back with **two** answers instead of one: the things
you can afford, and the things you cannot.

```text
[["pan", 1200], ["vino", 8900]]   with a limit of 5000
    gives   [["pan"], ["vino"]]
```

### Rules

- Return the number of pesos nowhere: the answer holds **names** only.
- The result is always a list of exactly two lists: cheap first, expensive second.
- A price **below** `limit` is cheap. A price exactly equal to `limit` is **not**
  cheap; it counts as expensive.
- Keep each name in the order it appeared in the basket.
- An empty basket gives `[[], []]`, two empty lists and not one.

### Examples

| Call | Returns |
|---|---|
| `split_price([["pan", 1200], ["vino", 8900]], 5000)` | `[["pan"], ["vino"]]` |
| `split_price([["pan", 5000]], 5000)` | `[[], ["pan"]]` |
| `split_price([["pan", 4999]], 5000)` | `[["pan"], []]` |
| `split_price([], 5000)` | `[[], []]` |

### Things you will need

You know how to build one answer while a loop runs. Nothing stops you building two:

```python
def count_case(word: str) -> list:
    """ Return [how many capitals, how many small letters] in word. """
    big = 0
    small = 0
    for letter in word:
        if letter == letter.upper():
            big += 1
        else:
            small += 1
    return [big, small]


print(count_case("Hola"))
```

Two things to notice. Both counters are set up **before** the loop, not inside it,
because something created inside a loop is born again on every turn. And the two of
them travel home together, packed into one list at the end.

### Below, or not above?

One line of the Rules is doing more work than it looks. Read the `5000` row of the
Examples table and decide, before you write anything, which of the two lists that
item belongs in. Then check that the test in your `if` agrees with you.

That is the difference between `<` and `<=`, and it is exactly one character.

## Starter code

```python # template
def split_price(items: list, limit: int) -> list:
    """ Return [[cheap names], [expensive names]] for the basket, split at limit.

    >>> split_price([["pan", 1200], ["vino", 8900]], 5000)
    [['pan'], ['vino']]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(split_price([["pan", 1200], ["vino", 8900], ["té", 2300]], 5000))
```

## Tests

```python # tests
assert split_price([], 5000) == [[], []], f"Got: {split_price([], 5000)}"
# The heart of it: cheap first, expensive second, names only
assert split_price([["pan", 1200], ["vino", 8900]], 5000) == [["pan"], ["vino"]], \
    f"Got: {split_price([['pan', 1200], ['vino', 8900]], 5000)}"
# Exactly ON the limit: this is what separates < from <=
assert split_price([["pan", 5000]], 5000) == [[], ["pan"]], \
    f"Got: {split_price([['pan', 5000]], 5000)}"
# One peso under the limit is cheap
assert split_price([["pan", 4999]], 5000) == [["pan"], []], \
    f"Got: {split_price([['pan', 4999]], 5000)}"
# Everything cheap, so the second list must still be there and be empty
assert split_price([["pan", 100], ["té", 200]], 5000) == [["pan", "té"], []], \
    f"Got: {split_price([['pan', 100], ['té', 200]], 5000)}"
# Everything expensive
assert split_price([["vino", 8900], ["pisco", 7000]], 5000) == [[], ["vino", "pisco"]], \
    f"Got: {split_price([['vino', 8900], ['pisco', 7000]], 5000)}"
# The order inside each list follows the basket, not the price
_mixed = [["vino", 8900], ["pan", 1200], ["pisco", 7000], ["té", 2300]]
_got = split_price(_mixed, 5000)
assert _got == [["pan", "té"], ["vino", "pisco"]], f"Got: {_got}"
# A free sample is below any limit
assert split_price([["muestra", 0]], 1) == [["muestra"], []], \
    f"Got: {split_price([['muestra', 0]], 1)}"
# Two items sharing a name are two items
assert split_price([["pan", 100], ["pan", 9000]], 5000) == [["pan"], ["pan"]], \
    f"Got: {split_price([['pan', 100], ['pan', 9000]], 5000)}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [[f"item{_step}", _step * 100] for _step in range(10)]
_want = [["item0", "item1", "item2", "item3", "item4"],
         ["item5", "item6", "item7", "item8", "item9"]]
_got = split_price(_generated, 500)
assert _got == _want, f"Got: {_got}"
# The caller's basket must come back untouched
_original = [["pan", 1200], ["vino", 8900]]
split_price(_original, 5000)
assert _original == [["pan", 1200], ["vino", 8900]], \
    f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def split_price(items: list, limit: int) -> list:
    """ Return [[cheap names], [expensive names]] for the basket, split at limit. """
    cheap = []
    dear = []
    for item in items:
        if item[1] < limit:
            cheap.append(item[0])
        else:
            dear.append(item[0])
    return [cheap, dear]
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: uses <= so an item priced exactly at the limit lands in cheap
def split_price(items: list, limit: int) -> list:
    cheap = []
    dear = []
    for item in items:
        if item[1] <= limit:
            cheap.append(item[0])
        else:
            dear.append(item[0])
    return [cheap, dear]
```

```python # wrong: returns the two lists the wrong way round
def split_price(items: list, limit: int) -> list:
    cheap = []
    dear = []
    for item in items:
        if item[1] < limit:
            cheap.append(item[0])
        else:
            dear.append(item[0])
    return [dear, cheap]
```

```python # wrong: keeps the whole record instead of just the name
def split_price(items: list, limit: int) -> list:
    cheap = []
    dear = []
    for item in items:
        if item[1] < limit:
            cheap.append(item)
        else:
            dear.append(item)
    return [cheap, dear]
```

```python # wrong: creates the lists inside the loop, so only the last item survives
def split_price(items: list, limit: int) -> list:
    cheap = []
    dear = []
    for item in items:
        cheap = []
        dear = []
        if item[1] < limit:
            cheap.append(item[0])
        else:
            dear.append(item[0])
    return [cheap, dear]
```

```python # wrong: returns one flat list of the cheap names only
def split_price(items: list, limit: int) -> list:
    cheap = []
    for item in items:
        if item[1] < limit:
            cheap.append(item[0])
    return cheap
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+items
item\[0\]
item\[1\]
cheap\s*=\s*\[\]
return\s*\[cheap
```

### Shortcuts the tests reject outright

```text # banned
```
