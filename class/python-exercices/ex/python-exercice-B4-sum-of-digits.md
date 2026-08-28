---
title: "Python B4 - Sum of Digits"
---

# Sum of Digits

## Instructions

Write a function `sum_digits(number: int) -> int` that returns the sum of the digits of `number`.

Add them up yourself. `sum(` does the adding for you, so **Check** turns it down.

## Description

### Goal

Adding the digits of a number tells you something the number itself will not say out loud:
whether it divides by 3. `123456789` adds up to `45`, `45` divides by 3, and so does
`123456789`. That holds however long the number is, which is why it is a check a person
can still do faster than typing the thing in.

So: `1234` is made of the digits `1`, `2`, `3` and `4`, and your function hands back their
total, `10`. One number.

Return it &mdash; do not print it.

### Rules

- `number` is zero or more. You never have to deal with a negative number.
- A single digit is its own total: `sum_digits(7)` is `7`.
- Zeros inside the number contribute nothing, but they are still digits: `5000` is `5`.
- `sum_digits(0)` is `0`, and it should fall out of your loop on its own. If you find
  yourself writing a special case for it, your loop is not right yet.
- Add them up yourself. Do **not** use `sum(` &mdash; the adding *is* the exercise.

### Examples

| Call | Returns |
|---|---|
| `sum_digits(1234)` | `10` |
| `sum_digits(2026)` | `10` |
| `sum_digits(123456789)` | `45` |
| `sum_digits(7)` | `7` |
| `sum_digits(0)` | `0` |
| `sum_digits(5000)` | `5` |

### The problem: a number is not a row of things

Everything you have looped over so far was already a sequence. A string is a row of
characters and a list is a row of items, so `for` had something to walk along.

`1234` is not a row of anything. It is one single value. Python will not let you write
`for digit in 1234`, and if you try it says so plainly. Before you can visit the digits,
you have to *get at them somehow*.

There are two completely different ways to do that, and both are good answers.

### Road one: make it into a row of things

Text and numbers are two different things in Python, and it converts each way. You already
know how to walk text one character at a time, from exercise `A3`. The two conversions are
what you may not have met, and text that looks like a number is still text, so it does not
add up the way a number does:

```python
def add_one(stg: str) -> int:
    """ Return the number written in stg, plus one. """
    return int(stg) + 1


print("Flight " + str(407))      # prints Flight 407
print(add_one("407"))            # prints 408
```

Try `"12" + "3"` in the console, then `int("12") + int("3")`, and watch the difference.

### Road two: peel the digits off with arithmetic

No text at all on this road. Two operators do the work, and neither is new to you from
maths class &mdash; you just may not have seen their Python spelling.

`//` divides and throws the fraction away. `%` divides and keeps *only* what was left
over. `/` looks similar but hands back a decimal, and a decimal cannot hold every digit of
a very long number, so on this road it has to be `//`. Together the two of them split a
number into two useful halves:

```python
def show_minutes(total_minutes: int) -> None:
    """ Print total_minutes as whole hours, then the minutes left over. """
    hours = total_minutes // 60
    minutes = total_minutes % 60
    print(hours)
    print(minutes)


show_minutes(145)                # prints 2, then 25
```

`145 // 60` is `2` and `145 % 60` is `25`. Nothing was lost: one operator took the whole
part, the other took the remainder.

That example splits by 60 because an hour has 60 minutes. Your digits are not written in
base 60. **Put some other number where the `60` is, and work out on paper what the two
halves become.** Most choices give you nothing worth having. One of them is this whole
road, and finding it is the exercise.

Two warnings before you start down it. You will not know in advance how many turns your
loop needs, since a number does not announce how many digits it has: `for` is the loop for
when you know how many, `while` is the loop for when you only know when to *stop*, and you
met it in `B3`. And get the stopping condition wrong and the loop never ends &mdash; that
is what the **Stop** button above the editor is for.

### Which road?

Pick one and write it. Then &mdash; and this is the actual point of the exercise &mdash;
write the other one too, and put the two functions side by side in the editor. Call them
`sum_digits_text` and `sum_digits_math`, and leave `sum_digits` itself as one line handing
the work to whichever of the two you trust, so **Check** still has something to grade.
They share nothing but a running total. They read nothing alike.

So go and find a number they disagree on. Paste this into the editable "Run with" box
under the editor and press **Run**:

```python # sketch
for candidate in range(1, 10000):
    if sum_digits_text(candidate) != sum_digits_math(candidate):
        print("they disagree on", candidate)
        break
print("done")
```

It tries every number up to ten thousand. Read what it prints twice.

## Starter code

```python # template
def sum_digits(number: int) -> int:
    """ Return the total of the digits of number, which is zero or more.

    >>> sum_digits(1234)
    10
    """
    # YOUR CODE HERE
```

## Run

```python # run
print(sum_digits(123456789))
```

## Tests

