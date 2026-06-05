#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;
typedef long long ll;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

int main(){
	int n,m,p;
	read();n=read();m=read();p=read();
	ll ans=1;
	for(int i=n-2*m+2;i<=n-m+1;i++)
		ans=(ll)ans*i%p;
	cout<<ans;
	return 0;
}

