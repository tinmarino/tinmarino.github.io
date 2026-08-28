---
title: "Python C5 - Two Sum"
---

# Two Sum

## Instructions

Write a function `two_sum(lst: list, target: int) -> tuple` that returns the positions of the two numbers in `lst` that add up to `target`.

Positions, not numbers: `two_sum([12, 5, 18, 25, 7], 30)` is `(0, 2)`, because the prices on lines `0` and `2` are `12` and `18`. Return the empty tuple `()` when no two numbers add up.

## Description

### Goal

A receipt from the market, one price per line:

```
line     0   1   2   3   4
price   12   5  18  25   7
```

You paid 30 for two of those items together and you cannot remember which two. That is the whole job: hand back the two **line numbers**, `(0, 2)`, because `12 + 18` is `30`.

A line can also carry a negative number &mdash; a refund &mdash; and so can `target`.

### Rules

- Return a tuple of two positions, the earlier one first: `(0, 2)`, never `(2, 0)` and never `(12, 18)`.
- The two positions must be different: one line cannot be used twice, so `two_sum([4, 9, 2], 8)` is `()` even though `4 + 4` is `8`. But two *equal* numbers at two different positions are a real pair, so `two_sum([0, 0], 0)` is `(0, 1)`.
- When no two numbers add up to `target`, return the empty tuple `()`.
- When several pairs add up to `target`, exactly one of them is the answer. Which one is *Which pair, exactly?*, below.
- Return the answer, do not print it, and leave `lst` as you found it.

### Examples

| Call | Returns |
|---|---|
| `two_sum([12, 5, 18, 25, 7], 30)` | `(0, 2)` |
| `two_sum([10, 12, 18, 20], 30)` | `(1, 2)` |
| `two_sum([6, 6, 3, 9], 15)` | `(0, 3)` |
| `two_sum([0, 0], 0)` | `(0, 1)` |
| `two_sum([-3, 7, 1, -4], -7)` | `(0, 3)` |
| `two_sum([4, 9, 2], 8)` | `()` |
| `two_sum([30], 30)` | `()` |
| `two_sum([1, 2], 3)` | `(0, 1)` |
| `two_sum([], 30)` | `()` |

### Which pair, exactly?

The second row hides two answers: in `[10, 12, 18, 20]` with a target of `30`, both `12 + 18` and `10 + 20` work. Only one is right, and the rule is:

> Read the list once, from left to right. The answer is the pair that is **complete first** &mdash; the one whose later position comes soonest.

Walk it:

| At position | Number | A partner behind it? |
|---|---|---|
| 0 | `10` | nothing behind it yet |
| 1 | `12` | `10` is behind, and `10 + 12` is `22` |
| 2 | `18` | `12` is behind, and `12 + 18` is `30` &mdash; stop here |

So the answer is `(1, 2)`: `10 + 20` is not complete until position `3`, which is later. Note what the rule is *not* &mdash; "the pair whose first number comes earliest" would have answered `(0, 3)`.

Same walk on the third row: the `9` of `[6, 6, 3, 9]` has partners behind it at `0` and at `1`. Take the earlier one, so `(0, 3)`.

### Things you will need

A tuple is written with parentheses, and is the natural shape for a pair:

```python
pair = (1, 4)
print(pair)          # prints (1, 4)
print(())            # prints (), the empty tuple
```

`return` leaves the function the instant it runs, even from inside a loop, and `enumerate` hands you a position and an element at the same time:

```python
def find_zero(values: list) -> int:
    """ Return the position of the first 0 in values, or -1 if there is none. """
    for index, value in enumerate(values):
        if value == 0:
            return index
    return -1
```

Loops nest, and the inner one is allowed to depend on the outer one:

```python
for outer in range(4):
    for inner in range(outer):
        print(outer, inner)
```

That is one way of saying "for each position, everything before it": when `outer` is `0` the inner loop runs zero times, when it is `3` it runs three times.

