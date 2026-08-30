---
title: "Python A1 - Print Hello"
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

### Things you will need

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

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def hello() -> str:
    """ Return the string "hello". """
    return "hello"
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: prints instead of returning
def hello() -> str:
    print("hello")
```

```python # wrong: returns the wrong text
def hello() -> str:
    return "Hello"
```

```python # wrong: returns the name of the value, not the value
def hello() -> str:
    return "the string hello"
```

### Give-aways the Description must never contain

```text # forbidden
return\s+"hello"
```

### Shortcuts the tests reject outright

None: there is no one-liner that skips this lesson.

```text # banned
```
