---
title: "Python 01 - Reverse a List"
---

# Reverse a List

## Instructions

Write a function `reverse_list(lst: list) -> list` that returns the elements of `lst` in the opposite order.

## Description

### Goal

Given a list, hand back a **new** list holding the same elements, last one first.

### Rules

- Return a new list. The list you were given must come out **unchanged**.
- Build it yourself with a loop. Do **not** use `list.reverse()`, `reversed()`, or the
  slice `[::-1]` &mdash; those *are* the answer, and writing the loop is the exercise.

### Examples

| Call | Returns |
|---|---|
| `reverse_list([1, 2, 3])` | `[3, 2, 1]` |
| `reverse_list(["a", "b"])` | `["b", "a"]` |
| `reverse_list([42])` | `[42]` |
| `reverse_list([])` | `[]` |

### Things you will need

Start from an empty list and add one element at a time. Two list methods can add
to a list, and they differ in *where*:

```python
letters = ["b", "c"]
letters.append("d")      # letters is now ["b", "c", "d"]
```

`append` always adds at the end. There is a second method, `list.insert(index, value)`,
which puts an element at a position you choose &mdash; look up what it does with an index
of `0`. Which of the two you need is the whole exercise.

To walk a list you can take the elements directly:

```python
for letter in ["a", "b", "c"]:
    print(letter)
```

You can also work with positions instead of elements. `len(lst)` gives the length and
`lst[index]` reads one element, so `range` lets you choose the order you visit them in.
It takes a step, and the step may be negative:

```python
for index in range(2, -1, -1):
    print(index)          # prints 2, then 1, then 0
```

Note where it stops: the end value is excluded.

### Which order do you need?

Decide before you write anything: if you visit the input from **front to back**, where
must each element go in the result? If you visit it from **back to front**, where must
it go? Both routes work. Pick one and be consistent.

### Why the input must not change

A function that quietly modifies its argument surprises its caller:

```python # sketch
values = [1, 2, 3]
reverse_list(values)
print(values)      # must still print [1, 2, 3]
```

The tests check this, so do not call `lst.reverse()` or assign into `lst`.

## Starter code

```python # template
def reverse_list(lst: list) -> list:
    """ Return a new list holding the elements of lst in reverse order.

    >>> reverse_list([1, 2, 3])
    [3, 2, 1]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(reverse_list([1, 2, 3]))
```

## Tests

```python # tests
assert reverse_list([1, 2, 3]) == [3, 2, 1], f"Got: {reverse_list([1, 2, 3])}"
assert reverse_list([]) == [], f"Got: {reverse_list([])}"
assert reverse_list([42]) == [42], f"Got: {reverse_list([42])}"
# Unsorted on purpose: reversing is not sorting
assert reverse_list([2, 1, 3]) == [3, 1, 2], f"Got: {reverse_list([2, 1, 3])}"
assert reverse_list([5, 5, 1, 9]) == [9, 1, 5, 5], f"Got: {reverse_list([5, 5, 1, 9])}"
_letters = ["b", "d", "a", "c"]
assert reverse_list(_letters) == ["c", "a", "d", "b"], f"Got: {reverse_list(_letters)}"
assert reverse_list([1, "a", None]) == [None, "a", 1], f"Got: {reverse_list([1, 'a', None])}"
_original = [1, 2, 3]
reverse_list(_original)
assert _original == [1, 2, 3], f"Got: the input was modified into {_original}"
print("All tests passed!")
```
