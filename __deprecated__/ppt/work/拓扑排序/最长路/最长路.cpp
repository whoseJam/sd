#include<bits/stdc++.h>
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
const int N=1505;
const int M=50005;
int n,m,dis[N];

struct line{
	int Nxt,to,val;
}l[M];
int h[N],Ind[N],cnt;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;Ind[v]++;
} 

void Toposort(){
	queue<int>q;
	for(int i=1;i<=n;i++)dis[i]=-inf;
	dis[1]=0;
	for(int i=1;i<=n;i++)
		if(!Ind[i])q.push(i);
	while(q.size()){
		int u=q.front();q.pop();
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(dis[u]!=-inf)dis[v]=max(dis[v],dis[u]+l[i].val);
			if(!(--Ind[v]))q.push(v);
		}
	}
}

int main(){
	n=read();m=read();
	for(int i=1,x,y,w;i<=m;i++){
		x=read();y=read();w=read();
		Link(x,y,w);
	}
	Toposort();
	if(dis[n]==-inf)cout<<-1<<'\n';
	else cout<<dis[n]<<'\n';
	return 0;
}

