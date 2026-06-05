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

const ll Mod=100003;

ll Fpow(ll a,ll b){
	ll ans=1;
	while(b){
		if(b&1)ans=ans*a%Mod;
		b>>=1;a=a*a%Mod;
	}
	return ans;
}

int main(){
	ll m=read(),n=read();
	ll A=Fpow(m,n);
	ll B=m*Fpow(m-1,n-1)%Mod;
	ll ans=((A-B)%Mod+Mod)%Mod;
	cout<<ans;
	return 0;
}

