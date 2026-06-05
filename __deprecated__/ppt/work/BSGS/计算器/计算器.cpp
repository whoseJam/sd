#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>
#include <map>

using namespace std;

typedef long long ll;

ll T, K;

ll Fpow(ll a, ll b, ll p) {
    ll ans = 1;
    while (b) {
        if (b & 1) ans = ans * a % p;
        b >>= 1; a = a * a % p;
    }
    return ans;
}

ll Exgcd(ll a, ll b, ll& x0, ll& y0) {
    if (!b) {
        x0 = 1;
        y0 = 0;
        return a;
    }
    ll x1, y1, d = Exgcd(b, a % b, x1, y1);
    x0 = y1;
    y0 = x1 - (a / b) * y1;
    return d;
}

ll BSGS(ll a, ll b, ll p) {
    a %= p; b %= p;
    if (a == 0) {
        if (b == 0) return 1;
        return -1;
    } else if (b == 0) {
        return -1;
    }
    
    ll lim = ceil(sqrt(p));
    map<ll, ll> table;
    for (ll i = 0, cur = 1; i <= lim; i++, cur = cur * a % p) {
        if (table.find(cur) == table.end())
            table[cur] = i;
    }
    // a^(i*lim+j) = b
    // A*(a^j) = b
    // (a^j) = b*A^(-1)
    ll A = Fpow(a, lim, p), invA = Fpow(A, p - 2, p);
    for (ll i = 0, cur = 1; i <= lim; i++, cur = cur * invA % p) {
        ll res = b * cur % p;
        if (table.find(res) != table.end()) {
            return i * lim + table[res];
        }
    }
    return -1;
}

void Solve1() {
    ll y, z, p;
    scanf("%lld%lld%lld", &y, &z, &p);
    cout << Fpow(y, z, p) << '\n';
}

// xy=z (mod p)
void Solve2() {
    ll y, z, p, x0, y0, d;
    scanf("%lld%lld%lld", &y, &z, &p);
    d = Exgcd(y, p, x0, y0);
    if (z % d != 0) {
        cout << "Orz, I cannot find x!\n";
        return;
    }
    x0 *= (z / d);
    x0 = (x0 % (p / d) + (p / d)) % (p / d);
    cout << x0 << '\n';
}

// y^x=z (mod p)
void Solve3() {
    ll y, z, p;
    scanf("%lld%lld%lld", &y, &z, &p);
    ll ans = BSGS(y, z, p);
    if (ans == -1) {
        cout << "Orz, I cannot find x!\n";
        return;
    }
    cout << ans << '\n';
}

int main() {
    scanf("%lld%lld", &T, &K);
    for (int i = 1; i <= T; i++) {
        if (K == 1) Solve1();
        else if (K == 2) Solve2();
        else if (K == 3) Solve3();
    }
    return 0;
}
