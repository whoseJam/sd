#include <iostream>

using namespace std;

typedef long long ll;

const ll Mod = 1e9 + 7;
const ll N = 1000005;
ll n;
ll a[N], b[N];
ll L[N], R[N];
ll sm0[N], sm1[N];
ll sta[N], top;

void BruteForce() {
    ll ans = 0;
    for (ll l = 1; l <= n; l++) {
        for (ll r = l; r <= n; r++) {
            ll mn = 1e12;
            ll sm = 0;
            for (ll k = l; k <= r; k++) {
                mn = min(mn, a[k]);
                sm = (sm + b[k]) % Mod;
            }
            ans = (ans + mn * sm % Mod) % Mod;
        }
    }
    printf("%lld\n", ans);
}

void Solve() {
    ll ans = 0;
    top = 0;
    for (ll i = 1; i <= n; i++) {
        while (top && a[sta[top]] > a[i]) top--;
        L[i] = top ? sta[top] + 1 : 1;
        sta[++top] = i;
    }
    top = 0;
    for (ll i = n; i >= 1; i--) {
        while (top && a[sta[top]] >= a[i]) top--;
        R[i] = top ? sta[top] - 1 : n;
        sta[++top] = i;
    }
    for (ll i = 1; i <= n; i++) {
        sm0[i] = (sm0[i - 1] + b[i]) % Mod;
        sm1[i] = (sm1[i - 1] + b[i] * i % Mod) % Mod;
    }
    for (int i = 1; i <= n; i++) {
        ll ml0 = a[i] * (R[i] - i + 1) % Mod * (sm0[i - 1] - sm0[L[i] - 1]) % Mod * (-L[i] + 1) % Mod;
        ll ml1 = a[i] * (R[i] - i + 1) % Mod * (sm1[i - 1] - sm1[L[i] - 1]) % Mod;
        ll mr0 = a[i] * (i - L[i] + 1) % Mod * (sm0[R[i]] - sm0[i]) % Mod * (R[i] + 1) % Mod;
        ll mr1 = a[i] * (i - L[i] + 1) % Mod * (sm1[R[i]] - sm1[i]) % Mod * (-1);
        ans = (ans + ml0 + ml1 + mr0 + mr1) % Mod;
        ans = (ans + a[i] * b[i] % Mod * (R[i] - i + 1) % Mod * (i - L[i] + 1) % Mod) % Mod;
    }
    ans = (ans % Mod + Mod) % Mod;
    printf("%lld\n", ans);
}

int main() {
    scanf("%lld", &n);
    for (ll i = 1; i <= n; i++) scanf("%lld", &a[i]);
    for (ll i = 1; i <= n; i++) scanf("%lld", &b[i]);
    // BruteForce();
    Solve();
    return 0;
}
