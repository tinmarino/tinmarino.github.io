---
title: "Python D1 - A Stack from a List"
---

# A Stack from a List

## Instructions

Write a function `stack_top(operations: list) -> int` that replays a list of `"push <number>"` and `"pop"` commands and returns the number left on top of the pile.

If the pile is empty when the commands run out, return `-1`. Every number pushed is `0` or more, so `-1` can only ever mean *empty*.

## Description

### Goal

The undo in your editor, the back button in your browser and the traceback Python prints
when something goes wrong are all the same shape: a pile you add to at one end and take
from at that same end. The last thing in is the first thing out. Computer science calls
it a **stack**, and every language has one.

You are handed a list of commands. Replay them in order and report the number sitting on
top when you run out of commands.

### The commands

Every element of `operations` is one string, and there are only two kinds:

- `"push 3"` puts the number `3` on top of the pile
- `"pop"` takes the top number off and throws it away

The word and the number are separated by exactly one space, and the number is always a
run of digits.

### Rules

- Return the number on top **after every command has run**. Return it, do not print it.
- A `"pop"` on an empty pile does nothing. It is not an error and it must not crash.
- If the pile is empty at the end, return `-1`. Every pushed number is `0` or more, so
  `-1` is never a real answer &mdash; and `0` is.
- The list you were given must come out **unchanged**. Your pile is yours and you may
  destroy it; the list of commands belongs to whoever called you, and a function that
  quietly empties its argument surprises them. Careful: the word `pop` is about to mean
  two different things on two different lists, and only one of them is yours.

### Examples

| Call | Returns |
|---|---|
| `stack_top(["push 3", "push 5", "pop"])` | `3` |
| `stack_top(["push 1", "push 2"])` | `2` |
| `stack_top(["push 7"])` | `7` |
| `stack_top(["push 4", "pop"])` | `-1` |
| `stack_top(["pop", "pop", "push 9"])` | `9` |
| `stack_top([])` | `-1` |

The undo from the first paragraph is exercise `D3`. It is this pile, with something worth
remembering in it.

### Things you will need

Each command arrives as one string, so the first job is to get the number out of it. A
slice with only a start gives you everything from that position to the end, which is how
you drop a prefix whose length you know:

```python
label, start = "name: Ada", 6
print(label[start:])         # prints Ada
```

Counting the characters of the prefix is on you. What you get back is still a string
even when it is made of digits, so it still needs `int("3")` before it can be counted as
a number. You met that in exercise `B4`.

You also need somewhere to keep the pile. Before you reach for anything new, look at
what you already have. `append` puts an element on the end of a list. There is a second
method, `list.pop` &mdash; look up what it hands back when you call it with no argument,
and what it does instead when you give it `0`. Which of the two you need is most of this
exercise.

Reading an element is not the same as taking it out. `len(lst)` gives the length and
`lst[index]` reads one element, and neither of them changes the list:

```python
shelf = ["tea", "salt", "rope"]
print(shelf[0])                   # prints tea
print(shelf[len(shelf) - 1])      # prints rope
```

An empty container is false, which is the short way to ask whether anything is left:

```python
crates = []
if not crates:
    print("nothing left")
```

### Which end is the top?

You get to pick which end of your container the pile grows at, and both choices work.
That choice decides two other things: which call takes the top off, and how you read the
top *without* taking it off. Answer both before you write the loop, and then stay
consistent. A pile that grows at one end and is read at the other is the bug you will
spend twenty minutes staring at.

## Starter code

```python # template
def stack_top(operations: list) -> int:
    """ Return the number on top of the pile after every command, or -1 if it is empty.

    >>> stack_top(["push 3", "push 5", "pop"])
    3
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(stack_top(["push 3", "push 5", "pop"]))
```

## Tests

