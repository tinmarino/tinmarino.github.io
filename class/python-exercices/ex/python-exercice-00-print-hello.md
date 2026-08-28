---
title: "Python 00 - Print Hello (Template)"
---

# Print Hello

This is the **template** exercise: the simplest one there is. Use it as a model for new exercises.

## Instructions

Write a function `hello() -> str` that takes no argument and returns the string `"hello"`.

## Description

### Goal

Define a function that takes **no argument** and hands back the text `"hello"`.

### Return, do not print

This is the one idea the exercise is about.

- `return` gives a value **back to whoever called** the function.
- `print` writes on the screen and gives back `None`.

Here are two functions that look similar and behave completely differently:

```python
def get_answer() -> int:
    """ Return the answer. """
    return 42


def show_answer() -> None:
    """ Print the answer, and return nothing. """
    print(42)
```

`total = get_answer() + 1` works. `total = show_answer() + 1` raises a `TypeError`,
because `show_answer` returned `None`.

The tests call `hello()` and compare the result, so only `return` will pass.

### Examples

| Call | Returns |
|---|---|
| `hello()` | `"hello"` |

### Hint

The body needs a single statement. Mind the quotes: `"hello"` is a string.

## Starter code

```python # template
def hello() -> str:
    """ Return the string "hello".

    >>> hello()
    'hello'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(hello())
```

## Tests

```python # tests
# Automated tests - do not modify
assert hello() == "hello", f"Got: {hello()!r}"
assert isinstance(hello(), str), f"Got: a {type(hello()).__name__}, not a str"
print("All tests passed!")
```
