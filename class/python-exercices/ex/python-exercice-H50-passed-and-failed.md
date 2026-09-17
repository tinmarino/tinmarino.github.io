---
title: "Python H50 - Passed and Failed"
---

# Passed and Failed

## Instructions

Write a function `split_scores(names: list, scores: list) -> list` that returns `[[passed], [failed]]`, the names of everyone who scored 50 or more and the names of everyone else.

The two lists always have the same length. Return the names, not the scores.

## Description

### Goal

The class list arrives as two lists that line up: `names[0]` scored `scores[0]`,
`names[1]` scored `scores[1]`, and so on. You hand back two groups of **names**,
the ones who passed first.

`(["ana", "luz"], [80, 30])` gives `[["ana"], ["luz"]]`.

### Rules

- Passing is a score of 50 **or more**. Exactly 50 passes.
- The answer is a list holding two lists: the passed names, then the failed ones.
- Put the **names** in, never the scores.
- Keep each group in the order the class list had them.
- Two empty class lists give `[[], []]`, not `[]`.
- The two lists always have the same length.

### Examples

| Call | Returns |
|---|---|
| `split_scores(["ana", "luz"], [80, 30])` | `[["ana"], ["luz"]]` |
| `split_scores(["ana"], [50])` | `[["ana"], []]` |
| `split_scores(["ana"], [49])` | `[[], ["ana"]]` |
| `split_scores(["a", "b", "c"], [90, 10, 60])` | `[["a", "c"], ["b"]]` |
| `split_scores([], [])` | `[[], []]` |

The second and third rows are the whole point: 50 passes, 49 does not.

### Things you will need

`zip` walks two lists side by side, handing you one value from each per turn:

```python
for city, height in zip(["Lima", "Quito"], [154, 2850]):
    print(city, height)
```

You can fill **two** lists in a single loop, sending each item to whichever one
it belongs in:

```python
short_ones = []
long_ones = []
for word in ["sol", "ballena", "mar"]:
    if len(word) < 4:
        short_ones.append(word)
    else:
        long_ones.append(word)
print([short_ones, long_ones])
```

### Which order do you need?

Each turn of the loop hands you a name and a score. The score decides, but it is
the name that travels. Which of the two lists does it join, and how do you hand
both back at the end?

## Starter code

```python # template
def split_scores(names: list, scores: list) -> list:
    """ Return [[passed names], [failed names]], passing at 50 or more.

    >>> split_scores(["ana", "luz"], [80, 30])
    [['ana'], ['luz']]
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(split_scores(["ana", "luz"], [80, 30]))
```

## Tests

```python # tests
assert split_scores(["ana", "luz"], [80, 30]) == [["ana"], ["luz"]], \
    f"Got: {split_scores(['ana', 'luz'], [80, 30])}"
# Exactly 50 PASSES: this is what separates "50 or more" from "more than 50"
assert split_scores(["ana"], [50]) == [["ana"], []], f"Got: {split_scores(['ana'], [50])}"
# And 49 does not
assert split_scores(["ana"], [49]) == [[], ["ana"]], f"Got: {split_scores(['ana'], [49])}"
assert split_scores(["ana"], [51]) == [["ana"], []], f"Got: {split_scores(['ana'], [51])}"
# Passed group first, failed group second, and the order inside each is kept
assert split_scores(["a", "b", "c"], [90, 10, 60]) == [["a", "c"], ["b"]], \
    f"Got: {split_scores(['a', 'b', 'c'], [90, 10, 60])}"
# The two groups are different sizes, so swapping them is caught
assert split_scores(["a", "b", "c"], [10, 20, 90]) == [["c"], ["a", "b"]], \
    f"Got: {split_scores(['a', 'b', 'c'], [10, 20, 90])}"
# Everybody passes
assert split_scores(["a", "b"], [60, 70]) == [["a", "b"], []], \
    f"Got: {split_scores(['a', 'b'], [60, 70])}"
# Nobody passes
assert split_scores(["a", "b"], [1, 2]) == [[], ["a", "b"]], \
    f"Got: {split_scores(['a', 'b'], [1, 2])}"
assert split_scores([], []) == [[], []], f"Got: {split_scores([], [])}"
# Zero is a real score, not a missing one
assert split_scores(["a"], [0]) == [[], ["a"]], f"Got: {split_scores(['a'], [0])}"
assert split_scores(["a"], [100]) == [["a"], []], f"Got: {split_scores(['a'], [100])}"
# Neither input may be modified
_names, _scores = ["ana", "luz"], [80, 30]
split_scores(_names, _scores)
assert _names == ["ana", "luz"], f"Got: the names were modified into {_names}"
assert _scores == [80, 30], f"Got: the scores were modified into {_scores}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def split_scores(names: list, scores: list) -> list:
    """ Return [[passed names], [failed names]], passing at 50 or more. """
    passed = []
    failed = []
    for name, score in zip(names, scores):
        if score >= 50:
            passed.append(name)
        else:
            failed.append(name)
    return [passed, failed]
```

### Wrong answers the tests must catch

```python # wrong: demands more than 50, so exactly 50 is failed
def split_scores(names: list, scores: list) -> list:
    """ Off by one at the pass mark. """
    passed = []
    failed = []
    for name, score in zip(names, scores):
        if score > 50:
            passed.append(name)
        else:
            failed.append(name)
    return [passed, failed]
```

```python # wrong: hands back the failed group first
def split_scores(names: list, scores: list) -> list:
    """ Right groups, wrong order. """
    passed = []
    failed = []
    for name, score in zip(names, scores):
        if score >= 50:
            passed.append(name)
        else:
            failed.append(name)
    return [failed, passed]
```

```python # wrong: collects the scores instead of the names
def split_scores(names: list, scores: list) -> list:
    """ Sends the wrong half of the pair into the answer. """
    passed = []
    failed = []
    for name, score in zip(names, scores):
        if score >= 50:
            passed.append(score)
        else:
            failed.append(score)
    return [passed, failed]
```

```python # wrong: only reports the ones who passed
def split_scores(names: list, scores: list) -> list:
    """ Forgets that the answer holds two groups. """
    passed = []
    for name, score in zip(names, scores):
        if score >= 50:
            passed.append(name)
    return passed
```

### Give-aways the Description must never contain

```text # forbidden
zip\(names
>=\s*50
\[passed,\s*failed\]
```

### Shortcuts the tests reject outright

```text # banned
```
