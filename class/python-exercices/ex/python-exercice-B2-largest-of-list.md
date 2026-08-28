---
title: "Python B2 - Largest of a List"
---

# Largest of a List

## Instructions

Write a function `largest(lst: list) -> int` that returns the biggest number in `lst`.

Find it yourself with a loop. `max(`, `min(`, `sorted(` and `.sort(` skip the exercise, so **Check** turns them down.

## Description

### Goal

A winter of overnight temperatures is ninety numbers nobody reads. The one people
actually ask about is a single number out of the ninety: the mildest night.

Given a list of numbers, hand back the biggest one. Return it &mdash; do not print it.

### Rules

- The list always holds at least one number. You never have to deal with an empty list.
- Return the number itself, not its position in the list.
- The list you were given must come out **unchanged**. Read it; do not take numbers out of it.
- Find it yourself with a loop. Do **not** use `max(`, `min(`, `sorted(` or `.sort(` &mdash; writing the loop is the exercise.

### Examples

The numbers are overnight temperatures, in degrees.

| Call | Returns |
|---|---|
| `largest([3, 12, 8])` | `12` |
| `largest([12, 3, 8])` | `12` |
| `largest([7])` | `7` |
| `largest([2, 2, 2])` | `2` |
| `largest([-3, -8, 0, -5])` | `0` |

### Something new: the answer is already in the list

In exercise `B1` you **built** an answer that did not exist anywhere in the input: no
single character of `banana` was ever the number `3`. Here it is the other way round.
You are not building anything. The answer is one of the numbers sitting in front of
you, and your job is only to work out **which one**.

So the question is never *what do I add?*. It is *which of these two do I keep?* &mdash;
and that question is small enough to write on its own, away from any list:

```python
def longer(first: str, second: str) -> str:
    """ Return whichever of the two words is longer. """
    if len(second) > len(first):
        return second
    return first


print(longer("ant", "beetle"))     # prints beetle
```

That settles two words. A list hands you its numbers one at a time, and you get one
look at each. So what has to survive from one turn of the loop to the next?

### Where do you start?

The whole exercise hides in one line: what is your candidate **before** you have looked
at anything?

## Starter code

```python # template
def largest(lst: list) -> int:
    """ Return the biggest number in lst, which always holds at least one.

    >>> largest([3, 12, 8])
    12
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(largest([-3, -8, 0, -5, -11, -6, 2]))
```

## Tests

```python # tests
# The point of this one is the loop you write, so Check refuses the shortcuts.
for _banned in ("max(", "min(", "sorted(", ".sort("):
    assert _banned not in __student_code__, f"Got: the banned shortcut {_banned}"

assert largest([3, 41, 12]) == 41, f"Got: {largest([3, 41, 12])}"
assert largest([7]) == 7, f"Got: {largest([7])}"
# The biggest is first: a loop that starts comparing too late misses it
assert largest([41, 12, 3]) == 41, f"Got: {largest([41, 12, 3])}"
# The biggest is last: a loop that stops too early misses it
assert largest([3, 12, 41]) == 41, f"Got: {largest([3, 12, 41])}"
# Every number is negative, so a candidate starting at 0 is never beaten
assert largest([-5, -3, -9]) == -3, f"Got: {largest([-5, -3, -9])}"
assert largest([-1]) == -1, f"Got: {largest([-1])}"
assert largest([-100, -200]) == -100, f"Got: {largest([-100, -200])}"
# Below every starting value a person could invent, not merely below 0
_deep = [-(10 ** 100) - 7, -(10 ** 100) - 3]
assert largest(list(_deep)) == _deep[1], f"Got: {largest(list(_deep))}"
# Zero is a real answer, not the absence of one
assert largest([-8, 0, -8]) == 0, f"Got: {largest([-8, 0, -8])}"
assert largest([0, -1]) == 0, f"Got: {largest([0, -1])}"
assert largest([0, 12, 0]) == 12, f"Got: {largest([0, 12, 0])}"
# All equal: the answer is that value, not a crash
assert largest([2, 2, 2]) == 2, f"Got: {largest([2, 2, 2])}"
# The biggest appears twice
assert largest([5, 9, 1, 9]) == 9, f"Got: {largest([5, 9, 1, 9])}"
# A dip early on: the first number that beats its neighbour is NOT the answer
assert largest([5, 3, 9]) == 9, f"Got: {largest([5, 3, 9])}"
assert largest([8, 2, 4, 1, 30]) == 30, f"Got: {largest([8, 2, 4, 1, 30])}"
assert largest([4, 8, 15, 16, 23, 42]) == 42, f"Got: {largest([4, 8, 15, 16, 23, 42])}"
assert largest([-3, 7, -3, 2]) == 7, f"Got: {largest([-3, 7, -3, 2])}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [(_step * 37) % 101 - 50 for _step in range(101)]
assert largest(_generated) == 50, f"Got: {largest(_generated)}"
# The caller's list must come back untouched
_original = [3, 41, 12]
largest(_original)
assert _original == [3, 41, 12], f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def largest(lst: list) -> int:
    """ Return the biggest number in lst, which always holds at least one. """
    champion = lst[0]
    for number in lst:
        if number > champion:
            champion = number
    return champion
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: calls max() instead of looping
def largest(lst: list) -> int:
    return max(lst)
```

