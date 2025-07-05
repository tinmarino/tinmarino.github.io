#!/usr/bin/env python3
""" One Time Pad encryption """

from sys import argv; from os import fsencode
from itertools import cycle

def one_time_pad(clear: bytes, key: bytes, decode: bool = False) -> bytes:
    # Declare response
    res = b""

    for char_clear, char_key in zip(clear, cycle(key)):
        # Calculate new char from key_char offset
        int_cypher = char_clear ^ char_key

        # Append new character to cipher text
        res += int_cypher.to_bytes()

    return(res)


if __name__ == '__main__':
    print(one_time_pad(fsencode(argv[1]), fsencode(argv[2]), decode=bool(int(argv[3]))))


"""
Example:

```bash
# Encode
py crypto_imp_03_one_time_pad.py aaaaaa $'\x03\x86\x62\xE1\x11\xB6\x0C\x1A\xA1\xE8\xDA\x9F\x63' 0

# Decode
py crypto_imp_03_one_time_pad.py $'b\xe7\x03\x80p\xd7' $'\x03\x86\x62\xE1\x11\xB6\x0C\x1A\xA1\xE8\xDA\x9F\x63' 1

# Change one char
py crypto_imp_03_one_time_pad.py aaaaaa $'\x03\x86\x62\xE1\x11\xB6\x0C\x1A\xA1\xE8\xDA\x9F\x63' 0  # Encode
py crypto_imp_03_one_time_pad.py aaaaab $'\x03\x86\x62\xE1\x11\xB6\x0C\x1A\xA1\xE8\xDA\x9F\x63' 0
"""
