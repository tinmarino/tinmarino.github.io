---
title: "Python D70 - Are the Tags Nested Right?"
---

# Are the Tags Nested Right?

## Instructions

Write a function `tags_balanced(tags: list) -> bool` that returns `True` when a list of tag names is correctly nested, closers written as the name with a leading `/`.

Return the answer, do not print it.

## Description

### Goal

A page is really a list of tags in the order they were opened or closed: `"div"` opens one, `"/div"` closes it. Given that list, return `True` when every tag is closed by a tag of its own name, in the right order, and `False` otherwise.

### Rules

- A plain name, with no leading `/`, opens a tag.
- A name starting with `/` closes the last tag that is still open, and it must match that tag's name. `"/div"` can only close a `"div"`.
- A closer that arrives when nothing is open makes the whole list unbalanced.
- A tag still open once the list ends also makes it unbalanced.
- Return `True` or `False`. Do not print anything.

### Examples

| Call | Returns |
|---|---|
| `tags_balanced(["div", "span", "/span", "/div"])` | `True` |
| `tags_balanced(["div", "span", "/div", "/span"])` | `False` |
| `tags_balanced(["/div"])` | `False` |
| `tags_balanced(["div"])` | `False` |
| `tags_balanced([])` | `True` |
| `tags_balanced(["p"])` | `False` |

### What exercise `D50` already solved

`D50` matched `(`, `[` and `{` against `)`, `]` and `}` in a string. The kinds of bracket were fixed in advance &mdash; three of them, known before you wrote a single line.

```python
closer = {"(": ")", "[": "]", "{": "}"}
print(closer["("])
```

### What changes here, and what does not

Here the "brackets" are not three fixed characters, they are however many
tag names show up in the list &mdash; `"div"`, `"span"`, `"ul"`, anything. But an
opener and its closer are still related the same way every time: the closer
is the opener's name with `/` stuck on the front.

```python
for word in ["div", "span", "ul"]:
    print("/" + word)
```

So nothing has to be looked up in a fixed table of pairs any more. Given an
opener you already hold, you can compute what its closer must look like.

### Which one does a closer belong to?

Walk `["div", "span", "/span", "/div"]` from the left and stop at `"/span"`.
Which opener does it have to match, and what do you need to have kept while
walking to be able to say so?

## Starter code

```python # template
def tags_balanced(tags: list) -> bool:
    """ Return True when every tag in tags is closed by its own name, in order.

    >>> tags_balanced(["div", "span", "/span", "/div"])
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(tags_balanced(["ul", "li", "/li", "li", "/li", "/ul"]))
```

## Tests

