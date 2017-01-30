#!/usr/bin/env python
# coding=utf-8

'''
QQ Crypt module
Licensed to MIT
'''

import struct, ctypes
from random import randint

__all__ = ['encrypt', 'decrypt']

def xor8B(a, b):
    '''
    XOR operation between two 8B bytes.
    '''
    length = 8
    arr_a = bytearray(a[:length])
    arr_b = bytearray(b[:length])
    for i in range(length):
        arr_a[i] ^= arr_b[i]
    return bytes(arr_a) if isinstance(a, bytes) else arr_a

def encipher(v, k):
    '''
    TEA coder encrypt 64 bits value, by 128 bits key,
    QQ uses 16 round TEA.
    http://www.ftp.cl.cam.ac.uk/ftp/papers/djw-rmn/djw-rmn-tea.html .
    '''
    n=16  #qq use 16
    delta = 0x9e3779b9
    k = struct.unpack('!LLLL', k[0:16])
    y, z = map(ctypes.c_uint32, struct.unpack('!LL', v[0:8]))
    s = ctypes.c_uint32(0)
    for i in range(n):
        s.value += delta
        y.value += (z.value << 4) + k[0] ^ z.value+ s.value ^ (z.value >> 5) + k[1]
        z.value += (y.value << 4) + k[2] ^ y.value+ s.value ^ (y.value >> 5) + k[3]
    r = struct.pack('!LL', y.value, z.value)
    return r

def encrypt(v, k):
    """
    Encrypt function for QQ.

    v is the message to encrypt, k is the key
    fill char is randomized (which is 0xAD in old version)
    the length of the final data is filln + 8 + len(v)

    The message is encrypted 8 bytes at at time,
    the result is:

    r = encipher( v ^ tr, key) ^ to   (*)

    `encipher` is the QQ's TEA function.
    v is 8 bytes data to be encrypted.
    tr is the result in preceding round.
    to is the data coded in perceding round (v_pre ^ r_pre_pre)
    For the first 8 bytes 'tr' and 'to' is filled by zero.
    """
    vl = len(v)
    #filln = (8 - (vl + 2)) % 8
    filln = (6 - vl) % 8
    v_arr = [
        bytes(bytearray([filln | 0xf8])),
        b'\xad' * (filln + 2),  # random char * (filln + 2)
        v,
        b'\0' * 7,
    ]
    v = b''.join(v_arr)
    tr = to = b'\0' * 8
    r = []
    for i in range(0, len(v), 8):
        o = xor8B(v[i:i+8], tr)
        tr = xor8B(encipher(o, k), to)
        to = o
        r.append(tr)
    r = b''.join(r)
    return r

def decrypt(v, k):
    """
    Decrypt function for QQ.

    according to (*) we can get:

    x  = decipher(v[i:i+8] ^ prePlain, key) ^ preCyrpt

    prePlain is the previously encrypted 8 bytes:
       per 8 byte from v XOR previous preCyrpt
    preCrypt is previous 8 bytes of encrypted data.

    After decrypting, we must truncate the padding bytes.
    The number of padding bytes in the front of message is
    pos + 1.
    pos is the first byte of deCrypted: r[0] & 0x07 + 2
    The number of padding bytes in the end is 7 (b'\0' * 7).
    The returned value is r[pos+1:-7].

    >>> from binascii import a2b_hex, b2a_hex
    >>> r = encrypt('', b2a_hex('b537a06cf3bcb33206237d7149c27bc3'))
    >>> decrypt(r, b2a_hex('b537a06cf3bcb33206237d7149c27bc3'))
    ''
    >>> r = encrypt('abcdefghijklimabcdefghijklmn', b2a_hex('b537a06cf3bcb33206237d7149c27bc3'))
    >>> decrypt(r, b2a_hex('b537a06cf3bcb33206237d7149c27bc3'))
    'abcdefghijklimabcdefghijklmn'
    >>> import md5
    >>> key = md5.new(md5.new('python').digest()).digest()
    >>> data='8CE160B9F312AEC9AC8D8AEAB41A319EDF51FB4BB5E33820C77C48DFC53E2A48CD1C24B29490329D2285897A32E7B32E9830DC2D0695802EB1D9890A0223D0E36C35B24732CE12D06403975B0BC1280EA32B3EE98EAB858C40670C9E1A376AE6C7DCFADD4D45C1081571D2AF3D0F41B73BDC915C3AE542AF2C8B1364614861FC7272E33D90FA012620C18ABF76BE0B9EC0D24017C0C073C469B4376C7C08AA30'
    >>> data = a2b_hex(data)
    >>> b2a_hex(decrypt(data, key))
    '00553361637347436654695a354d7a51531c69f1f5dde81c4332097f0000011f4042c89732030aa4d290f9f941891ae3670bb9c21053397d05f35425c7bf80000000001f40da558a481f40000100004dc573dd2af3b28b6a13e8fa72ea138cd13aa145b0e62554fe8df4b11662a794000000000000000000000000dde81c4342c8966642c4df9142c3a4a9000a000a'

    """
    l = len(v)
    #if l % 8 != 0 or l < 16:
    #    return ''
    prePlain = decipher(v, k)
    pos = ord(prePlain[:1]) & 0x07 + 2
    r = prePlain
    preCrypt = v[0:8]
    for i in range(8, l, 8):
        x = xor8B(decipher(xor8B(v[i:i+8], prePlain), k), preCrypt)
        prePlain = xor8B(x, preCrypt)
        preCrypt = v[i:i+8]
        r += x
    if r[-7:] == b'\0' * 7:
        return r[pos+1:-7]

def decipher(v, k):
    '''
    TEA decipher, decrypt 64bits value with 128 bits key.
    it's the inverse function of TEA encrypt.
    '''
    n = 16
    y, z = map(ctypes.c_uint32, struct.unpack('!LL', v[0:8]))
    a, b, c, d = map(ctypes.c_uint32, struct.unpack('!LLLL', k[0:16]))
    delta = 0x9E3779B9
    s = ctypes.c_uint32(delta << 4)
    for i in range(n):
        z.value -= ((y.value << 4) + c.value) ^ (y.value + s.value) ^ ((y.value >> 5) + d.value)
        y.value -= ((z.value << 4) + a.value) ^ (z.value + s.value) ^ ((z.value >> 5) + b.value)
        s.value -= delta
    return struct.pack('!LL', y.value, z.value)
