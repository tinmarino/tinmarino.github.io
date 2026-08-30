---
title: "Python C2 - Most Frequent Word"
---

# Most Frequent Word

## Instructions

Write a function `most_frequent(words: list) -> str` that returns the word appearing most often in `words`. If several words tie, return the one that appears **earliest** in the list; an empty list gives `""`.

Count the words yourself. `Counter`, `max(`, `sorted(` and `.count(` *are* the answer rather than the exercise, so **Check** turns them down.

## Description

### Which one, not how many

Twenty people vote for lunch, a log file holds a million requests, a speech leans on one
word more than the speaker meant to: the question is the same every time, and it is not
*how many* but *which one*.

### Goal

Given a list of words, hand back the single word that appears most often in it. Return
that word &mdash; not the number of times it appeared, and not a printed line.

### Rules

- Return the **word**, not the number of times it appeared.
- Return it &mdash; do not print it.
- On a tie, the winner is whichever of the tied words appears earliest in the list.
- `most_frequent([])` returns the empty string `""`.
- `"Pizza"` and `"pizza"` are two different words. Do not change anybody's case.
- The list you were given must come out **unchanged**.
- Count them yourself. Do **not** use `Counter` from `collections`, and do **not** use
  `max(`, `sorted(` or `.count(`. Those *are* the answer, and doing the counting is the
  exercise.

### Examples

| Call | Returns |
|---|---|
| `most_frequent(["pizza", "sushi", "pizza"])` | `"pizza"` |
| `most_frequent(["sushi", "pizza", "pizza"])` | `"pizza"` |
| `most_frequent(["sushi", "sushi", "pizza", "pizza", "pizza"])` | `"pizza"` |
| `most_frequent(["pizza", "sushi", "sushi", "pizza"])` | `"pizza"` |
| `most_frequent(["oak", "pine", "pine", "birch", "birch"])` | `"pine"` |
| `most_frequent(["oak", "pine", "birch"])` | `"oak"` |
| `most_frequent(["tacos"])` | `"tacos"` |
| `most_frequent([])` | `""` |

Row three is the one to read slowly. `sushi` is out in front for the whole first half of
the list and still loses: appearing early settles a tie, it does not win one.

Rows four and five are that tie rule doing its work. In row four both words appear twice,
`sushi` completed its pair first, and `pizza` wins because `pizza` showed up first. Row
five is the same rule where the first word of the list is not even in the running: `oak`
appears once, `pine` and `birch` twice each, and `pine` takes it.

### Two questions, not one

The previous exercise asked *how many times does each one appear*, and every character you
read answered part of it on the spot. This one asks *which one appears most*, and no single
word can answer that: a count only means something held up against the other counts, and
that comparison cannot start until the last one is in.

So the reading has to finish before the answer can be picked, which means something has to
survive the reading and still be there afterwards. Deciding what that something is, is most
of the work.

### Things you will need

A dict gives back its pairs one at a time, key and value together:

```python
ages = {"ana": 31, "bo": 24}
for name, age in ages.items():
    print(name, age)         # ana 31, then bo 24
```

Two names after `for`, because each pair hands you two things at once. If that shape is
new and you would rather not meet it today, walking a dict plainly gives you the keys on
their own, and a key is enough to fetch its value:

```python
prices = {"pear": 1, "apple": 2}
for fruit in prices:
    print(fruit)             # pear, then apple
print(prices["apple"])       # 2
```

Both routes visit the same keys in the same order. That order is not random and it is
not sorted. A dict hands its keys back in the order they were **first put in**:

```python
stock = {}
stock["pear"] = 1
stock["apple"] = 2
print(list(stock))           # ['pear', 'apple']
```

So when you walk a dict, whose key do you meet first? Hold that against the tie rule.

### The starting value, again

Exercise `B2` asked you for the largest number in a list, and the whole exercise turned out
to be the value you start from. The same question is waiting here: before you have looked
at anything at all, what is the best word so far, and how often has it appeared? The
empty list is what will tell you whether you chose well.

### What has to change?

Exercise `C1` counted the characters of a string. This one counts the words of a list.