```python # tests
# The adding up is the exercise, so Check refuses the shortcut.
for _banned in ("sum(",):
    assert _banned not in __student_code__, f"Got: the banned shortcut {_banned}"

# Adding is not multiplying: 1*2*3*4 is 24, but 1+2+3+4 is 10
assert sum_digits(1234) == 10, f"Got: {sum_digits(1234)}"
assert sum_digits(2026) == 10, f"Got: {sum_digits(2026)}"
# One digit is its own total, and zero comes out of the loop needing no special case
assert sum_digits(7) == 7, f"Got: {sum_digits(7)}"
assert sum_digits(0) == 0, f"Got: {sum_digits(0)}"
# Every number below 40 in a row, so a lookup table cannot masquerade as an answer
assert [sum_digits(_num) for _num in range(10)] == [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], \
    f"Got: {[sum_digits(_num) for _num in range(10)]}"
assert [sum_digits(_num) for _num in range(10, 20)] == [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], \
    f"Got: {[sum_digits(_num) for _num in range(10, 20)]}"
assert [sum_digits(_num) for _num in range(20, 30)] == [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], \
    f"Got: {[sum_digits(_num) for _num in range(20, 30)]}"
assert [sum_digits(_num) for _num in range(30, 40)] == [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], \
    f"Got: {[sum_digits(_num) for _num in range(30, 40)]}"
# Zeros are digits too, worth nothing but still visited
assert sum_digits(100) == 1, f"Got: {sum_digits(100)}"
assert sum_digits(5000) == 5, f"Got: {sum_digits(5000)}"
assert sum_digits(1000000) == 1, f"Got: {sum_digits(1000000)}"
assert sum_digits(101) == 2, f"Got: {sum_digits(101)}"
# The leading digit must be counted, not left behind
assert sum_digits(91) == 10, f"Got: {sum_digits(91)}"
# Long ones, where counting digits and adding them differ loudly
assert sum_digits(999999) == 54, f"Got: {sum_digits(999999)}"
assert sum_digits(123456789) == 45, f"Got: {sum_digits(123456789)}"
assert sum_digits(987654321) == 45, f"Got: {sum_digits(987654321)}"
assert sum_digits(2222) == 8, f"Got: {sum_digits(2222)}"
# Longer than a decimal can hold exactly, so `/` written where `//` was meant fails here
assert sum_digits(10 ** 30) == 1, f"Got: {sum_digits(10 ** 30)}"
assert sum_digits(123456789012345678901234567890) == 135, \
    f"Got: {sum_digits(123456789012345678901234567890)}"
# A number does not announce how many digits it has, so a fixed count of turns is no
# answer: this one has more digits than any count such a loop would ever name
_NINES = int("9" * 2000)
assert sum_digits(_NINES) == 18000, f"Got: {sum_digits(_NINES)}"
print("All tests passed!")
```

## Solution

Not shown by the app: it renders only `## Description` and the labelled
fences. This section is what `script/verify_exercices.py` checks the
exercise against, so the exercise is verifiable on its own.

### Reference solution

```python # solution
def sum_digits(number: int) -> int:
    """ Return the total of the digits of number, which is zero or more. """
    total = 0
    rest = number
    while rest > 0:
        total += rest % 10
        rest //= 10
    return total
```

### Wrong answers the tests must catch

Each one is an answer a student really writes, or a shortcut that games the
test data. Every one of them must make **Check** fail.

```python # wrong: lets sum() do the adding
def sum_digits(number: int) -> int:
    return sum(int(digit) for digit in str(number))
```

```python # wrong: returns the number itself
def sum_digits(number: int) -> int:
    return number
```

```python # wrong: counts the digits instead of adding them
def sum_digits(number: int) -> int:
    return len(str(number))
```

```python # wrong: returns only the first digit
def sum_digits(number: int) -> int:
    return int(str(number)[0])
```

```python # wrong: stops one digit early, leaving the leading one behind
def sum_digits(number: int) -> int:
    total = 0
    rest = number
    while rest > 9:
        total += rest % 10
        rest //= 10
    return total
```

```python # wrong: divides with / so a long number loses digits to the decimal
def sum_digits(number: int) -> int:
    total = 0
    rest = number
    while rest > 0:
        total += rest % 10
        rest = int(rest / 10)
    return total
```

```python # wrong: a fixed count of turns instead of a while
def sum_digits(number: int) -> int:
    total = 0
    rest = number
    for _ in range(1000):
        total += rest % 10
        rest //= 10
    return total
```

```python # wrong: hard-codes the answers instead of computing them
def sum_digits(number: int) -> int:
    return {1234: 10, 2026: 10, 7: 7, 0: 0, 100: 1, 5000: 5, 1000000: 1,
            101: 2, 91: 10, 999999: 54, 123456789: 45, 987654321: 45,
            2222: 8}.get(number, 0)
```

```python # wrong: multiplies the digits instead of adding them
def sum_digits(number: int) -> int:
    product = 1
    for digit in str(number):
        product *= int(digit)
    return product
```

```python # wrong: adds the characters as text, so it never gets a number
def sum_digits(number: int) -> int:
    total = ""
    for digit in str(number):
        total += digit
    return int(total)
```

### Give-aways the Description must never contain

```text # forbidden
%\s*10
//\s*10
str\(number\)
int\(str\(
\bsum\(
for\s+\w+\s+in\s+str\(
while\s+\w*\s*>\s*0
\btotal\s*\+=
last\s+digit
```

### Shortcuts the tests reject outright

```text # banned
sum(
```