### Start with two loops

Two loops, one inside the other, is a correct answer and **Check** accepts it &mdash; but **which loop goes outside decides which pair you find**, and only one of the two nestings walks the receipt the way the table above does. Which one is yours to work out.

Then count what it would cost if the answer were the very last pair: ten additions on the five-line receipt, which is nothing; about fifty million on a stock list of ten thousand lines. The list grew two thousand times and the work grew five million times.

### Could you get away with reading the list only once?

Stand on the `18`, at position `2` of `[10, 12, 18, 20]`. You need `30`. There is exactly **one** number in the world that would finish the job standing where you are, and you can name it without looking at the list at all. Name it.

So the search was never "which of the numbers behind me works". It is a much smaller question: **is that one number behind me, and if it is, at which position?**

A list answers that slowly: `if value in some_list` starts at the front and walks. But in the counting exercises you already built a container that answers "have I got this one?" in a single step, however much it is holding.

So, the whole exercise: as you walk the list once, what would you write down about each number you pass, so that when you land on the next one you can answer "is my partner behind me, and where?" without ever looking back?

Trace it by hand on `[10, 12, 18, 20]`, on paper, before you write a line. If it survives the trace, it works &mdash; and it reads the receipt exactly once.

## Starter code

```python # template
def two_sum(lst: list, target: int) -> tuple:
    """ Return the positions (earlier, later) of lst's first pair completed left to right, or ().

    >>> two_sum([10, 12, 18, 20], 30)
    (1, 2)
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(two_sum([12, 5, 18, 25, 7], 30))
```

## Tests

```python # tests
# Nothing is banned here: two nested loops are a correct answer to this one -- but only
# with the outer loop on each position and the inner one over everything before it.
# The other nesting completes 10 + 20 before 12 + 18, and the tie-break below refuses it.
_receipt = [12, 5, 18, 25, 7]
assert isinstance(two_sum(_receipt, 30), tuple), \
    f"Got: {type(two_sum(_receipt, 30))} for [12, 5, 18, 25, 7] and target 30, expected a tuple"
assert two_sum(_receipt, 30) == (0, 2), f"Got: {two_sum(_receipt, 30)}"
assert _receipt == [12, 5, 18, 25, 7], f"Got: the input was modified into {_receipt}"
# Two pairs add up: 12 + 18 is complete at position 2, 10 + 20 only at position 3
assert two_sum([10, 12, 18, 20], 30) == (1, 2), \
    f"Got: {two_sum([10, 12, 18, 20], 30)} for [10, 12, 18, 20] and target 30, " \
    f"expected (1, 2): 12 + 18 is complete at position 2, 10 + 20 only at position 3"
# The partner of 9 sits at both position 0 and position 1: the earlier one wins
assert two_sum([6, 6, 3, 9], 15) == (0, 3), \
    f"Got: {two_sum([6, 6, 3, 9], 15)} for [6, 6, 3, 9] and target 15, " \
    f"expected (0, 3): the 9 has a partner at 0 and at 1, and the earlier one wins"
# 4 + 4 is 8, but there is a single 4: one position may not pair with itself
assert two_sum([4, 9, 2], 8) == (), \
    f"Got: {two_sum([4, 9, 2], 8)} for [4, 9, 2] and target 8, " \
    f"expected (): the two positions must differ, and there is only one 4"
# Two equal numbers at two different positions ARE a pair, unlike the case above
assert two_sum([0, 0], 0) == (0, 1), \
    f"Got: {two_sum([0, 0], 0)} for [0, 0] and target 0, " \
    f"expected (0, 1): two equal numbers at different positions are a pair"
# A line may carry a negative number, and so may target: -3 + -4 is -7
assert two_sum([-3, 7, 1, -4], -7) == (0, 3), \
    f"Got: {two_sum([-3, 7, 1, -4], -7)} for [-3, 7, 1, -4] and target -7, " \
    f"expected (0, 3): negative prices count, and -3 + -4 is -7"
assert two_sum([], 30) == (), f"Got: {two_sum([], 30)}"
assert two_sum([30], 30) == (), f"Got: {two_sum([30], 30)}"
assert two_sum([1, 2], 3) == (0, 1), f"Got: {two_sum([1, 2], 3)}"
assert two_sum([12, 5, 18, 25, 7], 100) == (), f"Got: {two_sum([12, 5, 18, 25, 7], 100)}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_generated = [(_step * 37) % 101 for _step in range(101)]
assert two_sum(_generated, 100) == (14, 16), f"Got: {two_sum(_generated, 100)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def two_sum(lst: list, target: int) -> tuple:
    """ Return the positions (earlier, later) of lst's first pair completed left to right. """
    seen = {}
    for index, number in enumerate(lst):
        partner = target - number
        if partner in seen:
            return (seen[partner], index)
        if number not in seen:
            seen[number] = index
    return ()
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: takes the pair whose first number comes earliest, not the pair completed first
def two_sum(lst: list, target: int) -> tuple:
    for first in range(len(lst)):
        for second in range(first + 1, len(lst)):
            if lst[first] + lst[second] == target:
                return (first, second)
    return ()
```

