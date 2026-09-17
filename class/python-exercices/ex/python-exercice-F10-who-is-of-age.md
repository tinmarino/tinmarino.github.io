---
title: "Python F10 - Who Is of Age"
---

# Who Is of Age

## Instructions

Write a function `adults(people: list) -> list` that returns the names of everyone aged 18 or over, in the order they appear.

Return the list of names, do not print it.

## Description

### Goal

A register is not a pile of numbers any more. Each entry is a small list holding
two things: a name and an age, like `["ana", 15]`. Walk the register and hand
back a list of **just the names** of the people who are 18 or over.

### Rules

- 18 counts. Somebody who is exactly 18 is of age.
- Return the **name only**, not the whole entry. `["luz", 22]` contributes `"luz"`.
- Keep the original order. Do not sort anything.
- Build and return a **new** list; the register must come back unchanged.
- An empty register gives an empty list.

### Examples

| Call | Returns |
|---|---|
| `adults([["ana", 15], ["luz", 22]])` | `["luz"]` |
| `adults([["ana", 18]])` | `["ana"]` |
| `adults([["ana", 17]])` | `[]` |
| `adults([["zoe", 40], ["ana", 12], ["luz", 19]])` | `["zoe", "luz"]` |
| `adults([])` | `[]` |

Look at the second row. Eighteen is of age, so it belongs in the answer.

### Things you will need

An entry is an ordinary list, so you reach into it by position. Position `0` is
the first thing stored, position `1` is the second:

```python
for pair in [["rojo", 3], ["azul", 7]]:
    print(pair[0], "aparece", pair[1], "veces")
```

You already know how to collect chosen things into a new list, from `B12`.

### Which order do you need?

You are looking at one entry at a time. Two questions have to be answered for
each one, and they are not the same question: which part of the entry decides
whether it belongs, and which part is the thing you actually keep?

## Starter code

```python # template
def adults(people: list) -> list:
    """ Return the names of everyone aged 18 or over, e.g. ["luz"] for [["ana", 15], ["luz", 22]].

    >>> adults([["ana", 15], ["luz", 22]])
    ['luz']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(adults([["ana", 15], ["luz", 22], ["eva", 18]]))
```

## Tests

```python # tests
assert adults([["ana", 15], ["luz", 22]]) == ["luz"], \
    f"Got: {adults([['ana', 15], ['luz', 22]])}"
# Exactly 18 is of age: a test on "older than 18" fails right here
assert adults([["ana", 18]]) == ["ana"], f"Got: {adults([['ana', 18]])}"
assert adults([["ana", 17]]) == [], f"Got: {adults([['ana', 17]])}"
assert adults([]) == [], f"Got: {adults([])}"
# The name comes back, not the whole entry and not the age
assert adults([["luz", 22]]) == ["luz"], f"Got: {adults([['luz', 22]])}"
# Order is kept as it came in, not sorted and not reversed
assert adults([["zoe", 40], ["ana", 12], ["luz", 19]]) == ["zoe", "luz"], \
    f"Got: {adults([['zoe', 40], ['ana', 12], ['luz', 19]])}"
assert adults([["zoe", 40], ["ana", 30]]) == ["zoe", "ana"], \
    f"Got: {adults([['zoe', 40], ['ana', 30]])}"
# Nobody qualifies, and everybody qualifies
assert adults([["ana", 1], ["luz", 2]]) == [], f"Got: {adults([['ana', 1], ['luz', 2]])}"
assert adults([["ana", 60], ["luz", 61]]) == ["ana", "luz"], \
    f"Got: {adults([['ana', 60], ['luz', 61]])}"
# A repeated name is still a separate person
assert adults([["ana", 20], ["ana", 9]]) == ["ana"], \
    f"Got: {adults([['ana', 20], ['ana', 9]])}"
# The register comes back untouched
_original = [["ana", 15], ["luz", 22]]
adults(_original)
assert _original == [["ana", 15], ["luz", 22]], f"Got: the input became {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def adults(people: list) -> list:
    """ Return the names of everyone aged 18 or over. """
    names = []
    for person in people:
        if person[1] >= 18:
            names.append(person[0])
    return names
```

### Wrong answers the tests must catch

```python # wrong: uses "older than 18", so an 18-year-old is dropped
def adults(people: list) -> list:
    names = []
    for person in people:
        if person[1] > 18:
            names.append(person[0])
    return names
```

```python # wrong: keeps the whole entry instead of the name
def adults(people: list) -> list:
    names = []
    for person in people:
        if person[1] >= 18:
            names.append(person)
    return names
```

```python # wrong: keeps the age instead of the name
def adults(people: list) -> list:
    names = []
    for person in people:
        if person[1] >= 18:
            names.append(person[1])
    return names
```

```python # wrong: returns every name, filtering nothing
def adults(people: list) -> list:
    names = []
    for person in people:
        names.append(person[0])
    return names
```

```python # wrong: tests the name instead of the age
def adults(people: list) -> list:
    names = []
    for person in people:
        if len(person[0]) >= 18:
            names.append(person[0])
    return names
```

### Give-aways the Description must never contain

```text # forbidden
person\[0\]
person\[1\]
>=\s*18
for\s+\w+\s+in\s+people
names\.append
```

### Shortcuts the tests reject outright

```text # banned
```
