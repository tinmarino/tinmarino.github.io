---
title: "Python C4 - Group by First Letter"
---

# Group by First Letter

## Instructions

Write a function `group_words(words: list) -> dict` that returns each starting letter mapped to the list of the words beginning with it, in the order they appeared.

Do the filing yourself. `collections.defaultdict`, `dict.setdefault()`, `itertools.groupby` and `dict.get(key, [])` keep the books for you, so **Check** turns all four down.

## Description

### Goal

The index at the back of a book is exactly this shape: every entry filed under its
first letter, and the entries under one letter still in the order the indexer put
them there.

You are handed a flat list of words. Give back a dict with one key per starting letter
that actually occurs, and under each key the words that start with it.

### Rules

- Return a new dict. The list you were given must come out **unchanged**.
- A letter that no word starts with gets no key at all.
- Inside one group the words keep the order they had in the input.
- Every word lands in exactly one group, duplicates included.
- Every word you are given is lowercase and at least one character long.
- `return` the dict, do not `print` it.
- Key order does not matter. Two dicts holding the same pairs are `==` whatever
  order they were built in, so the tests will not quibble about it.
- Build the dict yourself. Do **not** use `collections.defaultdict`, `dict.setdefault()`,
  `itertools.groupby` or `dict.get(key, [])` &mdash; each of those hides the one piece of
  bookkeeping that *is* the exercise.

### Examples

| Call | Returns |
|---|---|
| `group_words(["ant", "ape", "bee"])` | `{"a": ["ant", "ape"], "b": ["bee"]}` |
| `group_words(["bee", "ant", "bat"])` | `{"b": ["bee", "bat"], "a": ["ant"]}` |
| `group_words(["kiwi"])` | `{"k": ["kiwi"]}` |
| `group_words([])` | `{}` |

Look at the second row. `"bee"` and `"bat"` are not neighbours in the input, and they
still end up side by side in the result.

### Things you will need

A dict you fill one key at a time. Writing to a key that is not there creates it, and
`in` asks whether a key exists yet:

```python
prices = {}
prices["coffee"] = 2
print(prices["coffee"])      # 2
print("tea" in prices)       # False
```

What a lookup hands back is not a copy, and not a description of the value. It is the
value itself, with everything that value can do:

```python
box = {"label": "fragile"}
print(box["label"].upper())  # FRAGILE
```

The first character of a string sits at position `0`:

```python
print("tuesday"[0])          # t
```

### An empty dict is really empty

It has no keys. None. Reading a key that is not there does not hand you `None`, or a
zero, or an empty anything &mdash; it stops the program:

```python
inventory = {}
print(inventory["bolts"])    # KeyError: 'bolts'
```

So whatever you decide to keep under a letter, something has to put it there first.

### What lives under a key

A dict value is just a value. When you counted letters in exercise `C1` you kept a
number under each key because a count is a number. Ask yourself what you want to find
under `"b"` when this function is done, and the type of the value follows from the
answer.

### The question

Walk the input once and think about a single word arriving. Sometimes its letter is
already a key of your dict, and sometimes that word is the first of its group ever
seen. Those two words cannot be treated the same way &mdash; what is different about
them, and how does your loop tell them apart?

### When Check is green, look inside

Press **Run** once so the Console knows your `group_words`, open the
**Console (iPython)** tab, and type these four lines one at a time. The Console, not
the editor: the last two are not part of your answer.

```
filed = group_words(["basil", "cumin", "bay"])
print(type(filed))
print(type(filed["b"]))
filed["b"].append("borage")
```

Then look at `filed` one last time. Line three says what is really sitting under
`"b"`, and line four does something to it &mdash; something your function stopped
doing minutes ago.

You imported nothing to make that work, and no line you wrote knows that the values
are lists rather than numbers or strings. So: what else could you have parked under a
key, and what would you have been allowed to do to it once it was there?

## Starter code

```python # template
def group_words(words: list) -> dict:
    """ Return each starting letter mapped to the list of words beginning with it.

    >>> group_words(["ant", "ape", "bee"])
    {'a': ['ant', 'ape'], 'b': ['bee']}
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(group_words(["bread", "butter", "coffee", "beans"]))
```

## Tests

