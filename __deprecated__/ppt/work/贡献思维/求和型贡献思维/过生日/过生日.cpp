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
const ll N=100005;
ll n,a[N];

ll Fpow(ll a,ll b){
	ll ans=1;
	while(b){
		if(b&1)ans=ans*a%Mod;
		b>>=1;a=a*a%Mod;
	}
	return ans;
}

int main(){
	n=read();
	for(ll i=1;i<=n;i++){
		a[i]=read();
	}
	
	ll ans=0;
	for(ll i=1;i<=n;i++){
		if(i*2+1>=n&&i*2<=n){
			ans=ans+Fpow(2,n-2)*(a[i]^a[i*2]);
		}else if(i*2+1<=n){
			ll x=a[i];
			ll y=a[i*2];
			ll z=a[i*2+1];
			ans=ans+Fpow(2,n-3)*(x^y);
			ans=ans+Fpow(2,n-3)*(x^z);
			ans=ans+Fpow(2,n-3)*(y^z);
			ans=ans+Fpow(2,n-3)*(x^y^z);
		}
		ans%=Mod;
	}
	cout<<ans;
	return 0;
}

