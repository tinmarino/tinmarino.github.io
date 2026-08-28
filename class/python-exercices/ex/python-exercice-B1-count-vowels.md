---
title: "Python B1 - Count the Vowels"
---

# Count the Vowels

## Instructions

Write a function `count_vowels(stg: str) -> int` that returns how many characters of `stg` are vowels.

Count them yourself with a loop, keeping a running total in a variable. `stg.count("a")` skips the whole point, and so does folding the loop into `sum(1 for ...)`, so **Check** turns down any use of `.count` or of `sum(`.

## Description

### Goal

Vowels are what make a word sayable, which is why `rhythm` is famous for having none.

Given a string, hand back **how many** of its characters are vowels &mdash; return
that number, do not print it.

### Rules

- The vowels are `a`, `e`, `i`, `o` and `u`. Five letters, no more.
- `y` is **not** a vowel here. `rhythm` scores `0` and `Python` scores `1`.
- Capitals count. `A` is as much a vowel as `a`, so `HELLO` scores `2`.
- Spaces, digits and punctuation are simply not counted.
- Do **not** use `.count`, anywhere, on anything &mdash; that shortcut *is* the answer.
- Do **not** use `sum(1 for ...)` or `len([... for ...])` either: folding the loop into
  one line skips the same lesson. **Check** refuses `sum(`; the rest is on your honour.

### Examples

| Call | Returns |
|---|---|
| `count_vowels("banana")` | `3` |
| `count_vowels("rhythm")` | `0` |
| `count_vowels("HELLO")` | `2` |
| `count_vowels("Python")` | `1` |
| `count_vowels("queueing")` | `5` |
| `count_vowels("")` | `0` |

### Keeping a count

`A3` had a variable set up before the loop, changed on every character, read at the end.
Same three moments here, except that in `A3` the variable grew into the answer while here
it counts: no character of `banana` is ever `3`.

Counting on its own, away from any loop:

```python
def show_total() -> None:
    """ Print a running total, built up in two steps. """
    running = 0
    running = running + 3
    running = running + 4
    print(running)     # prints 7


show_total()
```

`running = running + 3` reads the old value and stores a new one: that is how a variable
carries what it has seen from one turn of a loop to the next. `running += 3` says it
shorter.

Two mistakes that look right until you run them: `running = 0` sitting *inside* the loop,
and the `return` sitting inside the loop. Work out what each one does before you type.

### Asking a question about a character

Most characters must not move the counter at all, so you need to ask something about each
one first. `if` is new: it runs its indented block only when the condition holds.

```python
def show_long_word(word: str) -> None:
    """ Print the given word, but only when it has more than three letters. """
    if len(word) > 3:
        print(word)


show_long_word("beetle")    # prints beetle
show_long_word("ant")       # prints nothing
```

Walking a string character by character you have from `A3`. Loop, `if`, counter: the parts
are all on the table, and *where* each one goes is yours.

### Come back here once it works

Do it the long way first &mdash; five comparisons joined by `or` &mdash; and get **Check**
green. Then read on.

`in`, the keyword from every `for` line you have written, also works on its own, as an
operator answering `True` or `False`. What does it answer when its left side is one
character and its right side is a whole string? Try it in the console, then count how many
of your `or`s it replaced.

And before you fix its right-hand side: the Rules say capitals count too, so how many
distinct characters must your condition match? List them all, or first ask the string for a
copy of itself without capitals.

## Starter code

```python # template
def count_vowels(stg: str) -> int:
    """ Return how many characters of stg are vowels, capitals included.

    >>> count_vowels("banana")
    3
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(count_vowels("Ouagadougou"))
```

## Tests

