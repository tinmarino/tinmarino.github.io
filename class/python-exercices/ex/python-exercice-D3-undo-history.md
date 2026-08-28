---
title: "Python D3 - Undo History"
---

# Undo History

## Instructions

Write a function `apply_edits(actions: list) -> str` that replays a list of edit actions and returns the text they leave behind.

`"type ba"` adds `ba` to the text, `"undo"` takes back the last thing typed, and `"redo"` puts back the last thing undone. What each one does when there is nothing left to take back or put back is decided in the rules, and the tests check it.

## Description

### Goal

Every editor has two keys that undo each other: one takes your last edit back, the
other puts it in again. You are handed the log of a short editing session &mdash; what
was typed, where the writer pressed undo, where they asked for it back &mdash; and you
hand back the text that survived.

Exercise `D1` already told you that undo is a pile. It said nothing about where an
undone edit *goes*, and that is the whole of this one.

### The three actions

`actions` is a list of strings, and there are only three kinds:

| Action | Means |
|---|---|
| `"type ba"` | the text `ba` was typed on the end |
| `"undo"` | the most recent piece of typing is taken back |
| `"redo"` | the most recently taken-back piece is put in again |

The typed text is everything after `type `, kept exactly as it is, spaces and
punctuation included. One action can type a single letter, a whole sentence, or
nothing at all.

### Rules

- Return the surviving text as one **string**, the pieces run together with nothing
  between them. `apply_edits([])` returns `""`.
- `undo` takes back one whole piece of typing, not one character. If the last action
  typed `nana`, one `undo` removes all four letters.
- `redo` puts one whole piece back, on the end, exactly as it read. Two `undo`
  followed by two `redo` must leave the text exactly as it was.
- **`undo` with nothing left to take back does nothing**, and so does **`redo` with
  nothing left to put back**. The text stays as it is and your function must not
  raise. That is the spec's decision, not yours, and the tests check it &mdash;
  including three `undo` in a row on an empty document.
- **Typing throws the redo away.** Any piece that was taken back before a `type`
  action is gone for good: a `redo` after it does nothing.
- The list you were given must come out **unchanged**.

That fifth rule is not an invention. Try it in whatever you are writing in right now:
type a word, take it back, type something else, then ask for the redo. It does not
come back. That is not a bug, and it is about to stop being a mystery.

### Examples

| Call | Returns |
|---|---|
| `apply_edits(["type ba", "type na", "type na"])` | `"banana"` |
| `apply_edits(["type ba", "type na", "type nu", "undo", "type na"])` | `"banana"` |
| `apply_edits(["type ba", "type nana", "undo", "redo"])` | `"banana"` |
| `apply_edits(["type ba", "type nu", "undo", "type na", "redo"])` | `"bana"` |
| `apply_edits(["type hello", "undo"])` | `""` |
| `apply_edits(["type undo ", "type redo!"])` | `"undo redo!"` |
| `apply_edits(["redo", "undo", "redo"])` | `""` |
| `apply_edits([])` | `""` |

The fourth line is the fifth rule at work. Read it again before you carry on: the
`redo` at the end has nothing to do, because a `type` came between it and the `undo`.

### What undo has to take back

The obvious plan is a single variable holding the text so far: every `type` adds to the
end of it, every `undo` cuts something off the end. Try that plan on the second example
above. When the `undo` arrives the text reads `bananu`, and it has to become `bana`.

Cutting the end off is easy. Knowing *how much* to cut is not. Here it is two
characters, in the fifth example it is five, and the action that says `undo` says
nothing at all about the piece in front of it.

### And where does the piece go?

`undo` cannot simply throw the piece away, because a `redo` may ask for it back &mdash;
whole, unchanged, and most recent first. So between an `undo` and the `redo` that
answers it, the piece has to survive somewhere. A slice you have already dropped is not
somewhere.

### Things you will need

A slice with only a start gives you everything from that position to the end, which is
how you drop a prefix whose length you know:

```python
print("colour: blue"[8:])        # blue
```

Counting the characters of the prefix is on you. Get it wrong by one and every piece of
text drags a stray space around with it. `.replace` and `.lstrip` look like they do this
job; neither of them removes a *prefix*, and the tests know it.

A list of strings becomes one string with `join`. Whatever sits between the quotes goes
between the pieces, and here nothing does:

```python
parts = ["Mont", "pel", "lier"]
print("".join(parts))        # Montpellier
```

You built the pile itself in `D1`, and the calls on it have not changed since. Only what
you put in it, and how many piles you need, are open questions here.

### The questions to answer first

Two of them, and they have to be answered together, on paper, before you type a line:

What did you have to keep, while the loop was running, for `undo` to know what to take
back? And what becomes of the piece it took, so that a `redo` two actions later can find
it again &mdash; and so that a `type` two actions later can be sure it never will?

There is more than one honest answer, and choosing between them is the exercise. They
lead to different bodies, and taking something back means a different thing in each.

## Starter code

```python # template
def apply_edits(actions: list) -> str:
    """ Return the text left after replaying every action in the list.

    >>> apply_edits(["type bana", "type nas", "undo", "redo", "type !"])
    'bananas!'
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(apply_edits(["type bana", "type nas", "undo", "redo", "type !"]))
```

## Tests

```python # tests
# A session with no undo at all
_plain = ["type ba", "type na", "type na"]
assert apply_edits(_plain) == "banana", f"Got: {apply_edits(_plain)}"
assert isinstance(apply_edits(_plain), str), \
    f"Got: a {type(apply_edits(_plain)).__name__}, not a str"
# Nothing was ever typed, and the empty answer is still a string
assert apply_edits([]) == "", f"Got: {apply_edits([])}"
assert isinstance(apply_edits([]), str), \
    f"Got: a {type(apply_edits([])).__name__}, not a str"
# A typo, taken back, then typed properly
_typo = ["type ba", "type na", "type nu", "undo", "type na"]
assert apply_edits(_typo) == "banana", f"Got: {apply_edits(_typo)}"
# undo takes back the whole piece, not one character
_chunk = ["type ba", "type nana", "undo"]
assert apply_edits(_chunk) == "ba", f"Got: {apply_edits(_chunk)}"
# The typed text is kept exactly: spaces, capitals and punctuation all survive
_sentence = ["type never ", "type odd ", "type or even"]
assert apply_edits(_sentence) == "never odd or even", f"Got: {apply_edits(_sentence)}"
_shout = ["type Hello, ", "type World!"]
assert apply_edits(_shout) == "Hello, World!", f"Got: {apply_edits(_shout)}"
# The words "undo" and "redo" can also be typed as text
_meta = ["type undo ", "type redo!"]
assert apply_edits(_meta) == "undo redo!", f"Got: {apply_edits(_meta)}"
# "type" can be typed as text too, so only the leading five characters go
_selftype = ["type I will ", "type type it again"]
assert apply_edits(_selftype) == "I will type it again", f"Got: {apply_edits(_selftype)}"
# A type action can type nothing at all, and taking it back removes nothing
_blank = ["type ba", "type ", "undo", "type nana"]
assert apply_edits(_blank) == "banana", f"Got: {apply_edits(_blank)}"
# Everything typed is taken back again, from pieces of different lengths
_all_back = ["type ban", "type a", "undo", "undo"]
assert apply_edits(_all_back) == "", f"Got: {apply_edits(_all_back)}"
# Undo twice over pieces of different length: one remembered length is not enough
_uneven = ["type one", "type two", "type three", "undo", "undo"]
assert apply_edits(_uneven) == "one", f"Got: {apply_edits(_uneven)}"
# redo puts the piece back on the end, whole and exactly as it read
_back = ["type ba", "type nana", "undo", "redo"]
assert apply_edits(_back) == "banana", f"Got: {apply_edits(_back)}"
# Two undos then two redos leave the text exactly as it was
_pair = ["type ba", "type na", "type na", "undo", "undo", "redo", "redo"]
assert apply_edits(_pair) == "banana", f"Got: {apply_edits(_pair)}"
# The most recently taken back piece is the first one put back, not the oldest
_order = ["type one", "type two", "type three", "undo", "undo", "redo"]
assert apply_edits(_order) == "onetwo", f"Got: {apply_edits(_order)}"
# Typing throws the redo away: what was taken back before it is gone for good,
# so the redo that follows has nothing to put back and must not raise either
try:
    _killed = apply_edits(["type ba", "type nu", "undo", "type na", "redo"])
except (IndexError, ValueError, TypeError) as _error:
    _killed = f"crashed on a redo after a type: {_error!r}"
assert _killed == "bana", f"Got: {_killed}"
try:
    _killed_deep = apply_edits(["type a", "type b", "undo", "undo", "type c",
                                "redo", "redo"])
except (IndexError, ValueError, TypeError) as _error:
    _killed_deep = f"crashed on a redo after a type: {_error!r}"
assert _killed_deep == "c", f"Got: {_killed_deep}"
# undo on an empty history does nothing, and must not raise
try:
    _nothing = apply_edits(["undo"])
except (IndexError, ValueError, TypeError) as _error:
    _nothing = f"crashed on an undo with nothing to take back: {_error!r}"
assert _nothing == "", f"Got: {_nothing}"
# redo with nothing to put back does nothing either, and must not raise
try:
    _spare = apply_edits(["redo", "redo", "type banana"])
except (IndexError, ValueError, TypeError) as _error:
    _spare = f"crashed on a redo with nothing to put back: {_error!r}"
assert _spare == "banana", f"Got: {_spare}"
# A redo is not a second undo: it cannot reach past what was taken back
try:
    _twice = apply_edits(["type ba", "type na", "undo", "redo", "redo"])
except (IndexError, ValueError, TypeError) as _error:
    _twice = f"crashed on a redo with nothing to put back: {_error!r}"
assert _twice == "bana", f"Got: {_twice}"
# undo past the start, then the writing carries on
try:
    _past = apply_edits(["type hi", "undo", "undo", "undo", "type yo"])
except (IndexError, ValueError, TypeError) as _error:
    _past = f"crashed on an undo with nothing to take back: {_error!r}"
assert _past == "yo", f"Got: {_past}"
try:
    _late = apply_edits(["undo", "undo", "undo", "type banana"])
except (IndexError, ValueError, TypeError) as _error:
    _late = f"crashed on an undo with nothing to take back: {_error!r}"
assert _late == "banana", f"Got: {_late}"
# The list you were given must come out unchanged
_given = ["type ba", "undo", "redo", "type banana"]
apply_edits(_given)
assert _given == ["type ba", "undo", "redo", "type banana"], \
    f"Got: the input was modified into {_given}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def apply_edits(actions: list) -> str:
    """ Return the text left after replaying every action in the list. """
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action[5:])
            undone = []
    return "".join(typed)
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: replace strips "type " everywhere, not just off the front
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action.replace("type ", ""))
            undone = []
    return "".join(typed)
```