Open your answer to `C1` beside this one. Before you type anything, count how many lines
of its **counting** you have to touch, and write that number down. Then do it, and see
whether you were right. The picking is yours to add on top &mdash; that half is new.

## Starter code

```python # template
def most_frequent(words: list) -> str:
    """ Return the word appearing most often in words, the earliest one on a tie, "" if empty.

    >>> most_frequent(["pizza", "sushi", "pizza"])
    'pizza'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(most_frequent(["pizza", "sushi", "pizza", "tacos", "pizza"]))
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
         for _b in ("Counter", "sorted(", ".count(", "max(")]
for _pat, _banned in _bans:
    assert not _re.search(_pat, "\n".join(_lines)), f"Got: the banned shortcut {_banned}"

# Asked first, on purpose: a function that eats the list it was handed would make
# every later message below a lie, because they call it a second time.
_original = ["oak", "pine", "oak"]
most_frequent(_original)
assert _original == ["oak", "pine", "oak"], f"Got: the input was modified into {_original}"

_votes = ["pizza", "sushi", "pizza"]
assert most_frequent(_votes) == "pizza", f"Got: {most_frequent(_votes)}"
# The winner is not always the first word read
_votes = ["sushi", "pizza", "pizza"]
assert most_frequent(_votes) == "pizza", f"Got: {most_frequent(_votes)}"
# ... nor the last one
_votes = ["tacos", "tacos", "tacos", "sushi"]
assert most_frequent(_votes) == "tacos", f"Got: {most_frequent(_votes)}"
# The winner never appears twice in a row: neighbours are not what is counted
_votes = ["oak", "pine", "pine", "oak", "oak"]
assert most_frequent(_votes) == "oak", f"Got: {most_frequent(_votes)}"
# The runner-up repeats first: being early only breaks ties, it does not win one
_votes = ["sushi", "sushi", "pizza", "pizza", "pizza"]
assert most_frequent(_votes) == "pizza", f"Got: {most_frequent(_votes)}"
# Two words reach two before the winner reaches three
_votes = ["oak", "pine", "oak", "pine", "birch", "birch", "birch"]
assert most_frequent(_votes) == "birch", f"Got: {most_frequent(_votes)}"
# The tie rule: sushi reaches two first, pizza appeared first, pizza wins
_votes = ["pizza", "sushi", "sushi", "pizza"]
assert most_frequent(_votes) == "pizza", f"Got: {most_frequent(_votes)}"
# The tie is between two words, and neither of them is the first word of the list
_votes = ["oak", "pine", "pine", "birch", "birch"]
assert most_frequent(_votes) == "pine", f"Got: {most_frequent(_votes)}"
# Everything appears once, so everything ties and the earliest one wins
_votes = ["oak", "pine", "birch"]
assert most_frequent(_votes) == "oak", f"Got: {most_frequent(_votes)}"
# Case is part of the word: Pizza and pizza are counted apart
_votes = ["Pizza", "Pizza", "pizza"]
assert most_frequent(_votes) == "Pizza", f"Got: {most_frequent(_votes)}"
_speech = ["the", "cat", "sat", "on", "the", "mat", "the", "end"]
assert most_frequent(_speech) == "the", f"Got: {most_frequent(_speech)}"
# Built by the tests, so a memorised table of answers cannot masquerade as one
_stream = ["red", "green", "blue"] * 9 + ["green"] * 4
assert most_frequent(_stream) == "green", f"Got: {most_frequent(_stream)}"
assert most_frequent(["tacos"]) == "tacos", f"Got: {most_frequent(['tacos'])}"
assert most_frequent([]) == "", f"Got: {most_frequent([])}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def most_frequent(words: list) -> str:
    """ Return the word appearing most often in words, earliest one on a tie. """
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    best_word = ""
    best_count = 0
    for word, count in counts.items():
        if count > best_count:
            best_word = word
            best_count = count
    return best_word
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: hands back the first word of the list
def most_frequent(words: list) -> str:
    if not words:
        return ""
    return words[0]
```

