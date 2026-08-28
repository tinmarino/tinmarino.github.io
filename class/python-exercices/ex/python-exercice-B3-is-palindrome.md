---
title: "Python B3 - Is it a Palindrome?"
---

# Is it a Palindrome?

## Instructions

Write a function `is_palindrome(stg: str) -> bool` that returns `True` when `stg` reads the same backwards as forwards, and `False` when it does not.

Compare the characters yourself. `[::-1]`, `reversed(` and `.reverse()` *are* the answer, so **Check** turns them down.

## Description

### Goal

The interesting part is not the answer. It is how little of the string you have to look
at before you are sure of it.

A palindrome reads the same in both directions: `kayak` backwards is still `kayak`,
while `python` backwards is `nohtyp`. Decide which of the two kinds of string you were
handed, and return `True` or `False`.

### Rules

- Characters count exactly as they arrive. A space is a character like any other, and
  `K` is not `k`. That goes for the spaces at the ends too: `is_palindrome("a ")` is
  `False`, because the string starts with `a` and ends with a space.
- Return the **value** `True` or `False`. Not the text `"True"`, and not a `print`.
- The empty string is a palindrome, and so is any single character. Neither should need
  a special case: if your loop is right, both already work.
- Build it yourself. Do **not** use `reversed()`, `.reverse()` or the slice
  `[::-1]` &mdash; those *are* the answer, and the comparing is the exercise.
- Compare the characters where they sit, by position. Do not build a second string and
  compare the two of them, and do not cut the input shorter and hand it back to
  yourself &mdash; **Check** watches for both. (Recursion is a fine technique. It is not
  this exercise.) Reading every character twice over is refused as well.

### Examples

| Call | Returns |
|---|---|
| `is_palindrome("kayak")` | `True` |
| `is_palindrome("python")` | `False` |
| `is_palindrome("step on no pets")` | `True` |
| `is_palindrome("never odd or even")` | `False` |
| `is_palindrome("Kayak")` | `False` |
| `is_palindrome("a")` | `True` |
| `is_palindrome("a ")` | `False` |
| `is_palindrome("  x  ")` | `True` |
| `is_palindrome("")` | `True` |

### Why "never odd or even" comes out False

It is a famous palindrome, and here it is not one, because of the first rule: every
character counts, spaces included. Read backwards, character for character, it spells
`neve ro ddo reven`. The letters do mirror each other; the spaces do not.
`step on no pets` puts its spaces in mirrored places, so it survives.

### Things you will need

A character is read out of a string by its position, counting from `0`:

```python
word, position = "python", 1
print(word[position])          # y
print(word[len(word) - 1])     # n
```

A `while` loop repeats as long as its condition is true. Two parts must be right: the
condition, and the change you make inside the body. Forget the change and the loop never
ends &mdash; that is what the **Stop** button above the editor is for.

```python
def count_down(start: int) -> None:
    """ Print every whole number from start down to 1. """
    count = start
    while count > 0:
        print(count)
        count = count - 1
```

A `return` inside a loop ends the function on the spot, and the rest of the loop never
runs:

```python
def has_negative(numbers: list) -> bool:
    """ Return True as soon as a value below zero turns up. """
    for number in numbers:
        if number < 0:
            return True
    return False
```

Look at those two `return`s. One of them fires early, the moment the evidence turns up.
The other can only be trusted once the loop has finished and found nothing. Your
function also has two possible answers: which one can you give early, and which one has
to wait?

### The mirror

Take `python`: six characters, positions `0` to `5`. For it to be a palindrome, the
character at position `0` has to equal the character at exactly one other position.
Which one? And the character at position `1`? Write the pairs down.

Now the same for `kayak`: five characters, positions `0` to `4`. This time one position
is left over with no partner. Which position, and does it change your answer?

### When do you stop?

Put one position at the front of the string and one at the back. Compare those two
characters, then step both positions one place towards each other, and keep going until
you stop. *When* you stop is the real exercise, and this page is not going to tell you.
A `while` is the natural shape for it, but a `for` loop over positions does the same
job; the question at the end of this section is the same either way.

The two positions are travelling towards each other, so they do not stay apart for long
&mdash; but what happens when they run out of room depends on the word. Put a finger on
each end of `kayak` and step them in until they stop being apart; do it again on `noon`.
On one of those words your fingers land on the same character, on the other they pass
each other without ever touching. Whatever condition you write has to survive both.

