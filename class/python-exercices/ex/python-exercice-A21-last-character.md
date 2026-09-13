---
title: "Python A21 - Last Character"
---

# Last Character

## Instructions

Write a function `last_char(stg: str) -> str` that returns the last character of `stg`, or `""` when `stg` is empty.

Return the character, do not print it.

## Description

### Goal

Hand back the final character of a piece of text. For `"cat"` that is `"t"`.
When the text is empty there is no last character, so hand back the empty
string `""`.

### Rules

- Return a one-character string, or `""` for the empty string.
- The empty string has no last character &mdash; reaching for one crashes, so
  check for it first.
- Return the value, do not print it.

### Examples

| Call | Returns |
|---|---|
| `last_char("cat")` | `"t"` |
| `last_char("a")` | `"a"` |
| `last_char("hello")` | `"o"` |
| `last_char("")` | `""` |

### Things you will need

You can count backwards into a string: position `-1` is the last character,
`-2` the one before it.

```python
for word in ["dog", "sky"]:
    print(word[-1])
```

You can also ask how long a string is, or whether it is empty:

```python
for word in ["dog", ""]:
    print(len(word) == 0)
```

### Which order do you need?

What must you check before you look at the last character, so that the empty
string does not crash you?

## Starter code

```python # template
def last_char(stg: str) -> str:
    """ Return the last character of `stg`, or "" when empty, e.g. "t" for "cat".

    >>> last_char("cat")
    't'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(last_char("cat"))
```

## Tests

```python # tests
assert last_char("cat") == "t", f"Got: {last_char('cat')}"
assert last_char("a") == "a", f"Got: {last_char('a')}"
assert last_char("hello") == "o", f"Got: {last_char('hello')}"
assert last_char("") == "", f"Got: {last_char('')}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def last_char(stg: str) -> str:
    """ Return the last character of `stg`, or "" when empty, e.g. "t" for "cat". """
    if stg == "":
        return ""
    return stg[-1]
```

### Wrong answers the tests must catch

```python # wrong: returns the first character instead
def last_char(stg: str) -> str:
    """ Read position 0 by mistake. """
    if stg == "":
        return ""
    return stg[0]
```

```python # wrong: returns the whole string untouched
def last_char(stg: str) -> str:
    """ Forget to pick out a single character. """
    return stg
```

### Give-aways the Description must never contain

```text # forbidden
stg\[-1\]
return\s+stg\[
```

### Shortcuts the tests reject outright

```text # banned
```
