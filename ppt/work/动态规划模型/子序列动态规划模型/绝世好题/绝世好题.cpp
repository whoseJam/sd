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

const int N=100005;
int f[N],mf[32],a[N],ans,n;

int main(){
	n=read();
	for(int i=1;i<=n;i++)a[i]=read();
	for(int i=1;i<=n;i++){
		f[i]=1;
		for(int k=0;k<31;k++)
			if((a[i]>>k)&1)f[i]=max(f[i],mf[k]+1);
		for(int k=0;k<31;k++)
			if((a[i]>>k)&1)mf[k]=max(f[i],mf[k]);
		ans=max(ans,f[i]);
	}
	cout<<ans;
	return 0;
}

