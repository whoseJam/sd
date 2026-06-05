#include<iostream>
#include<cstring>
#include<cstdio>
#include<map>
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

const ll DIM=55;
ll linearSet[100]; 

bool insert(ll v){
	for(ll i=DIM-1;i>=0;i--){
		if((v>>i)&1){
			if(linearSet[i]){
				v^=linearSet[i];
			}else{
				linearSet[i]=v;
				return true;
			}
		}
	}
	return false;
}

int main(){
	ll n=read();
	for(ll i=1;i<=n;i++)insert(read());
	
	ll ans=0;
	for(ll i=DIM-1;i>=0;i--){
		if(!linearSet[i])continue;
//		if(ans<(ans^linearSet[i])){
//			ans^=linearSet[i];
//		}
		if(((ans>>i)&1)==0){
			ans^=linearSet[i];
		} 
	}
	cout<<ans;
	return 0;
}
