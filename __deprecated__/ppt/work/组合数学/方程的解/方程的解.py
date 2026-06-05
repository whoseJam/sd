def fast_pow(a: int, b: int, mod: int):
    ans = 1
    while b:
        if (b & 1) != 0:
            ans = ans * a % mod
        b >>= 1
        a = a * a % mod
    return ans

def g(x: int):
    return fast_pow(x, x, 1000)

def f(x: int):
    ans = 1
    for i in range(1, x + 1):
        ans = ans * i
    return ans

def C(n: int, m: int):
    return f(n) // f(m) // f(n - m)

inputs = input().split(" ")
k = int(inputs[0])
x = int(inputs[1])
R = g(x)
print(C(R - 1, k - 1))