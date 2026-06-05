#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
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

ll Exgcd(ll a,ll b,ll& x0,ll& y0){
	if(!b){x0=1;y0=0;return a;}
	ll x1,y1;
	ll d=Exgcd(b,a%b,x1,y1);
	x0=y1;
	y0=x1-(a/b)*y1;
	return d;
}

void Solve(){
	ll a=read(),b=read(),c=1,x0,y0;
	ll d=Exgcd(a,b,x0,y0);
	if(c%d!=0){
		printf("-1\n");
		return;
	}
	ll k=c/d;x0*=k;y0*=k;
	x0=(x0%(b/d)+(b/d))%(b/d);
	if(x0==0){
		x0+=(b/d);
	}
	cout<<x0<<'\n';
}

int main(){
	ll Case=1;
	while(Case--)Solve();
	return 0;
}

