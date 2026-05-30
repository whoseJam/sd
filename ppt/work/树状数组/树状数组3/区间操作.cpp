#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
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
ll n,q,a[N],d[N];

struct TArray{
	ll c[N];
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
}Di,iDi;

ll S(ll k){
	return (k+1)*Di.sum(k)-iDi.sum(k);
}

void add(ll k,ll d){	// D[k] += d
	Di.add(k,d);		// D[k] += d
	iDi.add(k,k*d);		// k*(D[k]+d) = k*D[k] + k*d
}

int main(){
	n=read();q=read();
	for(ll i=1;i<=n;i++){
		a[i]=read();
		d[i]=a[i]-a[i-1];
		Di.add(i,d[i]);
		iDi.add(i,i*d[i]);
	}
	
	char opt[3];
	for(ll i=1,a,b,c;i<=q;i++){
		scanf("%s",opt);
		if(opt[0]=='Q'){
			a=read();b=read();
			cout<<S(b)-S(a-1)<<'\n';
		}else{
			// A[a], A[a+1]...A[b] (+c)
			// => D[a] = D[a] (+c)  and  [b+1] = D[b+1] (-c)
			a=read();b=read();c=read();
			add(a,c);
			if(b+1<=n)add(b+1,-c);
		}
	}
	return 0;
}

