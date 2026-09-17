---
title: "Python G45 - Words with No Vowel"
---

# Words with No Vowel

## Instructions

Write a function `no_vowel(lst: list) -> list` that returns a new list holding only the words of `lst` that contain no vowel at all.

Return a new list and leave the one you were given unchanged.

## Description

### Goal

Keep the words you cannot really pronounce. A word survives only when not one
of its letters is a vowel.

### Rules

- The vowels are a, e, i, o and u, in **either case**, so `"SOL"` has one and
  is thrown out.
- Every letter has to be innocent. One vowel anywhere condemns the whole word.
- A word with no letters has no vowel either, so it is kept.
- Build and return a **new** list; the input must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `no_vowel(["sol", "psst"])` | `["psst"]` |
| `no_vowel(["SOL"])` | `[]` |
| `no_vowel(["brr", "shh"])` | `["brr", "shh"]` |
| `no_vowel([""])` | `[""]` |
| `no_vowel([])` | `[]` |

### Things you will need

`in` asks whether one string turns up inside another:

```python
for char in "abc":
    print(char in "xyz")
```

`.lower()` hands back a copy of a string with every capital brought down, which
is one way to stop worrying about case:

```python
print("Perro".lower())
```

A word is a row of letters, so you can walk it the same way you walk a list.

### Which order do you need?

`B12` decided about a number by asking one question. Deciding about a word here
needs an answer about **every** letter in it before you can say yes. How do you
hold on to that verdict while you are still looking?

## Starter code

```python # template
def no_vowel(lst: list) -> list:
    """ Return the words of lst that hold no vowel, e.g. ["psst"] for ["sol", "psst"].

    >>> no_vowel(["sol", "psst"])
    ['psst']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(no_vowel(["sol", "psst", "brr"]))
```

## Tests

```python # tests
assert no_vowel(["sol", "psst"]) == ["psst"], f"Got: {no_vowel(['sol', 'psst'])}"
# Upper case counts: a lower-case-only check keeps "SOL" by mistake
assert no_vowel(["SOL"]) == [], f"Got: {no_vowel(['SOL'])}"
assert no_vowel(["PSST"]) == ["PSST"], f"Got: {no_vowel(['PSST'])}"
assert no_vowel([]) == [], f"Got: {no_vowel([])}"
# A word with no letters has no vowel, so it stays
assert no_vowel([""]) == [""], f"Got: {no_vowel([''])}"
assert no_vowel(["brr", "shh"]) == ["brr", "shh"], f"Got: {no_vowel(['brr', 'shh'])}"
assert no_vowel(["ana"]) == [], f"Got: {no_vowel(['ana'])}"
# One vowel is enough to condemn a word, wherever it sits
_mixed = no_vowel(["ritmo", "nsq", "Uh"])
assert _mixed == ["nsq"], f"Got: {_mixed}"
# A verdict that is not reset per word would let "psst" drag "sol" down
_pair = no_vowel(["psst", "sol", "brr"])
assert _pair == ["psst", "brr"], f"Got: {_pair}"
_src = ["sol", "psst"]
no_vowel(_src)
assert _src == ["sol", "psst"], f"Got: the input was modified into {_src}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def no_vowel(lst: list) -> list:
    """ Return the words of lst that hold no vowel. """
    result = []
    for word in lst:
        clean = True
        for char in word.lower():
            if char in "aeiou":
                clean = False
        if clean:
            result.append(word)
    return result
```

### Wrong answers the tests must catch

```python # wrong: only looks for lower-case vowels, so "SOL" survives
def no_vowel(lst: list) -> list:
    """ Forgets the capitals. """
    result = []
    for word in lst:
        clean = True
        for char in word:
            if char in "aeiou":
                clean = False
        if clean:
            result.append(word)
    return result
```

```python # wrong: keeps the words that DO have a vowel
def no_vowel(lst: list) -> list:
    """ Decides the wrong way round. """
    result = []
    for word in lst:
        for char in word.lower():
            if char in "aeiou":
                result.append(word)
                break
    return result
```

```python # wrong: throws the empty word away as well
def no_vowel(lst: list) -> list:
    """ Demands at least one letter. """
    result = []
    for word in lst:
        if not word:
            continue
        clean = True
        for char in word.lower():
            if char in "aeiou":
                clean = False
        if clean:
            result.append(word)
    return result
```

```python # wrong: judges only the first letter of each word
def no_vowel(lst: list) -> list:
    """ Stops looking too early. """
    result = []
    for word in lst:
        if not word or word.lower()[0] not in "aeiou":
            result.append(word)
    return result
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+lst\b
"aeiou"
in\s+word\.lower
```

### Shortcuts the tests reject outright

```text # banned
```
