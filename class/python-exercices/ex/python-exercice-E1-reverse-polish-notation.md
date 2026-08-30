---
title: "Python E1 - Reverse Polish Notation"
---

# Reverse Polish Notation

## Instructions

Write a function `evaluate(stg: str) -> int` that computes the reverse-Polish expression in `stg`, where the operator comes *after* its two numbers.

Work it out with a stack. `eval(` cannot read this notation at all &mdash; try `eval("3 4 +")` in the console &mdash; and **Check** turns it down anyway.

## Description

### Goal

Normally you write `3 + 4`. In **reverse Polish notation** you write `3 4 +`: both
numbers first, then the thing to do with them. `3 4 + 2 *` means add three and four,
then multiply the result by two. It is `14`.

That looks like a worse way to write maths until you notice what is missing from it.
There are no brackets. There are none anywhere in this exercise, and there is no rule
that multiplication happens before addition, because the order is already written into
the expression itself. `1 2 + 3 4 + *` can only mean one thing.

Your function takes one of these expressions as a string and returns the number it
comes to. Return it &mdash; do not print it.

### Rules

- Everything is separated by single spaces: `"3 4 + 2 *"`.
- Three operators: `+`, `-` and `*`. No division.
- Every number is a whole number. Negative numbers can appear as values, like `"-3 5 +"`.
- The expression is always valid. You do not have to report errors.
- The expression always contains at least one number. Empty strings will not be tested.
- A lone number is a complete expression: `"5"` is `5`.
- **Order matters for `-`.** `"5 3 -"` is `5 - 3`, which is `2`. Not `-2`.
- Do **not** use `eval(`. It cannot read this notation, and doing the arithmetic yourself is the exercise.

### Examples

| Call | Returns |
|---|---|
| `evaluate("3 4 +")` | `7` |
| `evaluate("3 4 + 2 *")` | `14` |
| `evaluate("5")` | `5` |
| `evaluate("5 3 -")` | `2` |
| `evaluate("3 5 -")` | `-2` |
| `evaluate("2 3 4 * +")` | `14` |
| `evaluate("1 2 + 3 4 + *")` | `21` |

Check the last one by hand before you write anything. One and two make three; three and
four make seven; three times seven is twenty-one. Notice that you had to *hold on to*
the three while you worked out the seven.

### Getting the pieces out of the string

The expression arrives as one string, and you want its pieces. `split()` cuts a string
wherever there are spaces and hands back a list:

```python
print("the quick brown fox".split())    # prints ['the', 'quick', 'brown', 'fox']
```

Every piece it gives you is text, including the ones that look like numbers, so `"3"`
still needs `int("3")` before it can be added to anything. You met that in exercise `B4`.

You will also want to ask which kind of piece you are holding. `in` works on a tuple of
choices, exactly as it worked on a string of vowels in exercise `B1`:

```python
print("and" in ("and", "or"))    # prints True
print("cat" in ("and", "or"))    # prints False
```

### The shape of it

Walk the pieces from left to right. Some of them are numbers, and a number is not
something you can act on yet &mdash; when you are holding `1` in `1 2 + 3 4 + *`, there is
nothing to do with it. You have to keep it and carry on.

Then an operator turns up, and suddenly you need two numbers back. Not any two: the two
most recent ones. And the moment you have used them, the answer they produced becomes a
number you are holding, waiting for some later operator, exactly like the ones before it.

You have a structure that keeps things and gives back the most recent one first. You
built it out of a list in exercise `D1`, you reversed with it in `D2`, and you undid
edits with it in `D3`.

So: when an operator arrives, where do its two numbers come from, and where does the
result it produces have to go? Answer that and the rest is typing.

### One thing that will bite you

`5 3 -` is `2`, and `3 5 -` is `-2`. Whichever way you get your two numbers back, one of
them is the left-hand side of the subtraction and one is the right. Which is which?
You already know what a stack does to the order of things &mdash; you proved it in `D2`.
Work out which way round it lands *before* you type it, then check yourself against
`5 3 -`.

Get it wrong and `+` and `*` will still pass every test you try, because it makes no
difference to those two. Subtraction is the only one that tells you.

## Starter code

```python # template
def evaluate(stg: str) -> int:
    """ Return the value of the reverse-Polish expression in stg.

    >>> evaluate("3 4 + 2 *")
    14
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(evaluate("5 1 2 + 4 * + 3 -"))
```

## Tests

