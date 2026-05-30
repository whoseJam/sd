#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef long long ll;

namespace FastIO{
	const ll L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline ll read(){
		ll s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const ll N=10000005;
ll n,m,D[N],tmp[N];

int main(){
	n=read();m=read();
	for(ll i=1,l,r,s,e;i<=m;i++){
		l=read();r=read();s=read();e=read();
		if(l==r){tmp[l]+=s;continue;}
		ll d=(e-s)/(r-l);
		D[l]+=s;
		D[l+1]+=d-s;
		D[r+1]+=-e-d;
		D[r+2]+=e;
	}
	for(ll i=1;i<=n;i++)D[i]+=D[i-1];
	for(ll i=1;i<=n;i++)D[i]+=D[i-1];
	for(ll i=1;i<=n;i++)D[i]+=tmp[i];
	
	ll ans=0,mx=0;
	for(ll i=1;i<=n;i++){
		ans^=D[i];
		mx=max(mx,D[i]);
	}
	cout<<ans<<' '<<mx<<'\n';
	return 0;
}

