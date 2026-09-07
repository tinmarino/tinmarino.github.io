---
title: "Python A17 - Same Word, Any Case"
---

# Same Word, Any Case

## Instructions

Write a function `same_word(left: str, right: str) -> bool` that returns `True` when the two strings are the same word ignoring upper and lower case.

Return the boolean, do not print it.

## Description

### Goal

Compare two words and treat case as irrelevant, so `"Hi"` and `"HI"` count as the
same word.

### Rules

- Case must not matter: `"Cat"`, `"cat"` and `"CAT"` are all the same word.
- Return `True` or `False`, do not print.

### Examples

| Call | Returns |
|---|---|
| `same_word("Hi", "HI")` | `True` |
| `same_word("cat", "cat")` | `True` |
| `same_word("cat", "dog")` | `False` |
| `same_word("ABC", "abc")` | `True` |

### Things you will need

A string can be flattened to one case:

```python
for word in ["Hi", "HELLO", "CaT"]:
    print(word.lower())
```

Once two things are in the same case, `==` compares them.

### Which order do you need?

If two words differ only in case, what has to happen to each of them before `==`
can see them as equal?

## Starter code

```python # template
def same_word(left: str, right: str) -> bool:
    """ Return True when the words match ignoring case, e.g. True for ("Hi", "HI").

    >>> same_word("Hi", "HI")
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(same_word("Hi", "HI"))
```

## Tests

```python # tests
assert same_word("Hi", "HI") is True, f"Got: {same_word('Hi', 'HI')}"
assert same_word("cat", "cat") is True, f"Got: {same_word('cat', 'cat')}"
assert same_word("cat", "dog") is False, f"Got: {same_word('cat', 'dog')}"
assert same_word("ABC", "abc") is True, f"Got: {same_word('ABC', 'abc')}"
assert same_word("a", "b") is False, f"Got: {same_word('a', 'b')}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def same_word(left: str, right: str) -> bool:
    """ Return True when the words match ignoring case, e.g. True for ("Hi", "HI"). """
    return left.lower() == right.lower()
```

### Wrong answers the tests must catch

```python # wrong: compares with case still mattering
def same_word(left: str, right: str) -> bool:
    """ Straight comparison, case-sensitive. """
    return left == right
```

```python # wrong: only lowers one side
def same_word(left: str, right: str) -> bool:
    """ Lowers left but not right. """
    return left.lower() == right
```

### Give-aways the Description must never contain

```text # forbidden
lower\(\).*lower\(\)
casefold
```

### Shortcuts the tests reject outright

```text # banned
```