```python # tests
# Refuse the shortcuts that skip the lesson. __student_code__ is the student's own
# source, injected by the app and the verifier; strip its docstrings and comments
# so a note to yourself is never mistaken for the real thing, then match each
# construct whitespace-insensitively and on a word boundary, so a stray space
# cannot slip a banned call past the ban that names it.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in ("eval(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert evaluate("3 4 +") == 7, f"Got: {evaluate('3 4 +')}"
assert evaluate("3 4 + 2 *") == 14, f"Got: {evaluate('3 4 + 2 *')}"
# A lone number is a whole expression
assert evaluate("5") == 5, f"Got: {evaluate('5')}"
assert evaluate("0") == 0, f"Got: {evaluate('0')}"
assert evaluate("42") == 42, f"Got: {evaluate('42')}"
# Subtraction is the only operator that notices a swapped order
assert evaluate("5 3 -") == 2, f"Got: {evaluate('5 3 -')}"
assert evaluate("3 5 -") == -2, f"Got: {evaluate('3 5 -')}"
assert evaluate("0 5 -") == -5, f"Got: {evaluate('0 5 -')}"
assert evaluate("10 1 - 1 -") == 8, f"Got: {evaluate('10 1 - 1 -')}"
assert evaluate("20 5 3 - -") == 18, f"Got: {evaluate('20 5 3 - -')}"
# The operator applies to the two MOST RECENT values, not the first two
assert evaluate("2 3 4 * +") == 14, f"Got: {evaluate('2 3 4 * +')}"
assert evaluate("2 3 4 + *") == 14, f"Got: {evaluate('2 3 4 + *')}"
assert evaluate("1 2 + 3 4 + *") == 21, f"Got: {evaluate('1 2 + 3 4 + *')}"
assert evaluate("5 1 2 + 4 * + 3 -") == 14, f"Got: {evaluate('5 1 2 + 4 * + 3 -')}"
# Multiplication, and a value that is not the sum of anything
assert evaluate("2 3 *") == 6, f"Got: {evaluate('2 3 *')}"
assert evaluate("6 7 * 2 -") == 40, f"Got: {evaluate('6 7 * 2 -')}"
# Negative numbers can be written down, not only computed
assert evaluate("-3 5 +") == 2, f"Got: {evaluate('-3 5 +')}"
assert evaluate("-2 -3 *") == 6, f"Got: {evaluate('-2 -3 *')}"
# Deeper than any single pair: nothing may be forgotten along the way
assert evaluate("1 2 3 4 5 + + + +") == 15, f"Got: {evaluate('1 2 3 4 5 + + + +')}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def evaluate(stg: str) -> int:
    """ Return the value of the reverse-Polish expression in stg. """
    values = []
    for token in stg.split():
        if token not in ("+", "-", "*"):
            values.append(int(token))
            continue
        right = values.pop()
        left = values.pop()
        if token == "+":
            values.append(left + right)
        elif token == "-":
            values.append(left - right)
        else:
            values.append(left * right)
    return values.pop()
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: reaches for eval( -- caught by the source ban, not the assertions
def evaluate(stg: str) -> int:
    return eval(stg)
```

```python # wrong: subtracts the wrong way round
def evaluate(stg: str) -> int:
    values = []
    for token in stg.split():
        if token not in ("+", "-", "*"):
            values.append(int(token))
            continue
        left = values.pop()
        right = values.pop()
        if token == "+":
            values.append(left + right)
        elif token == "-":
            values.append(left - right)
        else:
            values.append(left * right)
    return values.pop()
```

```python # wrong: pops both in one line, so the operands arrive swapped
def evaluate(stg: str) -> int:
    values = []
    for token in stg.split():
        if token not in ("+", "-", "*"):
            values.append(int(token))
            continue
        left, right = values.pop(), values.pop()
        if token == "+":
            values.append(left + right)
        elif token == "-":
            values.append(left - right)
        else:
            values.append(left * right)
    return values.pop()
```

```python # wrong: hides the swapped order behind abs() instead of fixing it
def evaluate(stg: str) -> int:
    values = []
    for token in stg.split():
        if token not in ("+", "-", "*"):
            values.append(int(token))
            continue
        left = values.pop()
        right = values.pop()
        if token == "+":
            values.append(left + right)
        elif token == "-":
            values.append(abs(left - right))
        else:
            values.append(left * right)
    return values.pop()
```

```python # wrong: adds every number and ignores the operators
def evaluate(stg: str) -> int:
    total = 0
    for token in stg.split():
        if token not in ("+", "-", "*"):
            total += int(token)
    return total
```

```python # wrong: handles only one pair, so anything deeper is dropped
def evaluate(stg: str) -> int:
    parts = stg.split()
    if len(parts) == 1:
        return int(parts[0])
    left, right, token = int(parts[0]), int(parts[1]), parts[2]
    if token == "+":
        return left + right
    if token == "-":
        return left - right
    return left * right
```

```python # wrong: applies each operator to the two OLDEST values, not the newest
def evaluate(stg: str) -> int:
    values = []
    for token in stg.split():
        if token not in ("+", "-", "*"):
            values.append(int(token))
            continue
        left = values.pop(0)
        right = values.pop(0)
        if token == "+":
            values.append(left + right)
        elif token == "-":
            values.append(left - right)
        else:
            values.append(left * right)
    return values.pop()
```

### Give-aways the Description must never contain

```text # forbidden
\.pop\(\)
values\.append
stg\.split\(\)
\beval\(
left\s*-\s*right
right\s*=\s*\w+\.pop
for\s+token\s+in
```

### Shortcuts the tests reject outright

```text # banned
eval(
```
