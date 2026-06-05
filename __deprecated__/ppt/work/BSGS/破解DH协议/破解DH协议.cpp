#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>
#include <map>

using namespace std;

typedef long long ll;

ll g, P, n;

ll Fpow(ll a, ll b, ll p) {
    ll ans = 1;
    while (b) {
        if (b & 1) ans = ans * a % p;
        b >>= 1; a = a * a % p;
    }
    return ans;
}

ll BSGS(ll a, ll b, ll p) {
    ll lim = ceil(sqrt(p));
    map<ll, ll> table;
    for (ll i = 0, cur = 1; i <= lim; i++, cur = cur * a % p) {
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

void Solve() {
    ll A, B;
    scanf("%lld%lld", &A, &B);
    ll a = BSGS(g, A, P); // g^a = A
    ll K = Fpow(B, a, P);
    cout << K << '\n';
}

int main() {
    scanf("%lld%lld", &g, &P);
    scanf("%lld", &n);
    for (ll i = 1; i <= n; i++) {
        Solve();
    }
    return 0;
}
