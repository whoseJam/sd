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

const int inf=0x3f3f3f3f;
const int N=305;
int n,m,T,G[N][N];

void Floyd(){
	for(int k=1;k<=n;k++)
		for(int i=1;i<=n;i++)
			for(int j=1;j<=n;j++){
				G[i][j]=min(G[i][j],max(G[i][k],G[k][j]));
			}
}

int main(){
	n=read();m=read();T=read();
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			if(i!=j)G[i][j]=inf;
	for(int i=1,s,e,h;i<=m;i++){
		s=read();e=read();h=read();
		G[s][e]=min(G[s][e],h);
	}
	Floyd();
	for(int i=1,a,b;i<=T;i++){
		a=read();b=read();
		if(G[a][b]==inf){
			cout<<"-1\n";
		}else cout<<G[a][b]<<"\n";
	}
	return 0;
}

