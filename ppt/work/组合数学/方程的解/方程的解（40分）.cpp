#include<iostream>
#include<cstring>
#include<cstdio>
typedef long long ll;
using namespace std;

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

const ll N=1005;
bool used[N];

ll Fpow(ll a,ll b,ll p){
	ll ans=1;
	while(b){
		if(b&1)ans=ans*a%p;
		b>>=1;a=a*a%p;
	}
	return ans;
}

// 100 points needs bigint
__int128 C(ll n,ll m){
	__int128 ans=1;
	for(ll i=m+1;i<=n;i++){
		ans*=i;
		for(ll j=1;j<=n-m;j++){
			if(!used[j]&&ans%j==0){
				ans/=j;
				used[j]=1;
			}
		}
	}
	return ans;
} 

void output(__int128 x){
	if(x==0)return;
	output(x/10);
	ll tmp=x%10;
	cout<<tmp;
}

int main(){
	ll k=read(),x=read();
	ll result=Fpow(x,x,1000);
	// a[1]+a[2]+...+a[k]=result
	
	output(C(result-1,k-1));
	return 0;
}

