---
title: "Python A4 - Fibonacci"
---

# Fibonacci

## Instructions

Write a function `fibo(pos: int) -> int` that returns the number at position `pos` in the Fibonacci sequence, counting from `0`.

## Description

### Goal

Return the Fibonacci number at position `pos`, counting from `0`.

### History

The name comes from **Fibonacci**, the Latin nickname of Leonardo of Pisa, who wrote
about this sequence in *Liber Abaci* in 1202. The famous story attached to it is the
rabbit puzzle: start with one pair, let each adult pair produce a new pair every month,
and count how many pairs there are as time passes.

That rabbit story is not biology. It is a compact way to describe a quantity whose new
value depends on its recent past. The sequence turned out to be useful far beyond the
story: population models, tree-like branching, dynamic programming examples, and the
mathematics of growth all keep running into it.

### The sequence

In this classroom it begins like this:

```
position  0  1  2  3  4  5  6   7   8   9  10
value     0  1  1  2  3  5  8  13  21  34  55
```

The two border cases are the first two positions: `0` gives `0`, and `1` gives `1`.
After that, each new value comes from the two just before it. Negative positions are
outside this exercise, and they are worth mentioning because they show what a stopping
rule has to protect you from: a recursive idea that never reaches its base case is not
finished.

### Examples

| Call | Returns |
|---|---|
| `fibo(0)` | `0` |
| `fibo(1)` | `1` |
| `fibo(5)` | `5` |
| `fibo(10)` | `55` |
| `fibo(20)` | `6765` |

### Recursive functions

A **recursive** function is a function that solves a problem by calling itself on a
smaller version of that same problem. Fibonacci is the textbook example because the
definition itself is recursive: a later term is explained by earlier terms.

Why teachers like it:

- it forces you to identify the base cases clearly
- it shows how one definition can lead to two very different programs
- it makes the call stack visible as a useful tool instead of a hidden machine detail

The attraction of recursion is that the code can become short and direct. You often need
fewer working variables because the stack remembers where each unfinished call must come
back to. The cost is speed: the naive recursive version recomputes the same values many
times, so elegant code can still be expensive code.

### Where to start

There are two honest roads here.

The loop asks: how little history do you really need to carry forward in order to build
the next value? Not the whole sequence, only the part the next step depends on.

The recursive road asks a different question: what smaller Fibonacci questions would a
position ask before it can answer itself?

Both roads teach something. Write the loop first, then come back and sketch the recursive
one beside it.

### Things you will need

Python assigns several variables at once, and evaluates the whole right-hand side
*before* any of them changes, so no temporary is needed to exchange two values:

```python
first, second = 10, 20
first, second = second, first     # first is 20, second is 10
```

To repeat something a counted number of times, `for _ in range(count):` runs the body
`count` times; `_` is the conventional name for a loop variable you never read. Getting
`count` right is on you &mdash; see "Check yourself" below.

### Why teachers keep assigning it

This one tiny problem packs several lessons into a very small function: edge cases,
counted repetition, recursion, cost, and off-by-one errors. It is one of the first
places where a mathematically neat definition and an efficient program part company.

That is why it keeps turning up in computing classes. The function is short. The ideas it
opens are not.

### Check yourself

Before running anything, trace your idea by hand for `pos = 3` and confirm you get `2`,
and for `pos = 0` that you get `0`. Off-by-one errors live exactly here: count how many
times you step, not how many numbers you have seen.

## Starter code

```python # template
def fibo(pos: int) -> int:
    """ Return the Fibonacci number at position pos, counting from 0.

    >>> fibo(10)
    55
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(fibo(10))
```

## Tests

```python # tests
# Every position in a row, so a lookup table cannot masquerade as an answer
assert fibo(0) == 0, f"Got: {fibo(0)}"
assert fibo(1) == 1, f"Got: {fibo(1)}"
assert fibo(2) == 1, f"Got: {fibo(2)}"
assert fibo(3) == 2, f"Got: {fibo(3)}"
assert fibo(4) == 3, f"Got: {fibo(4)}"
assert fibo(5) == 5, f"Got: {fibo(5)}"
assert fibo(6) == 8, f"Got: {fibo(6)}"
assert fibo(7) == 13, f"Got: {fibo(7)}"
assert fibo(8) == 21, f"Got: {fibo(8)}"
assert fibo(9) == 34, f"Got: {fibo(9)}"
assert fibo(10) == 55, f"Got: {fibo(10)}"
assert [fibo(k) for k in range(12)] == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], \
    f"Got: {[fibo(k) for k in range(12)]}"
assert fibo(20) == 6765, f"Got: {fibo(20)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def fibo(pos: int) -> int:
    """ Return the Fibonacci number at position pos. """
    left, right = 0, 1
    for _ in range(pos):
        left, right = right, left + right
    return left
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: lookup table of the tested positions only
def fibo(pos: int) -> int:
    return {0: 0, 1: 1, 2: 1, 5: 5, 10: 55, 20: 6765}.get(pos, 0)
```

```python # wrong: off by one
def fibo(pos: int) -> int:
    left, right = 0, 1
    for _ in range(pos + 1):
        left, right = right, left + right
    return left
```

```python # wrong: starts the sequence at 1, 1
def fibo(pos: int) -> int:
    left, right = 1, 1
    for _ in range(pos):
        left, right = right, left + right
    return left
```

### Give-aways the Description must never contain

```text # forbidden
fibo\(\s*pos\s*-
\+\s*fibo\(
range\(pos\)
right,\s*left\s*\+\s*right
```

### Shortcuts the tests reject outright

None: there is no one-liner that skips this lesson.

```text # banned
```