```python # wrong: returns the first word that repeats, not the one that repeats most
def most_frequent(words: list) -> str:
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    for word, count in counts.items():
        if count > 1:
            return word
    return words[0] if words else ""
```

```python # wrong: imports Counter instead of counting
from collections import Counter


def most_frequent(words: list) -> str:
    if not words:
        return ""
    return Counter(words).most_common(1)[0][0]
```

```python # wrong: counts by hand, then calls max() to pick the winner
def most_frequent(words: list) -> str:
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    if not counts:
        return ""
    return max(counts, key=counts.get)
```

```python # wrong: sorts the pairs instead of scanning them
def most_frequent(words: list) -> str:
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    if not counts:
        return ""
    return sorted(counts.items(), key=lambda pair: -pair[1])[0][0]
```

```python # wrong: spaces sorted() out to slip past the ban
def most_frequent(words: list) -> str:
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    if not counts:
        return ""
    return sorted (counts.items(), key=lambda pair: -pair[1])[0][0]
```

```python # wrong: lets list.count do the counting, so no dict is ever built
def most_frequent(words: list) -> str:
    best_word = ""
    best_count = 0
    for word in words:
        if words.count(word) > best_count:
            best_word = word
            best_count = words.count(word)
    return best_word
```

```python # wrong: returns how many times, not which word
def most_frequent(words: list) -> str:
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    best_count = 0
    for count in counts.values():
        if count > best_count:
            best_count = count
    return best_count
```

```python # wrong: >= instead of >, so a tie goes to the last word
def most_frequent(words: list) -> str:
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    best_word = ""
    best_count = 0
    for word, count in counts.items():
        if count >= best_count:
            best_word = word
            best_count = count
    return best_word
```

```python # wrong: reads the tie rule as "the first word of the list wins"
def most_frequent(words: list) -> str:
    if not words:
        return ""
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    best_word = ""
    best_count = 0
    tied = False
    for word, count in counts.items():
        if count > best_count:
            best_word = word
            best_count = count
            tied = False
        elif count == best_count:
            tied = True
    if tied:
        return words[0]
    return best_word
```

```python # wrong: measures the longest run of neighbours
def most_frequent(words: list) -> str:
    best_word = ""
    best_count = 0
    run = 0
    previous = ""
    for word in words:
        run = run + 1 if word == previous else 1
        if run > best_count:
            best_count = run
            best_word = word
        previous = word
    return best_word
```

```python # wrong: empties the caller's list while counting it
def most_frequent(words: list) -> str:
    counts = {}
    while words:
        word = words[0]
        del words[0]
        counts[word] = counts.get(word, 0) + 1
    best_word = ""
    best_count = 0
    for word, count in counts.items():
        if count > best_count:
            best_word = word
            best_count = count
    return best_word
```

```python # wrong: hard-codes the answers for the lists above
def most_frequent(words: list) -> str:
    table = {
        ("oak", "pine", "oak"): "oak",
        ("pizza", "sushi", "pizza"): "pizza",
        ("sushi", "pizza", "pizza"): "pizza",
        ("tacos", "tacos", "tacos", "sushi"): "tacos",
        ("oak", "pine", "pine", "oak", "oak"): "oak",
        ("sushi", "sushi", "pizza", "pizza", "pizza"): "pizza",
        ("oak", "pine", "oak", "pine", "birch", "birch", "birch"): "birch",
        ("pizza", "sushi", "sushi", "pizza"): "pizza",
        ("oak", "pine", "pine", "birch", "birch"): "pine",
        ("oak", "pine", "birch"): "oak",
        ("Pizza", "Pizza", "pizza"): "Pizza",
        ("the", "cat", "sat", "on", "the", "mat", "the", "end"): "the",
        ("tacos",): "tacos",
    }
    return table.get(tuple(words), "")
```

### Give-aways the Description must never contain

```text # forbidden
counts\[\s*\w+\s*\]\s*=
\.get\(\s*word
\.get\(\w+,\s*0\)
for\s+word\s+in\s+words
counts\.items\(\)
best_word
best_count
most_common\(
```

### Shortcuts the tests reject outright

```text # banned
Counter
max(
sorted(
.count(
```
