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

const ll N=100005;
ll n,w,c[N];

ll lowbit(ll x){
	return x&(-x);
}

void add(ll x,ll d){
	for(ll i=x;i<=n;i+=lowbit(i))
		c[i]+=d;
}

ll sum(ll x){
	ll ans=0;
	for(ll i=x;i>0;i-=lowbit(i))
		ans+=c[i];
	return ans;
}

ll sum(ll l,ll r){
	return sum(r)-sum(l-1);
}

int main(){
	n=read();w=read();
	char opt[3];
	for(ll i=1,a,b;i<=w;i++){
		scanf("%s",opt);a=read();b=read();
		if(opt[0]=='x')add(a,b);
		else cout<<sum(a,b)<<'\n';
	}
	return 0;
}

