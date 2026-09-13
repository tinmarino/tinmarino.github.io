---
title: "Python D22 - Rotate a List"
---

# Rotate a List

## Instructions

Write a function `rotate(lst: list, num: int) -> list` that returns a NEW list holding `lst` rotated left by `num` places, the front wrapping onto the back.

`num` is `0` or more and may be larger than the length of `lst`. Return a new list, do not print it.

## Description

### Goal

A carousel of playing cards, a round-robin turn order, a ring buffer: all of them
move their front element to the back and keep going. Rotating a list left by one
place is exactly that single move, and rotating by `num` places is doing it `num`
times.

Given a list and a count, return a new list with the first `num` elements moved,
in order, to the end.

### Rules

- Return a **new** list. The list you were given must come out unchanged.
- `num` is `0` or more. `num == 0` gives back the list in its original order.
- `num` can be **larger** than the length of `lst`. Rotating a list of length 4 by
  5 places is the same as rotating it by 1 place &mdash; the carousel has come all
  the way around once and kept turning.
- An empty list rotated by anything is still the empty list.

### Examples

| Call | Returns |
|---|---|
| `rotate([1, 2, 3, 4], 1)` | `[2, 3, 4, 1]` |
| `rotate([1, 2, 3, 4], 2)` | `[3, 4, 1, 2]` |
| `rotate([1, 2, 3], 0)` | `[1, 2, 3]` |
| `rotate([1, 2, 3], 3)` | `[1, 2, 3]` |
| `rotate([1, 2, 3], 5)` | `[3, 1, 2]` |
| `rotate([], 3)` | `[]` |
| `rotate([9], 4)` | `[9]` |

### Things you will need

A slice with a start and a stop reads out a run of elements without touching the
original, and two slices side by side can be swapped just by writing them in the
other order:

```python
letters = ["a", "b", "c", "d", "e"]
front, back = letters[:2], letters[2:]
print(back + front)   # prints ['c', 'd', 'e', 'a', 'b']
```

The remainder operator turns a count that runs off the end back into one that
fits. It is what a clock face does with the hour, and what a carousel does with
one full turn:

```python
for hour in (13, 24, 25):
    print(hour % 12)   # prints 1, then 0, then 1
```

`len(lst)` gives you the length to divide by, and dividing by a length of `0`
is the one case that remainder itself cannot get you past.

### How large can the effective rotation be, and how small?

Once `num` has been brought back down to size, is it still possible for it to
land exactly on the length of the list, or past the front of it? What is the
smallest a rotation can ever need to be to give back the list unchanged?

## Starter code

```python # template
def rotate(lst: list, num: int) -> list:
    """ Return lst rotated left by num places, the front wrapping onto the back.

    >>> rotate([1, 2, 3, 4], 1)
    [2, 3, 4, 1]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(rotate([1, 2, 3, 4, 5], 2))
```

## Tests

