#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>
#include <map>

using namespace std;

typedef long long ll;

ll T;

ll Fpow(ll a, ll b, ll p) {
    ll ans = 1;
    while (b) {
        if (b & 1) ans = ans * a % p;
        b >>= 1; a = a * a % p;
    }
    return ans;
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

ll Inv(ll x, ll p) {
    x = (x % p + p) % p;
    return Fpow(x, p - 2, p);
}

ll gcd(ll a, ll b) {
    if (!b) return a;
    return gcd(b, a % b);
}

void Solve() {
    ll p, a, b, x1, t;
    scanf("%lld%lld%lld%lld%lld", &p, &a, &b, &x1, &t);
    
    if (x1 == t) {
        cout << "1\n";
        return;
    } else if (a == 1) {
        t = ((t - x1) % p + p) % p;
        if (t % gcd(b, p) != 0) {
            cout << "-1\n";
        } else {
            if ((t * Inv(b, p) + 1) % p == 0) {
                cout << p << "\n";
            } else {
                cout << (t * Inv(b, p) + 1) % p << "\n";
            }
        }
        return;
    } else if (a == 0) {
        if (b == t) {
            cout << "2\n";
        } else {
            cout << "-1\n";
        }
        return;
    }
    
    ll tmp1 = ((1 - a) % p + p) % p;
    ll tmp2 = b * Inv(tmp1, p) % p;
    ll tmp3 = t - tmp2;
    ll tmp4 = ((x1 - tmp2) % p + p) % p;
    ll tmp5 = tmp3 * Inv(tmp4, p);
    tmp5 = (tmp5 % p + p) % p;
    ll n = BSGS(a, tmp5, p);
    if (n == -1) {
        cout << -1 << '\n';
    } else {
        cout << n + 1 << '\n';
    }
}

int main() {
    scanf("%lld", &T);
    for (int i = 1; i <= T; i++) {
        Solve();
    }
    return 0;
}
