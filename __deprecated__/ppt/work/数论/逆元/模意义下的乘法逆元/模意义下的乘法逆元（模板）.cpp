#include<bits/stdc++.h>
using namespace std;
typedef long long ll;

ll read(){
	ll s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const ll N=3000005;
ll inv[N];

int main(){
	ll n=read(),Mod=read();inv[1]=1;
	for(ll i=2;i<=n;i++)
		inv[i]=((-Mod/i)*inv[Mod%i]%Mod+Mod)%Mod;
	for(ll i=1;i<=n;i++)
		cout<<inv[i]<<'\n';
	return 0;
}