```python # tests
# The bookkeeping is the exercise, so Check refuses every tool that does it for you.
for _banned in ("defaultdict", "setdefault", "groupby", ".get"):
    assert _banned not in __student_code__, f"Got: the banned shortcut {_banned}"

assert group_words([]) == {}, f"Got: {group_words([])}"
assert group_words(["kiwi"]) == {"k": ["kiwi"]}, f"Got: {group_words(['kiwi'])}"
# Three words under one letter, a single word under another
_shopping = ["bread", "butter", "coffee", "beans"]
_filed = group_words(_shopping)
assert _filed == {"b": ["bread", "butter", "beans"], "c": ["coffee"]}, f"Got: {_filed}"
# A group whose words are not neighbours still keeps the order of the input
_spices = ["basil", "cumin", "bay", "clove", "borage"]
_grouped = group_words(_spices)
assert _grouped == {"b": ["basil", "bay", "borage"], "c": ["cumin", "clove"]}, \
    f"Got: {_grouped}"
# A one-letter word is a word like any other
assert group_words(["a", "an", "and"]) == {"a": ["a", "an", "and"]}, \
    f"Got: {group_words(['a', 'an', 'and'])}"
# Both copies of a duplicate are filed
assert group_words(["fig", "fig", "date"]) == {"f": ["fig", "fig"], "d": ["date"]}, \
    f"Got: {group_words(['fig', 'fig', 'date'])}"
# Three starting letters, and only the letters that occur get a key
_animals = ["owl", "otter", "yak", "oyster", "newt"]
_zoo = group_words(_animals)
assert sorted(_zoo) == ["n", "o", "y"], f"Got: {_zoo}"
assert _zoo == {"o": ["owl", "otter", "oyster"], "y": ["yak"], "n": ["newt"]}, f"Got: {_zoo}"
# The list you were given must come out unchanged
_original = ["pear", "plum", "quince"]
group_words(_original)
assert _original == ["pear", "plum", "quince"], f"Got: the input became {_original}"
# The dict is returned, not printed
assert isinstance(group_words(["kiwi"]), dict), f"Got: {type(group_words(['kiwi']))}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def group_words(words: list) -> dict:
    """ Return each starting letter mapped to the words beginning with it. """
    groups = {}
    for word in words:
        letter = word[0]
        if letter not in groups:
            groups[letter] = []
        groups[letter].append(word)
    return groups
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: keeps only the last word seen for each letter
def group_words(words: list) -> dict:
    groups = {}
    for word in words:
        groups[word[0]] = [word]
    return groups
```

```python # wrong: stores the word itself instead of a list of words
def group_words(words: list) -> dict:
    groups = {}
    for word in words:
        if word[0] not in groups:
            groups[word[0]] = word
    return groups
```

```python # wrong: off by one, the first word of each group is filed twice
def group_words(words: list) -> dict:
    groups = {}
    for word in words:
        if word[0] not in groups:
            groups[word[0]] = [word]
        groups[word[0]].append(word)
    return groups
```

```python # wrong: files each word under the whole word, not its first letter
def group_words(words: list) -> dict:
    groups = {}
    for word in words:
        if word not in groups:
            groups[word] = []
        groups[word].append(word)
    return groups
```

```python # wrong: newest word first inside each group
def group_words(words: list) -> dict:
    groups = {}
    for word in words:
        if word[0] not in groups:
            groups[word[0]] = []
        groups[word[0]].insert(0, word)
    return groups
```

```python # wrong: files the words by emptying the list it was given
def group_words(words: list) -> dict:
    groups = {}
    while words:
        word = words.pop(0)
        if word[0] not in groups:
            groups[word[0]] = []
        groups[word[0]].append(word)
    return groups
```

```python # wrong: reaches for collections.defaultdict
from collections import defaultdict


def group_words(words: list) -> dict:
    groups = defaultdict(list)
    for word in words:
        groups[word[0]].append(word)
    return dict(groups)
```

```python # wrong: lets dict.setdefault do the first-sight check
def group_words(words: list) -> dict:
    groups = {}
    for word in words:
        groups.setdefault (word[0], []).append(word)
    return groups
```

```python # wrong: lets dict.get supply the missing list
def group_words(words: list) -> dict:
    groups = {}
    for word in words:
        groups[word[0]] = groups.get(word[0], []) + [word]
    return groups
```

```python # wrong: appends into the throwaway list dict.get hands back
def group_words(words: list) -> dict:
    groups = {}
    for word in words:
        groups.get(word[0], []).append(word)
    return groups
```

```python # wrong: itertools.groupby, which only groups neighbours
from itertools import groupby


def group_words(words: list) -> dict:
    groups = {}
    for letter, found in groupby(words, key=lambda word: word[0]):
        groups[letter] = list(found)
    return groups
```

### Give-aways the Description must never contain

```text # forbidden
groups\s*=\s*\{\}
groups\[
\[letter\]
word\[0\]
for\s+\w+\s+in\s+words\b
if\s+\w+\s+not\s+in\s+\w+
\]\s*=\s*\[\]
\.append\(word
```

### Shortcuts the tests reject outright

```text # banned
defaultdict
setdefault
groupby
.get
```
