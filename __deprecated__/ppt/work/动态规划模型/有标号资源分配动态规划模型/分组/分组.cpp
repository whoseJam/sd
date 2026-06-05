#include<bits/stdc++.h>
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


const ll inf=0x3f3f3f3f;
const ll N=20;
ll n,a[N][N];
ll f[1<<16],v[1<<16];

bool contain(ll S,ll i){
	return (S>>i-1)&1;
}

int main(){
	n=read();
	for(ll i=1;i<=n;i++){
		for(ll j=1;j<=n;j++){
			a[i][j]=read();
		}
	}
	
	ll All=(1<<n)-1,ans=-inf;
	for(ll S=1;S<=All;S++){
		f[S]=-inf;
		for(ll i=1;i<=n;i++){
			if(!contain(S,i))continue;
			for(ll j=i+1;j<=n;j++){
				if(!contain(S,j))continue;
				v[S]+=a[i][j];
			}
		}
	}
	for(ll S=0;S<=All;S++){
		ll Rev=All-S;
		for(ll T=Rev;T;T=(T-1)&Rev){
			f[S|T]=max(f[S|T],f[S]+v[T]);
		}
	}
	cout<<f[All]<<'\n';
	return 0;
}
