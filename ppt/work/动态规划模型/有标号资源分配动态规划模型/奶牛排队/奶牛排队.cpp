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

const ll N=17;
ll n,s[N],k,f[N][1<<16];

bool contain(ll S,ll i){
	return (S>>i-1)&1;
}

void print(ll T){
	for(ll i=n;i>=1;i--){
		cout<<contain(T,i);
	}
}

int main(){
	n=read();k=read();
	for(ll i=1;i<=n;i++)s[i]=read();
	for(ll i=1;i<=n;i++)f[i][1<<i-1]=1;
	ll All=(1<<n)-1;
	for(ll S=1;S<=All;S++){
		for(ll i=1;i<=n;i++){
			if(!contain(S,i))continue;
			if(!f[i][S])continue;
			for(ll j=1;j<=n;j++){
				if(contain(S,j))continue;
				if(abs(s[i]-s[j])<=k)continue;
				f[j][S|(1<<j-1)]+=f[i][S];
			}
		}
	}
	ll ans=0;
	for(ll i=1;i<=n;i++)ans+=f[i][All];
	cout<<ans;
	return 0;
}