```python # tests
# The answer is a new list, not the one handed in
_given = [1, 2, 3, 4]
_result = rotate(_given, 1)
assert isinstance(_result, list), f"Got: {type(_result)}"
assert _result is not _given, "Got: the same list object handed back"
assert _given == [1, 2, 3, 4], f"Got: the input was modified into {_given}"

# The empty list, whatever the count
assert rotate([], 0) == [], f"Got: {rotate([], 0)}"
assert rotate([], 3) == [], f"Got: {rotate([], 3)}"
assert rotate([], 100) == [], f"Got: {rotate([], 100)}"

# A single element never moves
assert rotate([9], 0) == [9], f"Got: {rotate([9], 0)}"
assert rotate([9], 1) == [9], f"Got: {rotate([9], 1)}"
assert rotate([9], 4) == [9], f"Got: {rotate([9], 4)}"

# num == 0 gives the original order back
assert rotate([1, 2, 3], 0) == [1, 2, 3], f"Got: {rotate([1, 2, 3], 0)}"

# Small, exact rotations
assert rotate([1, 2, 3, 4], 1) == [2, 3, 4, 1], f"Got: {rotate([1, 2, 3, 4], 1)}"
assert rotate([1, 2, 3, 4], 2) == [3, 4, 1, 2], f"Got: {rotate([1, 2, 3, 4], 2)}"
assert rotate([1, 2, 3, 4], 3) == [4, 1, 2, 3], f"Got: {rotate([1, 2, 3, 4], 3)}"

# num equal to the length: a full turn, back to the start
assert rotate([1, 2, 3], 3) == [1, 2, 3], f"Got: {rotate([1, 2, 3], 3)}"
assert rotate([1, 2, 3, 4], 4) == [1, 2, 3, 4], f"Got: {rotate([1, 2, 3, 4], 4)}"

# num larger than the length: one or more full turns, then some more
assert rotate([1, 2, 3], 5) == [3, 1, 2], f"Got: {rotate([1, 2, 3], 5)}"
assert rotate([1, 2, 3, 4], 6) == [3, 4, 1, 2], f"Got: {rotate([1, 2, 3, 4], 6)}"
assert rotate([1, 2, 3], 9) == [1, 2, 3], f"Got: {rotate([1, 2, 3], 9)}"
assert rotate([1, 2, 3], 100) == [2, 3, 1], f"Got: {rotate([1, 2, 3], 100)}"

# Order and content matter, not just the set of elements
assert rotate(["a", "b", "c"], 1) == ["b", "c", "a"], \
    f"Got: {rotate(['a', 'b', 'c'], 1)}"
assert rotate(["a", "b", "c"], 2) == ["c", "a", "b"], \
    f"Got: {rotate(['a', 'b', 'c'], 2)}"

# Duplicates must not collapse
assert rotate([1, 1, 2, 1], 1) == [1, 2, 1, 1], f"Got: {rotate([1, 1, 2, 1], 1)}"

# Built rather than written out, so a memorised table cannot masquerade as an answer
_wide = list(range(20))
assert rotate(_wide, 7) == list(range(7, 20)) + list(range(7)), \
    f"Got: {rotate(_wide, 7)}"
assert rotate(_wide, 27) == list(range(7, 20)) + list(range(7)), \
    f"Got: {rotate(_wide, 27)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def rotate(lst: list, num: int) -> list:
    """ Return lst rotated left by num places, the front wrapping onto the back. """
    if not lst:
        return []
    step = num % len(lst)
    return lst[step:] + lst[:step]
```

### Wrong answers the tests must catch

```python # wrong: forgets to bring num back down, so a large count crashes the intent
def rotate(lst: list, num: int) -> list:
    return lst[num:] + lst[:num]
```

```python # wrong: off by one, rotates one place further than asked
def rotate(lst: list, num: int) -> list:
    if not lst:
        return []
    step = (num + 1) % len(lst)
    return lst[step:] + lst[:step]
```

```python # wrong: rotates right instead of left
def rotate(lst: list, num: int) -> list:
    if not lst:
        return []
    step = num % len(lst)
    return lst[-step:] + lst[:-step] if step else lst[:]
```

```python # wrong: mutates the caller's list instead of building a new one
def rotate(lst: list, num: int) -> list:
    if not lst:
        return []
    step = num % len(lst)
    for _ in range(step):
        lst.append(lst.pop(0))
    return lst
```

```python # wrong: swaps the two halves without taking the remainder first
def rotate(lst: list, num: int) -> list:
    if not lst:
        return []
    return lst[num % len(lst):] + lst[:num % len(lst)] if num < len(lst) else lst
```

### Give-aways the Description must never contain

```text # forbidden
%\s*len\(
\blst\[step:\]
\blst\[:step\]
step\s*=\s*num
lst\[num\s*%
```

### Shortcuts the tests reject outright

None: there is no one-liner that skips this lesson.

```text # banned
```
