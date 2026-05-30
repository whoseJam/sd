#include<algorithm>
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
const int N=205;
int d[N][N],n,m;

struct city{
	int u,t;
}C[N];

void Floyd(int u){
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++)
			d[i][j]=min(d[i][j],d[i][u]+d[u][j]);
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++){
		C[i].u=i-1;
		C[i].t=read();
	}
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++)
			if(i!=j)d[i][j]=inf;
	for(int i=1,x,y,w;i<=m;i++){
		x=read();y=read();w=read();
		d[x][y]=d[y][x]=w;
	}
	
	int q=read(),cur=0;
	for(int i=1,x,y,t;i<=q;i++){
		x=read();y=read();t=read();
		while(C[cur+1].t<=t&&cur+1<=n){
			cur++;
			Floyd(C[cur].u);
		}
		if(x+1<=cur&&y+1<=cur&&d[x][y]!=inf)cout<<d[x][y]<<'\n';
		else cout<<-1<<'\n';
	}
	return 0;
}