Now do this on paper. For `kayak`, and again for `noon`, write down every pair of
characters you compared before your two fingers crossed. Underneath that, write down
every pair the word actually contains &mdash; each character with its mirror. Compare
the two lists.

## Starter code

```python # template
def is_palindrome(stg: str) -> bool:
    """ Return True if stg reads the same backwards, character for character.

    >>> is_palindrome("kayak")
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(is_palindrome("step on no pets"))
```

## Tests

```python # tests
# The point of this one is the comparing you do yourself, so Check refuses the
# shortcuts. Whitespace is squashed first, so `stg[:: -1]` cannot sneak past.
_SQUASHED = "".join(__student_code__.split())
for _banned in ("[::-1]", "reversed(", ".reverse()"):
    assert _banned not in _SQUASHED, f"Got: the banned shortcut {_banned}"

assert is_palindrome("kayak") is True, f"Got: {is_palindrome('kayak')}"
assert is_palindrome("python") is False, f"Got: {is_palindrome('python')}"
# The shortest strings: no special case should have been needed for either
assert is_palindrome("") is True, f"Got: {is_palindrome('')}"
assert is_palindrome("a") is True, f"Got: {is_palindrome('a')}"
assert is_palindrome("on") is False, f"Got: {is_palindrome('on')}"
assert is_palindrome("noon") is True, f"Got: {is_palindrome('noon')}"
assert is_palindrome("stats") is True, f"Got: {is_palindrome('stats')}"
# First and last agreeing proves nothing about the rest
assert is_palindrome("senses") is False, f"Got: {is_palindrome('senses')}"
# Even length: the two characters in the centre are a pair, and they must be compared
assert is_palindrome("test") is False, f"Got: {is_palindrome('test')}"
# Spaces are characters: these two differ only in where the spaces fall
assert is_palindrome("step on no pets") is True, f"Got: {is_palindrome('step on no pets')}"
assert is_palindrome("never odd or even") is False, \
    f"Got: {is_palindrome('never odd or even')}"
assert is_palindrome("rats live on no evil star") is True, \
    f"Got: {is_palindrome('rats live on no evil star')}"
# The spaces at the ends are characters too, so nothing may be cleaned off first
assert is_palindrome("a ") is False, f"Got: {is_palindrome('a ')}"
assert is_palindrome(" a") is False, f"Got: {is_palindrome(' a')}"
assert is_palindrome("noon ") is False, f"Got: {is_palindrome('noon ')}"
assert is_palindrome("  x  ") is True, f"Got: {is_palindrome('  x  ')}"
# Case is a difference too
assert is_palindrome("Kayak") is False, f"Got: {is_palindrome('Kayak')}"
assert is_palindrome("Noon") is False, f"Got: {is_palindrome('Noon')}"
# Digits and punctuation are characters like the rest
assert is_palindrome("12321") is True, f"Got: {is_palindrome('12321')}"
assert is_palindrome("2021") is False, f"Got: {is_palindrome('2021')}"
assert is_palindrome("no!on") is True, f"Got: {is_palindrome('no!on')}"


class _Watched(str):
    """ A string that records how it was looked at: by position, or all in one go. """

    def __init__(self, _text):
        """ Start both counters at zero. """
        super().__init__()
        self.reads = 0
        self.bulk = 0

    def __getitem__(self, index):
        """ Count this read by position and hand back the character. """
        self.reads += 1
        return str.__getitem__(self, index)

    def __eq__(self, other):
        """ Count a comparison against a whole other string of the same length. """
        if isinstance(other, str) and len(other) == len(self):
            self.bulk += 1
        return str.__eq__(self, other)

    def __hash__(self):
        """ Stay hashable, which overriding __eq__ would otherwise take away. """
        return str.__hash__(self)


# How did the answer actually look at the string? This one is a palindrome, so every
# pair has to be checked -- none skipped, none checked from both ends, and none of it
# done by rebuilding the string and comparing the two in one go.
_CORE = "abcdefghij" * 5
_PROBE = _Watched(_CORE + _CORE[::-1])
assert is_palindrome(_PROBE) is True, f"Got: {is_palindrome(_PROBE)}"
assert _PROBE.bulk == 0, \
    f"Got: you compared the whole string against another one, {_PROBE.bulk} time(s)"
assert _PROBE.reads > 0, \
    f"Got: you read {_PROBE.reads} characters by position; compare them where they sit"
assert _PROBE.reads >= len(_PROBE) // 2, \
    f"Got: you read {_PROBE.reads} of {len(_PROBE)} characters; some pair went unchecked"
assert _PROBE.reads <= len(_PROBE) + 4, \
    f"Got: you read {_PROBE.reads} of {len(_PROBE)} characters; every pair was compared twice"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def is_palindrome(stg: str) -> bool:
    """ Return True if stg reads the same backwards, character for character. """
    left = 0
    right = len(stg) - 1
    while left < right:
        if stg[left] != stg[right]:
            return False
        left = left + 1
        right = right - 1
    return True
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: takes the slice shortcut
def is_palindrome(stg: str) -> bool:
    return stg == stg[::-1]
```

