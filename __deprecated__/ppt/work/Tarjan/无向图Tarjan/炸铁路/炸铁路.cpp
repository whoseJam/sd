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
int low[N],dfn[N],prt[N],n,m;

struct Node{
	int to;
	int id;
}; 
vector<Node> G[N];
vector<pair<int,int>> ans;
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
			Tarjan(v);
			low[u]=min(low[u],low[v]);
			if(low[v]==dfn[v]){
				if(u<v)ans.push_back(make_pair(u,v));
				else ans.push_back(make_pair(v,u));
			}
		}else{
			low[u]=min(low[u],dfn[v]);
		}
	}
}
int main(){
	n=read();m=read();
	for(int i=1;i<=m;i++)Link(read(),read());
	Tarjan(1);
	sort(ans.begin(),ans.end());
	for(auto& link:ans){
		cout<<link.first<<' '<<link.second<<'\n';
	}
	return 0;
}
