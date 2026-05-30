#include<iostream>
#include<cstring>
#include<cstdio>
#include<stack>
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

const int N=1005;
const int R=1005;
int n,r,tot,eBCC,low[N],dfn[N],prt[N],ins[N],bel[N],deg[N];
stack<int>sta;

struct line{
	int Nxt,to;
}l[R*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Tarjan(int u){
	low[u]=dfn[u]=++tot;
	sta.push(u);ins[u]=1;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(prt[u]==v)continue;
		if(!dfn[v]){
			prt[v]=u;
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}else low[u]=min(low[u],dfn[v]);
	}
	if(low[u]==dfn[u]){
		eBCC++;
		while(true){
			int t=sta.top();
			sta.pop();
			bel[t]=eBCC;
			if(t==u)break;
		}
	}
}

int Count(){
	int ans=0;
	for(int u=1;u<=n;u++){
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(bel[u]!=bel[v]){
				deg[bel[u]]++;
			}
		}
	}
	for(int i=1;i<=eBCC;i++){
		if(deg[i]==1)ans++;
	}
	return (ans+1)/2;
}

int main(){
	n=read();r=read();
	for(int i=1,x,y;i<=r;i++){
		x=read();y=read();
		Link(x,y);
	}
	Tarjan(1);
	cout<<Count()<<'\n';
	return 0;
}

