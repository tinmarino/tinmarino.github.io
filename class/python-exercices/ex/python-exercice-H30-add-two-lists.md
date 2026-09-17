---
title: "Python H30 - Add Two Lists Element by Element"
---

# Add Two Lists Element by Element

## Instructions

Write a function `add_lists(left: list, right: list) -> list` that returns a new list where each position holds the sum of the two values sitting at that position.

The two lists always have the same length. Return a new list, do not print it.

## Description

### Goal

Monday's sales and Tuesday's sales arrive as two lists, one number per product.
You want the two-day total per product: the first with the first, the second
with the second, all the way down.

`[1, 2]` and `[10, 20]` give `[11, 22]`, because 1 + 10 is 11 and 2 + 20 is 22.

### Rules

- The answer has the **same length** as the inputs, not double.
- Position matters: the value at position 0 pairs only with the other value at
  position 0.
- The two lists always have the same length, so you never have to worry about a
  leftover tail.
- Build and return a **new** list; both inputs must come back unchanged.

### Examples

| Call | Returns |
|---|---|
| `add_lists([1, 2], [10, 20])` | `[11, 22]` |
| `add_lists([1, 2, 3], [10, 20, 30])` | `[11, 22, 33]` |
| `add_lists([-1, 5], [1, -5])` | `[0, 0]` |
| `add_lists([3], [4])` | `[7]` |
| `add_lists([], [])` | `[]` |

### Things you will need

This is the first exercise where you walk **two** lists at once. `zip` hands you
one value from each, side by side, until the shorter one runs out:

```python
for letter, size in zip(["a", "b"], [10, 20]):
    print(letter, size)
```

Notice the loop line names **two** variables, because each turn of the loop
hands you two things. You then collect results the usual way:

```python
totals = []
for price in [100, 200]:
    totals.append(price + 5)
print(totals)
```

### Which order do you need?

Each turn of the loop gives you one value from each list. What single number do
you build from that pair, and where does it go?

## Starter code

```python # template
def add_lists(left: list, right: list) -> list:
    """ Return the two lists summed position by position, e.g. [11, 22] for ([1, 2], [10, 20]).

    >>> add_lists([1, 2], [10, 20])
    [11, 22]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(add_lists([1, 2], [10, 20]))
```

## Tests

```python # tests
assert add_lists([1, 2], [10, 20]) == [11, 22], f"Got: {add_lists([1, 2], [10, 20])}"
# Three positions, and every one of them must be a sum
assert add_lists([1, 2, 3], [10, 20, 30]) == [11, 22, 33], \
    f"Got: {add_lists([1, 2, 3], [10, 20, 30])}"
# The two lists are different, so handing back either one is caught
assert add_lists([5, 6], [1, 1]) == [6, 7], f"Got: {add_lists([5, 6], [1, 1])}"
# Subtracting instead of adding gives a different answer here
assert add_lists([10, 20], [1, 2]) == [11, 22], f"Got: {add_lists([10, 20], [1, 2])}"
# Negatives, so the sums are not just "both numbers glued together"
assert add_lists([-1, 5], [1, -5]) == [0, 0], f"Got: {add_lists([-1, 5], [1, -5])}"
assert add_lists([-3], [-4]) == [-7], f"Got: {add_lists([-3], [-4])}"
assert add_lists([3], [4]) == [7], f"Got: {add_lists([3], [4])}"
assert add_lists([0], [0]) == [0], f"Got: {add_lists([0], [0])}"
assert add_lists([], []) == [], f"Got: {add_lists([], [])}"
# Same numbers in a different order: position really does decide
assert add_lists([1, 9], [100, 200]) == [101, 209], f"Got: {add_lists([1, 9], [100, 200])}"
assert add_lists([9, 1], [100, 200]) == [109, 201], f"Got: {add_lists([9, 1], [100, 200])}"
# The answer is as long as one input, never as long as both together
assert len(add_lists([1, 2], [3, 4])) == 2, f"Got: {len(add_lists([1, 2], [3, 4]))}"
# Neither list may be modified
_left, _right = [1, 2], [10, 20]
add_lists(_left, _right)
assert _left == [1, 2], f"Got: the first list was modified into {_left}"
assert _right == [10, 20], f"Got: the second list was modified into {_right}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def add_lists(left: list, right: list) -> list:
    """ Return a new list summing the two lists position by position. """
    result = []
    for first, second in zip(left, right):
        result.append(first + second)
    return result
```

### Wrong answers the tests must catch

```python # wrong: sticks the lists together instead of adding them
def add_lists(left: list, right: list) -> list:
    """ Concatenates, so the answer is twice too long. """
    return left + right
```

```python # wrong: subtracts the pairs instead of adding them
def add_lists(left: list, right: list) -> list:
    """ Right operation, wrong sign. """
    result = []
    for first, second in zip(left, right):
        result.append(first - second)
    return result
```

```python # wrong: hands back the first list untouched
def add_lists(left: list, right: list) -> list:
    """ Never looks at the second list. """
    return left
```

```python # wrong: pairs every value with every value instead of position by position
def add_lists(left: list, right: list) -> list:
    """ A nested loop makes far too many sums. """
    result = []
    for first in left:
        for second in right:
            result.append(first + second)
    return result
```

### Give-aways the Description must never contain

```text # forbidden
zip\(left
zip\(\s*left\s*,\s*right
first\s*\+\s*second
```

### Shortcuts the tests reject outright

```text # banned
```