```python # wrong: sorts and takes the end
def largest(lst: list) -> int:
    return sorted(lst)[-1]
```

```python # wrong: sorts a copy with list.sort(), so the input survives
def largest(lst: list) -> int:
    copy = list(lst)
    copy.sort()
    return copy[-1]
```

```python # wrong: confuses min with max
def largest(lst: list) -> int:
    return min(lst)
```

```python # wrong: starts the candidate at zero
def largest(lst: list) -> int:
    champion = 0
    for number in lst:
        if number > champion:
            champion = number
    return champion
```

```python # wrong: starts the candidate at a very small invented number
def largest(lst: list) -> int:
    champion = -1000000000
    for number in lst:
        if number > champion:
            champion = number
    return champion
```

```python # wrong: the same invented floor, only deeper: no literal is deep enough
def largest(lst: list) -> int:
    champion = -10 ** 30
    for number in lst:
        if number > champion:
            champion = number
    return champion
```

```python # wrong: returns the last element
def largest(lst: list) -> int:
    champion = lst[0]
    for number in lst:
        champion = number
    return champion
```

```python # wrong: returns the first element
def largest(lst: list) -> int:
    return lst[0]
```

```python # wrong: compares the wrong way round, so it finds the smallest
def largest(lst: list) -> int:
    champion = lst[0]
    for number in lst:
        if number < champion:
            champion = number
    return champion
```

```python # wrong: returns the position instead of the number
def largest(lst: list) -> int:
    champion = 0
    for index in range(len(lst)):
        if lst[index] > lst[champion]:
            champion = index
    return champion
```

```python # wrong: stops at the first number bigger than its neighbour
def largest(lst: list) -> int:
    for index in range(len(lst) - 1):
        if lst[index] > lst[index + 1]:
            return lst[index]
    return lst[-1]
```

```python # wrong: a memorised table of every list the tests spell out
def largest(lst: list) -> int:
    known = {
        (3, 41, 12): 41, (7,): 7, (41, 12, 3): 41, (3, 12, 41): 41,
        (-5, -3, -9): -3, (-1,): -1, (-100, -200): -100,
        (-8, 0, -8): 0, (0, -1): 0, (2, 2, 2): 2, (5, 9, 1, 9): 9,
        (5, 3, 9): 9, (8, 2, 4, 1, 30): 30, (4, 8, 15, 16, 23, 42): 42,
        (-3, 7, -3, 2): 7,
    }
    return known.get(tuple(lst), 0)
```

### Give-aways the Description must never contain

```text # forbidden
lst\[0\]
champion\s*=\s*lst
>\s*champion
for\s+\w+\s+in\s+lst\b
\bmax\(
\bmin\(
\bsorted\(
\.sort\(
```

### Shortcuts the tests reject outright

```text # banned
max(
min(
sorted(
.sort(
```
