---
title: "Python G55 - Glue the Words with Spaces"
---

# Glue the Words with Spaces

## Instructions

Write a function `join_words(lst: list, sep: str) -> str` that returns the words glued into one string with `sep` between them.

Build the string yourself. Do **not** use `.join(`.

## Description

### Goal

Turn a list of words back into a sentence. `["hola", "mundo"]` with `" "` between
them becomes `"hola mundo"`.

The separator goes **between** the words, so two words need one separator, three
words need two, and one word needs none at all.

### Rules

- Return the string, do not print it.
- An empty list gives the empty string `""`.
- A single word comes back on its own, with no separator stuck to it.
- `sep` is whatever the caller passes: a space, a dash, `", "`, or even `""`.
- Build it yourself. Do **not** use `.join(`.

### Examples

| Call | Returns |
|---|---|
| `join_words(["hola", "mundo"], " ")` | `"hola mundo"` |
| `join_words(["hola"], " ")` | `"hola"` |
| `join_words(["a", "b", "c"], "-")` | `"a-b-c"` |
| `join_words(["uno", "dos"], ", ")` | `"uno, dos"` |
| `join_words(["hola", "mundo"], "")` | `"holamundo"` |
| `join_words([], " ")` | `""` |

### Things you will need

You already grow a string one piece at a time, the same way you grew a list:

```python
def spell(word: str) -> str:
    """ Return the letters of word laid end to end. """
    out = ""
    for letter in word:
        out = out + letter
    return out


print(spell("abc"))
```

That glues three letters into `"abc"` with nothing in between.

### One separator too many

Now put a `-` in there and count. Three letters, but only **two** dashes:
`"a-b-c"`. If you add a dash every single turn you will finish with `"a-b-c-"`,
and the test for a one-word list will tell you so immediately.

So the question is not *when do I add the word?* &mdash; you always add the word. It
is: **which turn of the loop is the one that must not add a separator?** There are
two honest answers, the first turn or the last, and only one of them is easy to
recognise while you are standing in the middle of the loop.

## Starter code

```python # template
def join_words(lst: list, sep: str) -> str:
    """ Return the words of lst glued with sep between them, e.g. "hola mundo".

    >>> join_words(["hola", "mundo"], " ")
    'hola mundo'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(join_words(["hola", "mundo", "cruel"], " "))
```

## Tests

```python # tests
# The point of this one is the loop you write, so Check refuses the shortcut.
# __student_code__ is the student's own source, injected by the app and the
# verifier. Strip docstrings and comments so a note to yourself is never mistaken
# for the real thing, then match each construct whitespace-insensitively (and on a
# word boundary) so a stray space cannot slip a banned call past the ban.
import re as _re
_lines = [_line.split("#")[0]
          for _chunk in __student_code__.split('"""')[::2]
          for _line in _chunk.split("\n")]
_bans = [((r"\b" if _b[:1].isalpha() else "") + r"\s*".join(_re.escape(_c) for _c in _b), _b)
         for _b in (".join(",)]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

assert join_words([], " ") == "", f"Got: {join_words([], ' ')}"
# One word: no separator may be stuck to either end
assert join_words(["hola"], " ") == "hola", f"Got: {join_words(['hola'], ' ')}"
assert join_words(["hola", "mundo"], " ") == "hola mundo", \
    f"Got: {join_words(['hola', 'mundo'], ' ')}"
# A separator that is not a space, so hard-coding " " is caught
assert join_words(["a", "b", "c"], "-") == "a-b-c", \
    f"Got: {join_words(['a', 'b', 'c'], '-')}"
# A separator of two characters, so counting characters instead of using sep fails
assert join_words(["uno", "dos"], ", ") == "uno, dos", \
    f"Got: {join_words(['uno', 'dos'], ', ')}"
# An empty separator still glues the words together
assert join_words(["hola", "mundo"], "") == "holamundo", \
    f"Got: {join_words(['hola', 'mundo'], '')}"
# One word and a long separator: a trailing separator would be very visible
assert join_words(["solo"], "---") == "solo", f"Got: {join_words(['solo'], '---')}"
# Four words need exactly three separators
assert join_words(["a", "b", "c", "d"], "*") == "a*b*c*d", \
    f"Got: {join_words(['a', 'b', 'c', 'd'], '*')}"
# An empty word is still a word, so the separators around it survive
assert join_words(["a", "", "b"], "-") == "a--b", \
    f"Got: {join_words(['a', '', 'b'], '-')}"
# The FIRST word is empty: "have I written anything yet" is not the same question
# as "is my result still empty", and this is where the two answers part company
assert join_words(["", "b"], "-") == "-b", f"Got: {join_words(['', 'b'], '-')}"
assert join_words(["", ""], "-") == "-", f"Got: {join_words(['', ''], '-')}"
# The caller's list must come back untouched
_original = ["hola", "mundo"]
join_words(_original, " ")
assert _original == ["hola", "mundo"], f"Got: the input was modified into {_original}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def join_words(lst: list, sep: str) -> str:
    """ Return the words of lst glued with sep between them, e.g. "hola mundo". """
    out = ""
    first = True
    for word in lst:
        if first:
            out = word
            first = False
        else:
            out = out + sep + word
    return out
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: hands the gluing to str.join()
def join_words(lst: list, sep: str) -> str:
    return sep.join(lst)
```

```python # wrong: adds a separator every turn, so the result ends with one
def join_words(lst: list, sep: str) -> str:
    out = ""
    for word in lst:
        out = out + word + sep
    return out
```

```python # wrong: adds the separator first, so the result starts with one
def join_words(lst: list, sep: str) -> str:
    out = ""
    for word in lst:
        out = out + sep + word
    return out
```

```python # wrong: hard-codes a space and ignores sep
def join_words(lst: list, sep: str) -> str:
    out = ""
    for word in lst:
        if out:
            out = out + " "
        out = out + word
    return out
```

```python # wrong: returns only the first word
def join_words(lst: list, sep: str) -> str:
    if not lst:
        return ""
    return lst[0]
```

### Give-aways the Description must never contain

```text # forbidden
\.join\(
for\s+\w+\s+in\s+lst
\+\s*sep\s*\+
out\s*==\s*""
```

### Shortcuts the tests reject outright

```text # banned
.join(
```