```python # wrong: lets a number pair with itself
def two_sum(lst: list, target: int) -> tuple:
    for second in range(len(lst)):
        for first in range(second + 1):
            if lst[first] + lst[second] == target:
                return (first, second)
    return ()
```

```python # wrong: reads the rule as "different values" instead of "different positions"
def two_sum(lst: list, target: int) -> tuple:
    for second in range(len(lst)):
        for first in range(second):
            if lst[first] != lst[second] and lst[first] + lst[second] == target:
                return (first, second)
    return ()
```

```python # wrong: returns the two numbers instead of their positions
def two_sum(lst: list, target: int) -> tuple:
    for second in range(len(lst)):
        for first in range(second):
            if lst[first] + lst[second] == target:
                return (lst[first], lst[second])
    return ()
```

```python # wrong: returns the positions the wrong way round
def two_sum(lst: list, target: int) -> tuple:
    seen = {}
    for index, number in enumerate(lst):
        partner = target - number
        if partner in seen:
            return (index, seen[partner])
        seen[number] = index
    return ()
```

```python # wrong: remembers the last position of a repeated number instead of the first
def two_sum(lst: list, target: int) -> tuple:
    seen = {}
    for index, number in enumerate(lst):
        partner = target - number
        if partner in seen:
            return (seen[partner], index)
        seen[number] = index
    return ()
```

```python # wrong: falls off the end and returns None when no pair adds up
def two_sum(lst: list, target: int) -> tuple:
    seen = {}
    for index, number in enumerate(lst):
        partner = target - number
        if partner in seen:
            return (seen[partner], index)
        if number not in seen:
            seen[number] = index
    return None
```

```python # wrong: a memorised table of every list the tests spell out
def two_sum(lst: list, target: int) -> tuple:
    known = {
        "[12, 5, 18, 25, 7]30": (0, 2), "[10, 12, 18, 20]30": (1, 2),
        "[6, 6, 3, 9]15": (0, 3), "[1, 2]3": (0, 1), "[0, 0]0": (0, 1),
        "[-3, 7, 1, -4]-7": (0, 3),
    }
    return known.get(str(lst) + str(target), ())
```

### Give-aways the Description must never contain

```text # forbidden
\bdicts?\b
seen\s*=\s*\{\}
seen\[
\bin\s+seen\b
target\s*-\s*\w
partner\s*=\s*target
enumerate\(lst
for\s+\w+\s+in\s+lst\b
lst\[\w+\]\s*\+\s*lst\[\w+\]
range\(\w+\s*\+\s*1,\s*len\(lst\)\)
```

### Shortcuts the tests reject outright

None: two nested loops are the intended first answer, so no construct is refused.

```text # banned
```