```python # wrong: lstrip removes a set of characters, not a prefix
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action.lstrip("type "))
            undone = []
    return "".join(typed)
```

```python # wrong: text[:-0] wipes the document when an edit typed nothing
def apply_edits(actions: list) -> str:
    text = ""
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                piece = typed.pop()
                undone.append(piece)
                text = text[:-len(piece)]
        elif action == "redo":
            if undone:
                piece = undone.pop()
                typed.append(piece)
                text = text + piece
        else:
            typed.append(action[5:])
            text = text + action[5:]
            undone = []
    return text
```

```python # wrong: typing does not throw the redo away
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action[5:])
    return "".join(typed)
```

```python # wrong: redo puts back the oldest undone piece instead of the newest
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop(0))
        else:
            typed.append(action[5:])
            undone = []
    return "".join(typed)
```

```python # wrong: redo with nothing to put back raises IndexError
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            typed.append(undone.pop())
        else:
            typed.append(action[5:])
            undone = []
    return "".join(typed)
```

```python # wrong: undo with nothing to take back raises IndexError
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action[5:])
            undone = []
    return "".join(typed)
```

```python # wrong: undo takes back the oldest piece
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop(0))
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action[5:])
            undone = []
    return "".join(typed)
```

```python # wrong: off by one, keeps the space after "type"
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action[4:])
            undone = []
    return "".join(typed)
```

```python # wrong: treats any action containing "undo" or "redo" as the command
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if "undo" in action:
            if typed:
                undone.append(typed.pop())
        elif "redo" in action:
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action[5:])
            undone = []
    return "".join(typed)
```

```python # wrong: undo cuts one character instead of one piece
def apply_edits(actions: list) -> str:
    text = ""
    for action in actions:
        if action == "undo":
            text = text[:-1]
        else:
            text = text + action[5:]
    return text
```

```python # wrong: empties the caller's list instead of reading it
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    while actions:
        action = actions.pop(0)
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action[5:])
            undone = []
    return "".join(typed)
```

```python # wrong: returns the pieces instead of the text
def apply_edits(actions: list) -> str:
    typed = []
    undone = []
    for action in actions:
        if action == "undo":
            if typed:
                undone.append(typed.pop())
        elif action == "redo":
            if undone:
                typed.append(undone.pop())
        else:
            typed.append(action[5:])
            undone = []
    return typed
```

### Give-aways the Description must never contain

```text # forbidden
for\s+\w+\s+in\s+actions\b
\w+\[5:\]
\[len\("type "\):\]
removeprefix\(
==\s*"undo"
==\s*"redo"
\.append\(\s*action\b
\.append\(\s*\w+\.pop\(
\.join\(\s*(typed|history|pieces|stack)\b
(undone|redone|redo_stack)\s*=\s*\[\]
two\s+(stacks|piles|lists)\b
```

### Shortcuts the tests reject outright

None: there is no one-liner that skips this lesson, and the slice that trims
`type ` off the front is not the lesson either, so it is left alone.

```text # banned
```
