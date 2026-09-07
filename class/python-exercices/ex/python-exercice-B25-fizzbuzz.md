---
title: "Python B25 - FizzBuzz"
---

# FizzBuzz

## Instructions

Write a function `fizzbuzz(count: int) -> list` that returns the FizzBuzz list for `1` to `count`: `"Fizz"` for multiples of 3, `"Buzz"` for multiples of 5, `"FizzBuzz"` for multiples of both, and otherwise the number itself as a string.

Return the list, do not print it.

## Description

### Goal

Build the classic FizzBuzz sequence as a list of strings. For 5 it is
`["1", "2", "Fizz", "4", "Buzz"]`.

### Rules

- A multiple of 3 becomes `"Fizz"`, a multiple of 5 becomes `"Buzz"`.
- A number that is a multiple of **both** becomes `"FizzBuzz"`.
- Anything else becomes the number written as a string: `4` becomes `"4"`.
- Return the list, do not print it.

### Examples

| Call | Returns |
|---|---|
| `fizzbuzz(3)` | `["1", "2", "Fizz"]` |
| `fizzbuzz(5)` | `["1", "2", "Fizz", "4", "Buzz"]` |
| `fizzbuzz(1)` | `["1"]` |
| `fizzbuzz(0)` | `[]` |

### Things you will need

Remainders tell you what a number is a multiple of:

```python
for number in range(1, 6):
    print(number, number % 3, number % 5)
```

A number can be turned into its text form:

```python
print(str(4))
```

### Which order do you need?

A number that is a multiple of both 3 and 5 would also pass the "multiple of 3"
test on its own. So which case do you have to check **first** for `"FizzBuzz"` to
ever appear?

## Starter code

```python # template
def fizzbuzz(count: int) -> list:
    """ Return the FizzBuzz list for 1..count, e.g. ["1", "2", "Fizz"] for 3.

    >>> fizzbuzz(5)
    ['1', '2', 'Fizz', '4', 'Buzz']
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(fizzbuzz(15))
```

## Tests

```python # tests
assert fizzbuzz(5) == ["1", "2", "Fizz", "4", "Buzz"], f"Got: {fizzbuzz(5)}"
assert fizzbuzz(1) == ["1"], f"Got: {fizzbuzz(1)}"
assert fizzbuzz(0) == [], f"Got: {fizzbuzz(0)}"
_got = fizzbuzz(15)
assert _got[2] == "Fizz", f"Got: {_got[2]}"
assert _got[4] == "Buzz", f"Got: {_got[4]}"
assert _got[14] == "FizzBuzz", f"Got: {_got[14]}"
assert _got[0] == "1", f"Got: {_got[0]}"
print("All tests passed!")
```

## Solution

### Reference solution

```python # solution
def fizzbuzz(count: int) -> list:
    """ Return the FizzBuzz list for 1..count, e.g. ["1", "2", "Fizz"] for 3. """
    result = []
    for number in range(1, count + 1):
        if number % 15 == 0:
            result.append("FizzBuzz")
        elif number % 3 == 0:
            result.append("Fizz")
        elif number % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(number))
    return result
```

### Wrong answers the tests must catch

```python # wrong: checks 3 before 15, so FizzBuzz never appears
def fizzbuzz(count: int) -> list:
    """ Order bug: 15 is caught by the 3 test first. """
    result = []
    for number in range(1, count + 1):
        if number % 3 == 0:
            result.append("Fizz")
        elif number % 5 == 0:
            result.append("Buzz")
        elif number % 15 == 0:
            result.append("FizzBuzz")
        else:
            result.append(str(number))
    return result
```

```python # wrong: leaves plain numbers as ints, not strings
def fizzbuzz(count: int) -> list:
    """ Forgets str() on the plain numbers. """
    result = []
    for number in range(1, count + 1):
        if number % 15 == 0:
            result.append("FizzBuzz")
        elif number % 3 == 0:
            result.append("Fizz")
        elif number % 5 == 0:
            result.append("Buzz")
        else:
            result.append(number)
    return result
```

### Give-aways the Description must never contain

```text # forbidden
%\s*15
append\(
```

### Shortcuts the tests reject outright

```text # banned
```
