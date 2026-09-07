---
title: "Python A19 - Swap A for O"
---

# Swap A for O

## Instructions

Write a function `swap_a(stg: str) -> str` that returns a new string with every `"a"` turned into an `"o"`. Do **not** use `.replace()`.

Return the new string, do not print it.

## Description

### Goal

Build a new string that is the input with every lowercase `"a"` changed to an
`"o"`, and every other character left as it was.

### Rules

- Do **not** use `.replace()`. Walking the string yourself is the exercise.
- Build and return a new string. Leave the original alone.
- Only lowercase `"a"` changes; every other character is copied across unchanged.

### Examples

| Call | Returns |
|---|---|
| `swap_a("banana")` | `"bonono"` |
| `swap_a("aaa")` | `"ooo"` |
| `swap_a("xyz")` | `"xyz"` |
| `swap_a("")` | `""` |

### Things you will need

You can look at a string one character at a time:

```python
for char in "cat":
    print(char)
```

For each character you either keep it or swap it, a choice an `if`/`else` can make
in one line:

```python
for char in "xyz":
    print("!" if char == "y" else char)
```

Collect the chosen characters into a result string as you go, starting from an
empty string.

### Which order do you need?

As you walk the string, what do you do with a character that is `"a"`, and what
do you do with any other character?

## Starter code

```python # template
def swap_a(stg: str) -> str:
    """ Return `stg` with every "a" turned into an "o", e.g. "bonono" for "banana".

    >>> swap_a("banana")
    'bonono'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(swap_a("banana"))
```

## Tests

```python # tests
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in (".replace(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert swap_a("banana") == "bonono", f"Got: {swap_a('banana')}"
assert swap_a("aaa") == "ooo", f"Got: {swap_a('aaa')}"
assert swap_a("xyz") == "xyz", f"Got: {swap_a('xyz')}"
assert swap_a("") == "", f"Got: {swap_a('')}"
assert swap_a("cat") == "cot", f"Got: {swap_a('cat')}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def swap_a(stg: str) -> str:
    """ Return `stg` with every "a" turned into an "o", e.g. "bonono" for "banana". """
    result = ""
    for char in stg:
        result += "o" if char == "a" else char
    return result
```

### Wrong answers the tests must catch

```python # wrong: uses the built-in replace
def swap_a(stg: str) -> str:
    """ Hand the work to replace. """
    return stg.replace("a", "o")
```

```python # wrong: copies the string but never swaps
def swap_a(stg: str) -> str:
    """ Rebuilds the string unchanged. """
    result = ""
    for char in stg:
        result += char
    return result
```

### Give-aways the Description must never contain

```text # forbidden
\.replace\(
for\s+\w+\s+in\s+stg
```

### Shortcuts the tests reject outright

```text # banned
.replace(
```
