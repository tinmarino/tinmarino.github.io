#!/usr/bin/env python3
""" Caesar encryption """

from sys import argv
from itertools import cycle

def caesar(clear: str, key: int, decode: bool = False) -> str:
    # Declare response
    res = ""

    for char_clear in clear:
        # Clause: Do not encrypt spaces
        if " " == char_clear:
            res += " "
            continue

        # Set the inverse key if decoding
        pass  # Placeholer
        if decode:
            key = 26 - key

        # Calculate new char from key offset
        int_cypher = ord(char_clear) - ord('a') + key
        int_cypher %= 26
        int_cypher += ord('a')

        # Append new character to cipher text
        res += chr(int_cypher)

    return(res)


if __name__ == '__main__':
    print(caesar(argv[1], int(argv[2]), decode=bool(int(argv[3]))))


"""
Example:

```bash
py crypto_imp_01_caesar.py aaaaaa 4 0
py crypto_imp_01_caesar.py aaaaab 4 0
py crypto_imp_01_caesar.py aaaabb 4 0
py crypto_imp_01_caesar.py aaaaac 4 0
py crypto_imp_01_caesar.py aaaaad 4 0

py crypto_imp_01_caesar.py eeeeeh 4 1
```
"""