```python # wrong: spaces the slice out to slip past the ban
def is_palindrome(stg: str) -> bool:
    return stg == stg[:: -1]
```

```python # wrong: calls reversed() instead of comparing the characters
def is_palindrome(stg: str) -> bool:
    return stg == "".join(reversed(stg))
```

```python # wrong: spaces reversed() out to slip past the ban
def is_palindrome(stg: str) -> bool:
    return stg == "".join(reversed (stg))
```

```python # wrong: reverses a list copy instead of comparing
def is_palindrome(stg: str) -> bool:
    chars = list(stg)
    chars.reverse()
    return list(stg) == chars
```

```python # wrong: rebuilds the string backwards, so no character is ever compared in place
def is_palindrome(stg: str) -> bool:
    backwards = ""
    for char in stg:
        backwards = char + backwards
    return stg == backwards
```

```python # wrong: rebuilds the string backwards by position, then compares in one go
def is_palindrome(stg: str) -> bool:
    pos = len(stg) - 1
    backwards = ""
    while pos >= 0:
        backwards = backwards + stg[pos]
        pos = pos - 1
    return stg == backwards
```

```python # wrong: compares every pair from both ends, so the whole string is walked
def is_palindrome(stg: str) -> bool:
    for pos in range(len(stg)):
        if stg[pos] != stg[len(stg) - 1 - pos]:
            return False
    return True
```

```python # wrong: answers on the first and last character alone
def is_palindrome(stg: str) -> bool:
    if stg == "":
        return True
    return stg[0] == stg[len(stg) - 1]
```

```python # wrong: stops one pair too early, so an even-length centre is never compared
def is_palindrome(stg: str) -> bool:
    left = 0
    right = len(stg) - 1
    while left < right - 1:
        if stg[left] != stg[right]:
            return False
        left = left + 1
        right = right - 1
    return True
```

```python # wrong: ignores the case, which the rules say counts
def is_palindrome(stg: str) -> bool:
    lowered = stg.lower()
    left = 0
    right = len(lowered) - 1
    while left < right:
        if lowered[left] != lowered[right]:
            return False
        left = left + 1
        right = right - 1
    return True
```

```python # wrong: drops the spaces, which the rules say count
def is_palindrome(stg: str) -> bool:
    packed = ""
    for char in stg:
        if char != " ":
            packed = packed + char
    left = 0
    right = len(packed) - 1
    while left < right:
        if packed[left] != packed[right]:
            return False
        left = left + 1
        right = right - 1
    return True
```

```python # wrong: strips the outer spaces, which the rules say count
def is_palindrome(stg: str) -> bool:
    clean = stg.strip()
    left = 0
    right = len(clean) - 1
    while left < right:
        if clean[left] != clean[right]:
            return False
        left = left + 1
        right = right - 1
    return True
```

### Give-aways the Description must never contain

```text # forbidden
\[::-1\]
\breversed\(
stg\[[a-z_]\w*\]
len\(stg\)\s*-\s*1
while\s+\w+\s*<\s*\w+
range\(len\(stg\)
for\s+\w+\s+in\s+stg\b
//\s*2
halfway
\bhalf\b
```

### Shortcuts the tests reject outright

```text # banned
[::-1]
reversed(
.reverse()
```
