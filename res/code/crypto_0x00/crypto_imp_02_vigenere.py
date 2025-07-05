#!/usr/bin/env python3
""" Vigenere encryption """

from sys import argv
from itertools import cycle

def vigenere(clear: str, key: str, decode: bool = False) -> str:
    # Declare response
    res = ""

    for char_clear, char_key in zip(clear, cycle(key)):
        # Clause: Do not encrypt spaces
        if " " == char_clear:
            res += " "
            continue

        # Set the inverse key if decoding
        int_key = ord(char_key) - ord('a')
        if decode:
            int_key = 26 - int_key

        # Calculate new char from key_char offset
        int_cypher = ord(char_clear) + int_key - 2 * ord('a')
        int_cypher %= 26
        int_cypher += ord('a')

        # Append new character to cipher text
        res += chr(int_cypher)

    return(res)


if __name__ == '__main__':
    print(vigenere(argv[1], argv[2], decode=bool(int(argv[3]))))


"""
Example:

```bash
py crypto_imp_02_vigenere.py aaaaaa miclavesuperlarga 0

py crypto_imp_01_caesar.py   aaaaaa 4 0
py crypto_imp_02_vigenere.py aaaaaa 1234567 0
py crypto_imp_02_vigenere.py aaaaab 1234567 0
```
"""