```python # tests
# The answer is a bool, not a value that happens to be truthy
assert isinstance(tags_balanced([]), bool), f"Got: {type(tags_balanced([]))}"
# Nothing to close, then the smallest pairs
assert tags_balanced([]) is True, f"Got: {tags_balanced([])}"
assert tags_balanced(["div", "/div"]) is True, f"Got: {tags_balanced(['div', '/div'])}"
assert tags_balanced(["span", "/span"]) is True, \
    f"Got: {tags_balanced(['span', '/span'])}"
# A single tag: an opener never closed, a closer never opened
assert tags_balanced(["div"]) is False, f"Got: {tags_balanced(['div'])}"
assert tags_balanced(["/div"]) is False, f"Got: {tags_balanced(['/div'])}"
assert tags_balanced(["p"]) is False, f"Got: {tags_balanced(['p'])}"
# Nesting and sequencing
assert tags_balanced(["div", "span", "/span", "/div"]) is True, \
    f"Got: {tags_balanced(['div', 'span', '/span', '/div'])}"
assert tags_balanced(["div", "span", "em", "/em", "/span", "/div"]) is True, \
    f"Got: {tags_balanced(['div', 'span', 'em', '/em', '/span', '/div'])}"
assert tags_balanced(["ul", "li", "/li", "li", "/li", "/ul"]) is True, \
    f"Got: {tags_balanced(['ul', 'li', '/li', 'li', '/li', '/ul'])}"
# Interleaved: right tags, wrong nesting
assert tags_balanced(["div", "span", "/div", "/span"]) is False, \
    f"Got: {tags_balanced(['div', 'span', '/div', '/span'])}"
assert tags_balanced(["div", "ul", "li", "/ul", "/li", "/div"]) is False, \
    f"Got: {tags_balanced(['div', 'ul', 'li', '/ul', '/li', '/div'])}"
# A wrong name closed deep inside, and everything after it still lines up
assert tags_balanced(["div", "span", "/div", "/span", "extra"]) is False, \
    f"Got: {tags_balanced(['div', 'span', '/div', '/span', 'extra'])}"
# Right names, wrong order
assert tags_balanced(["/div", "div"]) is False, f"Got: {tags_balanced(['/div', 'div'])}"
# Right count, wrong name
assert tags_balanced(["div", "/span"]) is False, f"Got: {tags_balanced(['div', '/span'])}"
assert tags_balanced(["span", "/div"]) is False, f"Got: {tags_balanced(['span', '/div'])}"
# Tags still open at the end
assert tags_balanced(["div", "span", "/span"]) is False, \
    f"Got: {tags_balanced(['div', 'span', '/span'])}"
assert tags_balanced(["div", "span"]) is False, f"Got: {tags_balanced(['div', 'span'])}"
# Same name reused several times, still has to nest correctly
assert tags_balanced(["li", "li", "/li", "/li"]) is True, \
    f"Got: {tags_balanced(['li', 'li', '/li', '/li'])}"
assert tags_balanced(["li", "li", "/li"]) is False, f"Got: {tags_balanced(['li', 'li', '/li'])}"
# Fifty deep, one name repeated: a rule beats a table of special cases
assert tags_balanced(["div"] * 50 + ["/div"] * 50) is True, \
    f"Got: {tags_balanced(['div'] * 50 + ['/div'] * 50)}"
assert tags_balanced(["div"] * 50 + ["/div"] * 49) is False, \
    f"Got: {tags_balanced(['div'] * 50 + ['/div'] * 49)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def tags_balanced(tags: list) -> bool:
    """ Return True when every tag in tags is closed by its own name, in order. """
    waiting = []
    for tag in tags:
        if tag.startswith("/"):
            if not waiting or waiting.pop() != tag[1:]:
                return False
        else:
            waiting.append(tag)
    return not waiting
```

### Wrong answers the tests must catch

```python # wrong: only counts tags, so it cannot see which name is which
def tags_balanced(tags: list) -> bool:
    count = 0
    for tag in tags:
        if tag.startswith("/"):
            count -= 1
            if count < 0:
                return False
        else:
            count += 1
    return count == 0
```

```python # wrong: remembers openers but closes them with any name
def tags_balanced(tags: list) -> bool:
    waiting = []
    for tag in tags:
        if tag.startswith("/"):
            if not waiting:
                return False
            waiting.pop()
        else:
            waiting.append(tag)
    return not waiting
```

```python # wrong: forgets the tags still open when the list ends
def tags_balanced(tags: list) -> bool:
    waiting = []
    for tag in tags:
        if tag.startswith("/"):
            if not waiting or waiting.pop() != tag[1:]:
                return False
        else:
            waiting.append(tag)
    return True
```

```python # wrong: uses the pile from the wrong end, oldest first
def tags_balanced(tags: list) -> bool:
    waiting = []
    for tag in tags:
        if tag.startswith("/"):
            if not waiting or waiting.pop(0) != tag[1:]:
                return False
        else:
            waiting.append(tag)
    return not waiting
```

```python # wrong: compares how many times each name opens against closes
def tags_balanced(tags: list) -> bool:
    opens = [tag for tag in tags if not tag.startswith("/")]
    closes = [tag[1:] for tag in tags if tag.startswith("/")]
    return sorted(opens) == sorted(closes)
```

### Give-aways the Description must never contain

```text # forbidden
[Ss]tack
\bLIFO\b
last in, first out
\bpush\b
\bpop\b
\.pop\(
\.append\(
most recent
last opener
still-open
waiting\b
tag\[1:\]
startswith\("/"\)
```

### Shortcuts the tests reject outright

```text # banned
```
