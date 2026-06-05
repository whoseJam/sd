#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

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

const int inf=1e9+7;
const int N=5000005;
int s[N],a[N],n,p;

int main(){
	n=read();p=read();
	for(int i=1;i<=n;i++)s[i]=read();
	for(int i=1,l,r,z;i<=p;i++){
		l=read();r=read();z=read();
		a[l]+=z;
		a[r+1]-=z;
	}
	int mn=inf;
	for(int i=1;i<=n;i++){
		a[i]+=a[i-1];
		mn=min(mn,a[i]+s[i]);
	}
	cout<<mn<<'\n';
	return 0;
}

