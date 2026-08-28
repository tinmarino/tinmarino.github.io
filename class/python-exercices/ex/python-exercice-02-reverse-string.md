---
title: "Python 02 - Reverse a String"
---

# Reverse a String

## Instructions

Write a function `reverse_string(s: str) -> str` that takes a string and returns the string reversed.

Do **not** use slicing `[::-1]`.

## Starter code

```python # template
def reverse_string(s: str) -> str:
    """Return the reversed string."""
    # YOUR CODE HERE
```

## Tests

```python # tests
assert reverse_string("hello") == "olleh", f"Got: {reverse_string('hello')}"
assert reverse_string("") == "", f"Got: {reverse_string('')}"
assert reverse_string("a") == "a", f"Got: {reverse_string('a')}"
assert reverse_string("Python") == "nohtyP", f"Got: {reverse_string('Python')}"
assert reverse_string("racecar") == "racecar", f"Got: {reverse_string('racecar')}"
print("All tests passed!")
```
