#include<iostream>
#include<cstring>
#include<cstdio>
#include<map>
using namespace std;

using ll=long long;

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

const ll Mod=998244353;
const ll N=100005;
ll n,P[N];

ll Fpow(ll a,ll b){
	ll ans=1;
	while(b){
		if(b&1)ans=ans*a%Mod;
		b>>=1;a=a*a%Mod;
	}
	return ans;
}

struct Expr{
	ll a,b; // ax+b
};

Expr operator +(const Expr& a,const Expr& b){
	return {(a.a+b.a)%Mod,(a.b+b.b)%Mod};
}

Expr operator +(const Expr& a,ll b){
	return {a.a,a.b+b};
}

Expr operator *(const Expr& a,ll b){
	return {a.a*b%Mod,a.b*b%Mod};
}

int main(){
	n=read();
	for(ll i=1,x,y;i<=n;i++){
		x=read();y=read();
		P[i]=x*Fpow(y,Mod-2)%Mod;
	}
	Expr cur={0,0};
	for(ll k=n-1;k>=0;k--){
		Expr tmp={1,1};
		cur=tmp*P[k+1]+(cur+1)*(1-P[k+1]);
	}
	cur.a--;
	// cur.a * x + cur.b = 0
	/// x = - cur.b / cur.a
	ll ans=-cur.b*Fpow(cur.a,Mod-2)%Mod;
	ans=(ans%Mod+Mod)%Mod;
	cout<<ans;
	return 0;
}
