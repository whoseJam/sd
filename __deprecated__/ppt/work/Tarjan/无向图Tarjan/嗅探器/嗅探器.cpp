#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<map>
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
const int inf=0x3f3f3f3f;
int low[N],dfn[N],prt[N],fa[N],n,m,a,b,Ans=inf;

struct Node{
	int to;
	int id;
}; 
vector<Node> G[N];

int cnt,tot;
void Link(int u,int v){
	++cnt;
	G[u].push_back({v,cnt});
	G[v].push_back({u,cnt});
}
void Tarjan(int u){
	dfn[u]=low[u]=++tot;
	for(auto& link:G[u]){
		int v=link.to;
		int id=link.id;
		if(prt[u]==id)continue;
		if(!dfn[v]){
			prt[v]=id;
			fa[v]=u;
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}else{
			low[u]=min(low[u],dfn[v]);
		}
	}
}

void climb(int u){
	int f=fa[u];
	if(f==a||u==a)return;
	if(low[u]>=dfn[f])Ans=min(Ans,f);
	climb(f);
}

int main(){
	n=read();
	while(true){
		int x=read(),y=read();
		if(x==0&&y==0)break;
		Link(x,y);
	}
	a=read();b=read();
	Tarjan(a);
	climb(b);
	if(Ans==inf)cout<<"No solution\n";
	else cout<<Ans<<'\n';
	return 0;
}
