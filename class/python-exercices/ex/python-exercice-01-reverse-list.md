---
title: "Python 01 - Reverse a List"
---

# Reverse a List

## Instructions

Write a function `reverse_list(lst: list) -> list` that takes a list and returns a **new** list with elements in reverse order.

Do **not** use `list.reverse()` or slicing `[::-1]`.

## Starter code

```python # template
def reverse_list(lst: list) -> list:
    """Return a new list with elements in reverse order."""
    # YOUR CODE HERE
```

## Tests

```python # tests
assert reverse_list([1, 2, 3]) == [3, 2, 1], f"Got: {reverse_list([1, 2, 3])}"
assert reverse_list([]) == [], f"Got: {reverse_list([])}"
assert reverse_list([42]) == [42], f"Got: {reverse_list([42])}"
assert reverse_list(["a", "b", "c", "d"]) == ["d", "c", "b", "a"]
print("All tests passed!")
```
