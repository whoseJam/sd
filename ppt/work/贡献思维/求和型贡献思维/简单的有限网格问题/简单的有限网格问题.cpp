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

const ll Mod=1e9+7;
ll n,m,k,x,y;

ll FastMul(ll a,ll b){
	ll ans=0;
	while(b){
		if(b&1)ans=(ans+a)%Mod;
		b>>=1;a=(a+a)%Mod;
	}
	return ans;
}

ll Count(ll a,ll b){
	ll ans=0;
	if(a<x&&b<y){
		ans=a+b;
	}
	if(a<x&&b>y){
		ans=a+(m-b+1);
	}
	if(a>x&&b<y){
		ans=(n-a+1)+b;
	}
	if(a>x&&b>y){
		ans=(n-a+1)+(m-b+1);
	}
	if(a<x&&b==y){
		ans=FastMul(n-a-1,a)+FastMul(a,n+m-2);
	}
	if(a>x&&b==y){
		ans=FastMul(a-2,n-a+1)+FastMul(n-a+1,n+m-2);
	}
	if(a==x&&b<y){
		ans=FastMul(m-b-1,b)+FastMul(b,n+m-2);
	}
	if(a==x&&b>y){
		ans=FastMul(b-2,m-b+1)+FastMul(m-b+1,n+m-2);
	}
	return ans%Mod;
}

int main(){
	n=read();m=read();k=read();
	x=read();y=read();
	
	ll ans=0;
	for(ll i=1;i<=k;i++){
		ll p=read();
		ll q=read();
		ans=(ans+Count(p,q))%Mod;
	}
	cout<<ans;
	return 0;
}

