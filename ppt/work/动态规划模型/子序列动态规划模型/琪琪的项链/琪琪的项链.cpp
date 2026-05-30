#include<iostream>
#include<cstring>
#include<cstdio>
#include<map>
#include<set>
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

const ll N=1000005;
ll n,a[N],f[N],is_last[N],Mod,Ans;

int main(){
	n=read();Mod=read();
	for(ll i=1;i<=n;i++)a[i]=read();
	set<ll>S;
	for(ll i=n;i>=1;i--){
		if(S.find(a[i])==S.end())is_last[i]=true;
		S.insert(a[i]);
	}
	
	map<ll,ll>pv;
	ll sum=0;
	for(ll i=1;i<=n;i++){
		f[i]=(sum+1)%Mod;
		if(pv.find(a[i])!=pv.end()){
			sum-=pv[a[i]];
			pv[a[i]]=f[i];
			sum+=pv[a[i]];
		}else{
			pv[a[i]]=f[i];
			sum+=pv[a[i]];
		}
		if(is_last[i])Ans=(Ans+f[i])%Mod;
	}
    cout<<Ans;
	return 0;
}
