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

const int N=1000005;
int prim[N],f[N],g[N],h[N],tot;
bool vis[N];

void Sieve(int n){
	for(int i=2;i<=n;i++){
		if(!vis[i]){
			prim[++tot]=i;
			f[i]=1+i;
			g[i]=1+i;
			h[i]=i;
		}
		for(int j=1;j<=tot&&i*prim[j]<=n;j++){
			vis[i*prim[j]]=1;
			int x=i*prim[j];
			if(i%prim[j]==0){
				h[x]=h[i]*prim[j];
				g[x]=g[i]+h[x];
				f[x]=f[i]/g[i]*g[x];
				break;
			}
			f[x]=(1+prim[j])*f[i];
			g[x]=1+prim[j];
			h[x]=prim[j];
		}
	}
}

int main(){
	Sieve(1000000);
	int T=read();
	while(T--){
		cout<<f[read()]<<"\n";
	}
	return 0;
}
