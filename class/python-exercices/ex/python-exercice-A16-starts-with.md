---
title: "Python A16 - Remote URL?"
---

# Remote URL?

## Instructions

Write a function `is_remote(url: str) -> bool:` that returns `True` when `url` begins with `"http"` or with `"ssh"`, and `False` otherwise.

Return the boolean, do not print it.

## Description

### Goal

Decide whether an address points somewhere remote. It counts as remote when it
starts with `"http"` or with `"ssh"`, and nothing else counts.

### Rules

- Only the **start** of the string matters. An address that merely contains those
  letters somewhere in the middle is not remote.
- Return `True` or `False`, do not print.

### Examples

| Call | Returns |
|---|---|
| `is_remote("http://a.com")` | `True` |
| `is_remote("https://a.com")` | `True` |
| `is_remote("ssh://server")` | `True` |
| `is_remote("ftp://a.com")` | `False` |
| `is_remote("myhttp")` | `False` |

### Things you will need

A string can say whether it begins with some letters:

```python
for word in ["apple", "apricot", "banana"]:
    print(word.startswith("ap"))
```

Two conditions joined with `or` are true when either one is:

```python
for number in [5, 20]:
    print(number < 10 or number > 15)
```

### Which order do you need?

There are two ways to be remote. Does the answer need both to be true, or just
one of them?

## Starter code

```python # template
def is_remote(url: str) -> bool:
    """ Return True when `url` starts with "http" or "ssh", e.g. True for "ssh://x".

    >>> is_remote("http://x")
    True
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(is_remote("ssh://server"))
```

## Tests

```python # tests
assert is_remote("http://a.com") is True, f"Got: {is_remote('http://a.com')}"
assert is_remote("https://a.com") is True, f"Got: {is_remote('https://a.com')}"
assert is_remote("ssh://server") is True, f"Got: {is_remote('ssh://server')}"
assert is_remote("ftp://a.com") is False, f"Got: {is_remote('ftp://a.com')}"
assert is_remote("myhttp") is False, f"Got: {is_remote('myhttp')}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def is_remote(url: str) -> bool:
    """ Return True when `url` starts with "http" or "ssh", e.g. True for "ssh://x". """
    return url.startswith(("http", "ssh"))
```

### Wrong answers the tests must catch

```python # wrong: only checks http, forgets ssh
def is_remote(url: str) -> bool:
    """ Miss the ssh case. """
    return url.startswith("http")
```

```python # wrong: matches anywhere, not just the start
def is_remote(url: str) -> bool:
    """ True if the letters appear anywhere. """
    return "http" in url or "ssh" in url
```

### Give-aways the Description must never contain

```text # forbidden
startswith\(\(
url\[:
```

### Shortcuts the tests reject outright

```text # banned
```