```python # tests
assert stack_top(["push 7"]) == 7, f"Got: {stack_top(['push 7'])}"
assert stack_top(["push 1", "push 2"]) == 2, f"Got: {stack_top(['push 1', 'push 2'])}"
_three = ["push 3", "push 5", "pop"]
assert stack_top(_three) == 3, f"Got: {stack_top(_three)}"
# An empty pile at the end, in three different ways
assert stack_top([]) == -1, f"Got: {stack_top([])}"
assert stack_top(["push 4", "pop"]) == -1, f"Got: {stack_top(['push 4', 'pop'])}"
assert stack_top(["push 1", "push 2", "pop", "pop"]) == -1, \
    f"Got: {stack_top(['push 1', 'push 2', 'pop', 'pop'])}"
# More pops than pushes: the extra ones do nothing, they do not go negative
assert stack_top(["pop"]) == -1, f"Got: {stack_top(['pop'])}"
_deep = ["pop", "pop", "push 9"]
assert stack_top(_deep) == 9, f"Got: {stack_top(_deep)}"
_mixed = ["push 2", "pop", "pop", "pop", "push 8", "push 6", "pop"]
assert stack_top(_mixed) == 8, f"Got: {stack_top(_mixed)}"
# Zero is a value, not an empty pile
assert stack_top(["push 0"]) == 0, f"Got: {stack_top(['push 0'])}"
# More than one digit
assert stack_top(["push 10", "push 200", "pop", "push 30"]) == 30, \
    f"Got: {stack_top(['push 10', 'push 200', 'pop', 'push 30'])}"
_long = ["push 12", "push 7", "pop", "pop", "push 5", "push 41", "pop"]
assert stack_top(_long) == 5, f"Got: {stack_top(_long)}"
# Three deep: popping twice must bring the FIRST number back to the top
_deep3 = ["push 4", "push 8", "push 15", "pop", "pop"]
assert stack_top(_deep3) == 4, f"Got: {stack_top(_deep3)}"
# Four deep, emptied all the way down to the one at the bottom
_deep4 = ["push 1", "push 2", "push 3", "push 4", "pop", "pop", "pop"]
assert stack_top(_deep4) == 1, f"Got: {stack_top(_deep4)}"
# A pile that grows, shrinks and grows again never loses what is underneath
_wave = ["push 1", "push 2", "pop", "push 3", "push 4", "pop", "pop"]
assert stack_top(_wave) == 1, f"Got: {stack_top(_wave)}"
# A number of more than two digits must survive whole: 1024 is not 10
assert stack_top(["push 1024"]) == 1024, f"Got: {stack_top(['push 1024'])}"
_big = ["push 30", "push 200"]
assert stack_top(_big) == 200, f"Got: {stack_top(_big)}"
# Deep and multi-digit, and built rather than written out, so a memorised table of the
# inputs above cannot masquerade as an answer
_built = [f"push {_num}" for _num in range(100, 140)] + ["pop"] * 39
assert stack_top(_built) == 100, f"Got: {stack_top(_built)}"
_drained = [f"push {_num}" for _num in range(50, 90)] + ["pop"] * 40
assert stack_top(_drained) == -1, f"Got: {stack_top(_drained)}"
_given = ["push 2", "push 8", "pop"]
assert stack_top(_given) == 2, f"Got: {stack_top(_given)}"
assert _given == ["push 2", "push 8", "pop"], f"Got: the input was modified into {_given}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def stack_top(operations: list) -> int:
    """ Return the number on top of the pile after every command, or -1 if empty. """
    pile = []
    for operation in operations:
        if operation == "pop":
            if pile:
                pile.pop()
        else:
            pile.append(int(operation[5:]))
    if not pile:
        return -1
    return pile[-1]
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: returns the value pop handed back instead of the new top
def stack_top(operations: list) -> int:
    pile = []
    top = -1
    for operation in operations:
        if operation == "pop":
            if pile:
                top = pile.pop()
        else:
            top = int(operation[5:])
            pile.append(top)
    return top
```

```python # wrong: keeps only the top two in variables, so a third push is lost
def stack_top(operations: list) -> int:
    top, below = -1, -1
    for operation in operations:
        if operation == "pop":
            top, below = below, -1
        else:
            top, below = int(operation[5:]), top
    return top
```

```python # wrong: reports the bottom of the pile instead of the top
def stack_top(operations: list) -> int:
    pile = []
    for operation in operations:
        if operation == "pop":
            if pile:
                pile.pop()
        else:
            pile.append(int(operation[5:]))
    if not pile:
        return -1
    return pile[0]
```

```python # wrong: pops from the wrong end, first in first out
def stack_top(operations: list) -> int:
    pile = []
    for operation in operations:
        if operation == "pop":
            if pile:
                pile.pop(0)
        else:
            pile.append(int(operation[5:]))
    if not pile:
        return -1
    return pile[-1]
```

```python # wrong: keeps the last number pushed and never undoes it
def stack_top(operations: list) -> int:
    top = -1
    for operation in operations:
        if operation != "pop":
            top = int(operation[5:])
    return top
```

```python # wrong: consumes the caller's list instead of walking it
def stack_top(operations: list) -> int:
    pile = []
    while operations:
        operation = operations.pop(0)
        if operation == "pop":
            if pile:
                pile.pop()
        else:
            pile.append(int(operation[5:]))
    if not pile:
        return -1
    return pile[-1]
```

```python # wrong: a fixed-width slice, so a number of more than two digits is mangled
def stack_top(operations: list) -> int:
    pile = []
    for operation in operations:
        if operation == "pop":
            if pile:
                pile.pop()
        else:
            pile.append(int(operation[5:7]))
    if not pile:
        return -1
    return pile[-1]
```

```python # wrong: a memorised table of the test inputs instead of replaying them
def stack_top(operations: list) -> int:
    return {("push 7",): 7, ("push 1", "push 2"): 2,
            ("push 3", "push 5", "pop"): 3, (): -1, ("pop",): -1,
            ("push 4", "pop"): -1, ("push 0",): 0,
            ("pop", "pop", "push 9"): 9}.get(tuple(operations), -1)
```

```python # wrong: returns 0 for an empty pile instead of -1
def stack_top(operations: list) -> int:
    pile = []
    for operation in operations:
        if operation == "pop":
            if pile:
                pile.pop()
        else:
            pile.append(int(operation[5:]))
    if not pile:
        return 0
    return pile[-1]
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+operations
\w+\s*==\s*["']pop["']
\.append\(int\(
\bint\(\s*\w+\[\s*\d*\s*:\s*\]
\[5:\]
\[-1\]
(stack|pile)\.pop\(
(stack|pile)\s*=\s*\[\]
if\s+not\s+(stack|pile)\b
return\s+(stack|pile)\[
```

### Shortcuts the tests reject outright

None: there is no one-liner that skips this lesson.

```text # banned
```
