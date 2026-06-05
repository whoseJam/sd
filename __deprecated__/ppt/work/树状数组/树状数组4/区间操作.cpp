#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
#include<map>
using namespace std;
using ll=long long;
namespace FastIO{
	inline ll read(){
		ll s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;
const ll N=100005;
ll a[N],n,q;
struct TREE{
	ll s[N];
	ll lowbit(ll x){
		return x&(-x);
	}
	void add(ll x,ll d){
		for(ll i=x;i<=n;i+=lowbit(i))
			s[i]+=d;
	}
	ll sum(ll x){
		ll ans=0;
		for(ll i=x;i>0;i-=lowbit(i))
			ans+=s[i];
		return ans;
	}
}T2,T1,T0;
void Add(ll k,ll d){
	T0.add(k,d);
	T1.add(k,d*k);
	T2.add(k,d*k*k);
}
ll Query(ll n){
	ll a0=T0.sum(n)*(n*n+3*n+2);
	ll a1=T1.sum(n)*(-2*n-3);
	ll a2=T2.sum(n);
	return (a0+a1+a2)/2;
}
int main(){
	n=read();
	for(ll i=1;i<=n;i++)a[i]=read();
	for(ll i=1;i<=n;i++)Add(i,a[i]-a[i-1]);
	q=read();
	for(ll i=1,l,r,d;i<=q;i++){
		char opt[3];
		scanf("%s",opt);
		if(opt[0]=='A'){
			l=read();r=read();d=read();
			Add(l,+d);
			Add(r+1,-d);
		}else{
			l=read();r=read();
			cout<<Query(r)-Query(l-1)<<'\n';
		}
	}
	return 0;
}

