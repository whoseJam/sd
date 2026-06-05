#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<stack>
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
int low[N],dfn[N],prt[N],n,m,BCC;
vector<vector<int>> ans;
stack<int> stk;

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
	stk.push(u);
	for(auto& link:G[u]){
		int v=link.to;
		int id=link.id;
		if(prt[u]==id)continue;
		if(!dfn[v]){
			prt[v]=id;
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}else{
			low[u]=min(low[u],dfn[v]);
		}
	}
	if(low[u]==dfn[u]){
		ans.push_back({});
		while(true){
			int cur=stk.top();
			stk.pop();
			ans[BCC].push_back(cur);
			if(cur==u)break;
		}
		BCC++;
	}
}
int main(){
	n=read();m=read();
	for(int i=1;i<=m;i++)Link(read(),read());
	for(int i=1;i<=n;i++)
		if(!dfn[i])Tarjan(i);
	cout<<BCC<<'\n';
	for(int i=0;i<BCC;i++){
		cout<<ans[i].size()<<' ';
		for(auto v:ans[i])cout<<v<<' ';
		cout<<'\n';
	}
	return 0;
}