```python # tests
# The point of this one is the loop you write, so Check refuses the shortcuts.
for _banned in (".count", "sum("):
    assert _banned not in __student_code__, f"Got: the banned shortcut {_banned}"

assert count_vowels("banana") == 3, f"Got: {count_vowels('banana')}"
assert count_vowels("") == 0, f"Got: {count_vowels('')}"
assert count_vowels("a") == 1, f"Got: {count_vowels('a')}"
assert count_vowels("z") == 0, f"Got: {count_vowels('z')}"
# Not one vowel in the whole word, so the counter must survive at 0
assert count_vowels("rhythm") == 0, f"Got: {count_vowels('rhythm')}"
assert count_vowels("crypt") == 0, f"Got: {count_vowels('crypt')}"
# y is a consonant here, whatever your primary school said
assert count_vowels("Python") == 1, f"Got: {count_vowels('Python')}"
assert count_vowels("yyy") == 0, f"Got: {count_vowels('yyy')}"
# Capitals are vowels too
assert count_vowels("HELLO") == 2, f"Got: {count_vowels('HELLO')}"
assert count_vowels("AEIOU") == 5, f"Got: {count_vowels('AEIOU')}"
assert count_vowels("Ouagadougou") == 8, f"Got: {count_vowels('Ouagadougou')}"
# Vowels in a row: the count must not stop at the first one it meets
assert count_vowels("queueing") == 5, f"Got: {count_vowels('queueing')}"
assert count_vowels("never odd or even") == 6, f"Got: {count_vowels('never odd or even')}"
# Spaces, digits and punctuation are not vowels
assert count_vowels("Hello, World!") == 3, f"Got: {count_vowels('Hello, World!')}"
assert count_vowels("a1e2i3") == 3, f"Got: {count_vowels('a1e2i3')}"
assert count_vowels("   ") == 0, f"Got: {count_vowels('   ')}"
# Built, not typed: a lookup table would have to do the counting first
assert count_vowels("encyclopaedia" * 7) == 42, f"Got: {count_vowels('encyclopaedia' * 7)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def count_vowels(stg: str) -> int:
    """ Return how many characters of stg are vowels, capitals included. """
    total = 0
    for char in stg.lower():
        if char in "aeiou":
            total += 1
    return total
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: collapses the loop into sum(), so no counter is ever kept
def count_vowels(stg: str) -> int:
    return sum(1 for char in stg.lower() if char in "aeiou")
```

```python # wrong: chains == with or, so every character is truthy
def count_vowels(stg: str) -> int:
    total = 0
    for char in stg.lower():
        if char == "a" or "e" or "i" or "o" or "u":
            total += 1
    return total
```

```python # wrong: adds up five .count() calls
def count_vowels(stg: str) -> int:
    lowered = stg.lower()
    return (lowered.count("a") + lowered.count("e") + lowered.count("i")
            + lowered.count("o") + lowered.count("u"))
```

```python # wrong: the same five .count() calls, folded into one generator
def count_vowels(stg: str) -> int:
    return sum(stg.lower().count(vowel) for vowel in "aeiou")
```

```python # wrong: forgets that capitals are vowels too
def count_vowels(stg: str) -> int:
    total = 0
    for char in stg:
        if char in "aeiou":
            total += 1
    return total
```

```python # wrong: counts y as a vowel
def count_vowels(stg: str) -> int:
    total = 0
    for char in stg.lower():
        if char in "aeiouy":
            total += 1
    return total
```

```python # wrong: sets the counter up inside the loop
def count_vowels(stg: str) -> int:
    for char in stg.lower():
        total = 0
        if char in "aeiou":
            total += 1
    return total
```

```python # wrong: returns from inside the loop, at the first vowel
def count_vowels(stg: str) -> int:
    total = 0
    for char in stg.lower():
        if char in "aeiou":
            total += 1
            return total
    return total
```

```python # wrong: prints the count instead of returning it
def count_vowels(stg: str) -> int:
    total = 0
    for char in stg.lower():
        if char in "aeiou":
            total += 1
    print(total)
    return None
```

```python # wrong: a lookup table of the strings the tests happen to use
def count_vowels(stg: str) -> int:
    return {"banana": 3, "": 0, "a": 1, "z": 0, "rhythm": 0, "crypt": 0,
            "Python": 1, "yyy": 0, "HELLO": 2, "AEIOU": 5, "Ouagadougou": 8,
            "queueing": 5, "never odd or even": 6, "Hello, World!": 3,
            "a1e2i3": 3, "   ": 0}.get(stg, 0)
```

### Give-aways the Description must never contain

```text # forbidden
in\s*["']aeiou
["']aeiou["']
for\s+\w+\s+in\s+stg\b
\btotal\s*\+=
\btotal\s*=\s*total\s*\+
\b\w+\s*\+=\s*1\b
\b\w+\s*=\s*\w+\s*\+\s*1\b
^\s*return\s+\w+\s*$
\.lower\(\)
\.count
```

### Shortcuts the tests reject outright

```text # banned
.count
sum(
```
