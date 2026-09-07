---
title: "Python B17 - Even or Odd Labels"
---

# Even or Odd Labels

## Instructions

Write a function `parities(lst: list) -> list` that returns a new list where each number is turned into the string `"<n> is even"` or `"<n> is odd"`.

Return the list of strings, do not print it.

## Description

### Goal

Turn a list of numbers into a list of little sentences. `[2, 3]` becomes
`["2 is even", "3 is odd"]`.

### Rules

- One sentence per number, in the same order.
- Each entry is a string. `4` becomes the text `"4 is even"`, not the number `4`.

### Examples

| Call | Returns |
|---|---|
| `parities([1, 2])` | `["1 is odd", "2 is even"]` |
| `parities([4])` | `["4 is even"]` |
| `parities([-3])` | `["-3 is odd"]` |
| `parities([])` | `[]` |

### Things you will need

An f-string drops a value into some text:

```python
for name in ["Ana", "Bob"]:
    print(f"{name} says hi")
```

And the remainder after dividing by two tells even from odd:

```python
for value in [10, 7, 4]:
    print(value % 2)
```

### Which order do you need?

For each number you make a choice, then build one string from that choice. Which
comes first?

## Starter code

```python # template
def parities(lst: list) -> list:
    """ Return "<n> is even"/"<n> is odd" for each number, e.g. ["4 is even"] for [4].

    >>> parities([2, 3])
    ['2 is even', '3 is odd']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(parities([1, 2, 3, 4]))
```

## Tests

```python # tests
assert parities([1, 2]) == ["1 is odd", "2 is even"], f"Got: {parities([1, 2])}"
assert parities([4]) == ["4 is even"], f"Got: {parities([4])}"
assert parities([-3]) == ["-3 is odd"], f"Got: {parities([-3])}"
assert parities([0]) == ["0 is even"], f"Got: {parities([0])}"
assert parities([]) == [], f"Got: {parities([])}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def parities(lst: list) -> list:
    """ Return "<n> is even"/"<n> is odd" for each number, e.g. ["4 is even"] for [4]. """
    result = []
    for number in lst:
        if number % 2 == 0:
            result.append(f"{number} is even")
        else:
            result.append(f"{number} is odd")
    return result
```

### Wrong answers the tests must catch

```python # wrong: swaps the even and odd labels
def parities(lst: list) -> list:
    """ Labels are the wrong way round. """
    result = []
    for number in lst:
        if number % 2 == 0:
            result.append(f"{number} is odd")
        else:
            result.append(f"{number} is even")
    return result
```

```python # wrong: returns booleans, not sentences
def parities(lst: list) -> list:
    """ Forgets to build the strings. """
    return [number % 2 == 0 for number in lst]
```

### Give-aways the Description must never contain

```text # forbidden
f"\{number\}
%\s*2\s*==\s*0
```

### Shortcuts the tests reject outright

```text # banned
```
