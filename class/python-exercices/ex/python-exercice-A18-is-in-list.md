---
title: "Python A18 - Is It in the List?"
---

# Is It in the List?

## Instructions

Write a function `contains(item: int, lst: list) -> bool:` that returns `True` when `item` is one of the elements of `lst`, and `False` otherwise.

Return the boolean, do not print it.

## Description

### Goal

Answer one question about a list: is a given value somewhere inside it?

### Rules

- Return `True` or `False`, do not print.
- An empty list contains nothing, so the answer for it is always `False`.

### Examples

| Call | Returns |
|---|---|
| `contains(2, [1, 2, 3])` | `True` |
| `contains(9, [1, 2, 3])` | `False` |
| `contains(0, [])` | `False` |
| `contains(5, [5])` | `True` |

### Things you will need

Python can ask directly whether a value is among the elements of a list:

```python
for value in [2, 9]:
    print(value in [1, 2, 3])
```

That comparison already gives back exactly the `True` or `False` you want.

### Which order do you need?

Which of the two arguments is the value being looked for, and which is the list
it is looked for in?

## Starter code

```python # template
def contains(item: int, lst: list) -> bool:
    """ Return True when `item` is an element of `lst`, e.g. True for (2, [1, 2, 3]).

    >>> contains(2, [1, 2, 3])
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(contains(2, [1, 2, 3]))
```

## Tests

```python # tests
assert contains(2, [1, 2, 3]) is True, f"Got: {contains(2, [1, 2, 3])}"
assert contains(9, [1, 2, 3]) is False, f"Got: {contains(9, [1, 2, 3])}"
assert contains(0, []) is False, f"Got: {contains(0, [])}"
assert contains(5, [5]) is True, f"Got: {contains(5, [5])}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def contains(item: int, lst: list) -> bool:
    """ Return True when `item` is an element of `lst`, e.g. True for (2, [1, 2, 3]). """
    return item in lst
```

### Wrong answers the tests must catch

```python # wrong: compares the value against the whole list
def contains(item: int, lst: list) -> bool:
    """ Uses == with the list itself. """
    return item == lst
```

```python # wrong: always says yes
def contains(item: int, lst: list) -> bool:
    """ Ignores the arguments. """
    return True
```

### Give-aways the Description must never contain

```text # forbidden
item\s+in\s+lst
return\s+item\s+in
```

### Shortcuts the tests reject outright

```text # banned
```
