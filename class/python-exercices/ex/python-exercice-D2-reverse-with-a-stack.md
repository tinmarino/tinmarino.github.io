---
title: "Python D2 - Reverse with a Stack"
---

# Reverse with a Stack

## Instructions

Write a function `reverse_with_stack(lst: list) -> list` that returns the elements of `lst` in the opposite order, using a stack.

Same output as exercise `A2`, different route. **Check** refuses `[::-1]`, `.reverse()`, `reversed(`, `len(`, `range(` and `.insert(`, and wants to see `.pop(`.

## Description

### Goal

You have already solved this one. Given a list, hand back a **new** list holding
the same elements, last one first. The expected output has not changed since
exercise `A2`.

What has changed is what you are allowed to use. Last time you reasoned about
order yourself: front to back or back to front, and where each element had to
land. This time you have a stack, and a stack has exactly one opinion about
order.

### Rules

- Return a new list. The list you were given must come out **unchanged**.
- Use a plain list as a stack, the way you did in the previous exercise.
- Do **not** use `list.reverse()`, `reversed()`, or the slice `[::-1]`.
- Do **not** count, and do **not** work out a position. `len(`, `range(` and `.insert(`
  are all refused by **Check** &mdash; not because they are shortcuts, but because a
  stack answer never needs to know how many elements there are, nor where any one of
  them goes. An empty list is false, so a loop can stop on that alone.
- **Check** also refuses an answer that never calls `.pop(`. Producing the right
  list some other way is exercise `A2`, not this one.

### Examples

| Call | Returns |
|---|---|
| `reverse_with_stack(["never", "odd", "or", "even"])` | `["even", "or", "odd", "never"]` |
| `reverse_with_stack([1, 2, 3])` | `[3, 2, 1]` |
| `reverse_with_stack([42])` | `[42]` |
| `reverse_with_stack([])` | `[]` |

### Things you will need

`.pop()` does two things, and the second one is what this exercise runs on: it
removes the top element **and** hands it back to you, so you can put it somewhere.

```python
plates = ["blue", "green"]
plates.append("white")
print(plates.pop())      # white -- taken off the pile and handed back
print(plates)            # ['blue', 'green']
```

You also need a way to keep going until nothing is left, and you have to do it
without counting. An empty list is false and a list with anything in it is true:

```python
crates = ["c", "b", "a"]
if crates:
    print("still something on the pile")
```

A `while` loop takes the same kind of test as that `if`, and asks it again before
every turn. Every `while` you have written so far compared two numbers; this one has
no numbers to compare. Work out what belongs after the `while`, and what has to
happen on each turn for that test to stop being true.

### The list you were given must survive

`.pop()` is destructive. Every call takes an element out of the list for good,
and if the list you pop from is the caller's own, the caller ends up holding an
empty list:

```python # sketch
values = [1, 2, 3]
reverse_with_stack(values)
print(values)      # must still print [1, 2, 3]
```

The tests check this. So the elements have to reach a stack of your own before
any popping happens.

### Which order comes back?

You have not had to decide anything about order yet, and that is the point.
Answer this on paper, before you type anything:

Put blue on the pile, then green, then white. Now take them all off again, one at a
time, and write down the order they came off in.

### When Check passes, open A2 again

Put your answer to exercise `A2` next to this one and read the two together. Count, in
each, every `len`, every `[` and every `+` or `-` that is there only to work out where
an element belongs. Then compare what the two functions hand back for the same list.
Same answer both times &mdash; so which of the two ever had to decide where anything
goes?

## Starter code

```python # template
def reverse_with_stack(lst: list) -> list:
    """ Return a new list holding the elements of lst in reverse order.

    >>> reverse_with_stack([1, 2, 3])
    [3, 2, 1]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(reverse_with_stack(["never", "odd", "or", "even"]))
```

## Tests

