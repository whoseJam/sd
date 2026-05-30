import sys
sys.set_int_max_str_digits(10000000)

def f(x: int):
    ans = 1
    for i in range(1, x + 1):
        ans = ans * i
    return ans

def A(n: int, m: int):
    return f(n) // f(n - m)

def C(n: int, m: int):
    return A(n, m) // f(m)

inputs = input().split(" ")
n = int(inputs[0])
m = int(inputs[1])
if n == 0 and m == 0:
    print(0)
else:
    ans1 = A(n, n) * C(m, 1) * A(2, 2) * C(n + 1, 1) * A(n + 2, m - 1)
    ans2 = A(n, n) * A(n + 1, 2) * A(n + 3, m)
    print(ans1 + ans2)