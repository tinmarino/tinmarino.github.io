---
title: "Python C18 - Title-Case by Hand"
---

# Title-Case by Hand

## Instructions

Write a function `titlecase(stg: str) -> str` that returns `stg` with the first letter of every space-separated word upper-cased and every other character left exactly as it is; do it yourself, without `.title(`.

## Description

### Goal

Given a string, hand back the same string with the first letter of every
word capitalised, leaving every other character exactly as it was.

### Rules

- A word is a run of characters between spaces. Every word's first letter
  becomes upper case.
- Every character that is not the first letter of a word stays untouched,
  case included: `"tinmarINO"` keeps its shouting middle.
- Spaces themselves are copied as they are; do not collapse or count them.
- The empty string gives back the empty string.
- Build it yourself &mdash; do **not** use `.title(`: that method is this
  exercise already written by somebody else, and it also mis-handles
  apostrophes and digits in ways you would not notice from the examples
  alone.
- Return the string, do not print it.

### Examples

| Call | Returns |
|---|---|
| `titlecase("the quick fox")` | `"The Quick Fox"` |
| `titlecase("hello")` | `"Hello"` |
| `titlecase("")` | `""` |
| `titlecase("a b c")` | `"A B C"` |
| `titlecase("  wide   gap")` | `"  Wide   Gap"` |
| `titlecase("tinmarINO the great")` | `"TinmarINO The Great"` |

### Things you will need

A string knows how to split on spaces, and a list of pieces knows how to
join back into one string with a separator of your choice:

```python
pieces = "one two three".split(" ")
print(pieces)             # ['one', 'two', 'three']
print("-".join(pieces))   # 'one-two-three'
```

A single character knows how to upper-case itself, and slicing picks out
"everything after position 0":

```python
for word in ["dog", "sky"]:
    print(word[0].upper())    # 'D', then 'S'
    print(word[1:])           # 'og', then 'ky'
```

### Which word is the first one?

You are walking the string, and at every position you are either standing
right after a space (or at the very start) or you are not. Only in the first
case does the character in front of you get upper-cased. What single piece
of information do you need to carry from one character to the next in order
to answer that question?

## Starter code

```python # template
def titlecase(stg: str) -> str:
    """ Return stg with the first letter of every space-separated word upper-cased.

    >>> titlecase("the quick fox")
    'The Quick Fox'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(titlecase("the quick fox"))
```

## Tests

```python # tests
# Refuse the shortcuts that skip the lesson. This is the ONE canonical guard,
# used identically in every exercise that bans anything: strip docstrings and
# comments off the student's own source (injected by the app and the verifier as
# __student_code__) so a note to yourself is never mistaken for the real thing,
# then match each banned construct whitespace-insensitively and on a word
# boundary — so `max (lst)` is caught but a helper of yours named `digit_sum` is
# not. Copy it verbatim; the only per-exercise change is the tuple of banned
# substrings, which must match the `# banned` fence exactly.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in (".title(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert titlecase("") == "", f"Got: {titlecase('')!r}"
assert titlecase("hello") == "Hello", f"Got: {titlecase('hello')!r}"
assert titlecase("the quick fox") == "The Quick Fox", f"Got: {titlecase('the quick fox')!r}"
assert titlecase("a b c") == "A B C", f"Got: {titlecase('a b c')!r}"
# A single space is a word boundary with nothing to capitalise on either side
assert titlecase(" ") == " ", f"Got: {titlecase(' ')!r}"
# A leading space means the first word starts one character in
assert titlecase(" hello") == " Hello", f"Got: {titlecase(' hello')!r}"
# Runs of spaces are copied untouched, not collapsed
assert titlecase("  wide   gap") == "  Wide   Gap", f"Got: {titlecase('  wide   gap')!r}"
# Only the first letter of each word changes; the rest keeps its own case
assert titlecase("tinmarINO the great") == "TinmarINO The Great", \
    f"Got: {titlecase('tinmarINO the great')!r}"
# A word already starting upper case is left as it is
assert titlecase("Already Fine") == "Already Fine", f"Got: {titlecase('Already Fine')!r}"
# Digits and punctuation have no case, but must survive untouched
assert titlecase("42 cats") == "42 Cats", f"Got: {titlecase('42 cats')!r}"
assert isinstance(titlecase("cat"), str), f"Got: {type(titlecase('cat'))}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def titlecase(stg: str) -> str:
    """ Return stg with the first letter of every space-separated word upper-cased. """
    result = []
    at_word_start = True
    for char in stg:
        if char == " ":
            result.append(char)
            at_word_start = True
        elif at_word_start:
            result.append(char.upper())
            at_word_start = False
        else:
            result.append(char)
    return "".join(result)
```

### Wrong answers the tests must catch

```python # wrong: upper-cases every letter, not just the first of each word
def titlecase(stg: str) -> str:
    result = []
    for char in stg:
        result.append(char.upper())
    return "".join(result)
```

```python # wrong: lower-cases the rest of each word instead of leaving it alone
def titlecase(stg: str) -> str:
    result = []
    at_word_start = True
    for char in stg:
        if char == " ":
            result.append(char)
            at_word_start = True
        elif at_word_start:
            result.append(char.upper())
            at_word_start = False
        else:
            result.append(char.lower())
    return "".join(result)
```

```python # wrong: splits with no separator, which collapses runs of spaces
def titlecase(stg: str) -> str:
    words = stg.split()
    capped = []
    for word in words:
        capped.append(word[0].upper() + word[1:])
    return " ".join(capped)
```

```python # wrong: only ever capitalises the very first character of the string
def titlecase(stg: str) -> str:
    if stg == "":
        return stg
    return stg[0].upper() + stg[1:]
```

```python # wrong: hands the whole job to str.title
def titlecase(stg: str) -> str:
    return stg.title()
```

### Give-aways the Description must never contain

```text # forbidden
at_word_start
char\s*==\s*"\s*"
char\.upper\(\)
stg\[0\]\.upper
\.title\(
```

### Shortcuts the tests reject outright

```text # banned
.title(
```
