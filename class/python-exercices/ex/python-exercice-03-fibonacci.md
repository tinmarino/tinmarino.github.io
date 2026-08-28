---
title: "Python 03 - Fibonacci"
---

# Fibonacci

## Instructions

Write a function `fibo(n: int) -> int` that returns the n-th Fibonacci number (0-indexed).

- `fibo(0)` = 0
- `fibo(1)` = 1
- `fibo(n)` = `fibo(n-1)` + `fibo(n-2)` for n >= 2

## Starter code

```python # template
def fibo(n: int) -> int:
    """Return the n-th Fibonacci number (0-indexed)."""
    # YOUR CODE HERE
```

## Tests

```python # tests
assert fibo(0) == 0, f"fibo(0) = {fibo(0)}"
assert fibo(1) == 1, f"fibo(1) = {fibo(1)}"
assert fibo(2) == 1, f"fibo(2) = {fibo(2)}"
assert fibo(5) == 5, f"fibo(5) = {fibo(5)}"
assert fibo(10) == 55, f"fibo(10) = {fibo(10)}"
assert fibo(20) == 6765, f"fibo(20) = {fibo(20)}"
print("All tests passed!")
```
