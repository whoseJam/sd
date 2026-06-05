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

const ll N=10;
ll f[N][1<<9][N*N];
ll n,k,siz[1<<9];
vector<ll>validS;

int main(){
	n=read();k=read();
	ll All=(1<<n)-1;
	for(ll S=0;S<=All;S++){
		if(S)siz[S]=siz[S>>1]+(S&1);
		if(S&(S<<1))continue;
		validS.push_back(S);
	}
	f[0][0][0]=1;
	for(ll i=1;i<=n;i++){
		for(auto S:validS){
			for(ll cnt=0;cnt<=k;cnt++){
				if(cnt<siz[S])continue;
				ll lastCnt=cnt-siz[S];
				for(auto T:validS){
					if(S&T)continue;
					if(S&(T>>1))continue;
					if(S&(T<<1))continue;
					f[i][S][cnt]+=f[i-1][T][lastCnt];
				}
			}
		}
	}
	ll ans=0;
	for(auto S:validS)
		ans+=f[n][S][k];
	cout<<ans;
	return 0;
}

