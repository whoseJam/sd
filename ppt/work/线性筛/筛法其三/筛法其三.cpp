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
int prim[N],tot,f[N];
bool vis[N];

void Sieve(int n){
	for(int i=2;i<=n;i++){
		if(!vis[i]){
			prim[++tot]=i;
			f[i]=1;
		}
		for(int j=1;j<=tot&&i*prim[j]<=n;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0){
				f[i*prim[j]]=f[i];
				break;
			}
			f[i*prim[j]]=f[i]+1;
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


