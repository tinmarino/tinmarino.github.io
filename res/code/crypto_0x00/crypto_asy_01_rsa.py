#!/usr/bin/env python3
# vim: foldmethod=marker


# Utils {{{1
def extended_gcd(a, b):
    if a == 0:
        return b, 0, 1
    gcd, x1, y1 = extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return gcd, x, y

def get_private_key(e, phi):
    _, d, _ = extended_gcd(e, phi)
    # Asegurarse de que d sea positivo
    d = d % phi
    if d < 0:
        d += phi
    return d


# Init {{{1
p = 61     # Elejir 1.er n.o primo privado
q = 53     # Elejir 2.o n.o primo privado
N = p * q; N  # Calcular producto (p × q) = 3233
# Calcular totiente (p − 1)(q − 1) = 3120
phi = (p - 1) * (q - 1); phi


# Public Key {{{1
# Elejir exponente público
e = 17


# Private Key {{{1
# Calcular exponente privado (d × e ≡ 1 (mod φ(N))))
# -- d = 2753
d = get_private_key(e, phi); d
# Verificar que d es el inverso de e (modulo el totiente)
d * e % phi  # = 1 => OK


# Clear text {{{1
m = 42   # Elejir mensaje


# Cipher text {{{1
# Calcular cifrado (c = m^e ≡ N)
# -- c = 2557
c = pow(m, e, N); c


# Uncipher text {{{1
# Calcular claro (u = c^d ≡ N)
# -- u = 42
u = pow(c, d, N); u