```python # tests
# The point of this one is the stack, so Check refuses the shortcuts of A2 and the
# constructs an answer would use to work out a position. Docstrings and comments go
# first: a note to yourself about how A2 did it is not an answer that calls insert.
_chunks = __student_code__.split('"""')[::2]
_lines = [_line.split("#")[0] for _chunk in _chunks for _line in _chunk.split("\n")]
for _banned in ("[::-1]", ".reverse()", "reversed(", ".insert("):
    assert not any(_banned in _line for _line in _lines), \
        f"Got: the banned shortcut {_banned}"
assert not any("len(" in _line for _line in _lines), \
    "Got: len( -- this one is meant to run without counting anything. An empty list " \
    "is false, so a loop can stop on that alone"
assert not any("range(" in _line for _line in _lines), \
    "Got: range( -- this one is meant to run without working out a position. The " \
    "stack already knows which element comes off next"
assert any(".pop(" in _line for _line in _lines), \
    "Got: no .pop( anywhere, and this one is about taking elements back off a stack"

assert reverse_with_stack([1, 2, 3]) == [3, 2, 1], f"Got: {reverse_with_stack([1, 2, 3])}"
assert reverse_with_stack([]) == [], f"Got: {reverse_with_stack([])}"
assert reverse_with_stack([42]) == [42], f"Got: {reverse_with_stack([42])}"
# Unsorted on purpose: reversing is not sorting
assert reverse_with_stack([2, 1, 3]) == [3, 1, 2], f"Got: {reverse_with_stack([2, 1, 3])}"
assert reverse_with_stack([5, 5, 1, 9]) == [9, 1, 5, 5], \
    f"Got: {reverse_with_stack([5, 5, 1, 9])}"
_words = ["never", "odd", "or", "even"]
assert reverse_with_stack(_words) == ["even", "or", "odd", "never"], \
    f"Got: {reverse_with_stack(_words)}"
assert reverse_with_stack([1, "a", None]) == [None, "a", 1], \
    f"Got: {reverse_with_stack([1, 'a', None])}"
# Popping the caller's own list would empty it
_original = [1, 2, 3]
reverse_with_stack(_original)
assert _original == [1, 2, 3], f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def reverse_with_stack(lst: list) -> list:
    """ Return a new list with the elements of lst reversed. """
    stack = []
    for item in lst:
        stack.append(item)
    out = []
    while stack:
        out.append(stack.pop())
    return out
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: pops by computed index, which is A2 wearing a stack
def reverse_with_stack(lst: list) -> list:
    copy = list(lst)
    out = []
    for _ in range(len(copy)):
        out.append(copy.pop(len(copy) - 1))
    return out
```

```python # wrong: the A2 answer, no stack anywhere
def reverse_with_stack(lst: list) -> list:
    out = []
    for item in lst:
        out.insert(0, item)
    return out
```

```python # wrong: returns the input unchanged
def reverse_with_stack(lst: list) -> list:
    return lst
```

```python # wrong: builds the stack but never takes anything off it
def reverse_with_stack(lst: list) -> list:
    stack = []
    for item in lst:
        stack.append(item)
    return stack
```

```python # wrong: pops the caller's list instead of a stack of its own
def reverse_with_stack(lst: list) -> list:
    out = []
    while lst:
        out.append(lst.pop())
    return out
```

```python # wrong: takes from the bottom, so the order never changes
def reverse_with_stack(lst: list) -> list:
    stack = []
    for item in lst:
        stack.append(item)
    out = []
    while stack:
        out.append(stack.pop(0))
    return out
```

```python # wrong: prepends what it pops, so the two reversals cancel
def reverse_with_stack(lst: list) -> list:
    stack = []
    for item in lst:
        stack.append(item)
    out = []
    while stack:
        out = [stack.pop()] + out
    return out
```

```python # wrong: takes the slice shortcut
def reverse_with_stack(lst: list) -> list:
    return lst[::-1]
```

```python # wrong: calls reversed() instead of using a stack
def reverse_with_stack(lst: list) -> list:
    return list(reversed(lst))
```

```python # wrong: reverses the caller's list in place
def reverse_with_stack(lst: list) -> list:
    lst.reverse()
    return lst
```

### Give-aways the Description must never contain

```text # forbidden
\[::-1\]
\breversed\(
\.reverse\(\)
for\s+\w+\s+in\s+lst\b
while\s+\w+:
stack\.pop\(\)
\.append\(\s*\w+\.pop\(
```

### Shortcuts the tests reject outright

```text # banned
[::-1]
.reverse()
reversed(
len(
range(
.insert(
```
