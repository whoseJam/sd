#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<stack>
#include<queue>
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

const int N=500005;
const int inf=0x3f3f3f3f;
int low[N],dfn[N],bel[N],SCC,tot,n,m,ind[N],val[N],a[N],f[N],S,P;
vector<pair<int,int>> links;
vector<int>G[N];
vector<int>g[N];
vector<int>bar;
stack<int>stk;
bool ins[N];

void Link(int x,int y){
	G[x].push_back(y);
}

void Tarjan(int u){
	low[u]=dfn[u]=++tot;
	stk.push(u);ins[u]=true;
	for(int v:G[u]){
		if(!dfn[v]){
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}else if(ins[v])low[u]=min(low[u],dfn[v]);
	}
	if(low[u]==dfn[u]){
		SCC++;
		while(true){
			int cur=stk.top();
			stk.pop();
			ins[cur]=false;
			bel[cur]=SCC;
			val[SCC]+=a[cur];
			if(cur==u)break;
		}
	}
}

void Toposort(){
	queue<int>q;
	for(int i=1;i<=SCC;i++){
		if(ind[i]==0)q.push(i);
		f[i]=-inf;
	}
	f[bel[S]]=val[bel[S]];
	while(q.size()){
		int u=q.front();q.pop();
		for(int v:g[u]){
			ind[v]--;
			if(f[u]!=-inf)f[v]=max(f[v],f[u]+val[v]);
			if(ind[v]==0)q.push(v);
		}
	}
}

int main(){
	n=read();m=read();
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		Link(x,y);
		links.push_back(make_pair(x,y));
	}
	for(int i=1;i<=n;i++)a[i]=read();
	S=read();P=read();
	for(int i=1;i<=P;i++)bar.push_back(read());
	for(int i=1;i<=n;i++)
		if(!dfn[i])Tarjan(i);
	for(auto& link:links){
		int x=link.first;
		int y=link.second;
		if(bel[x]==bel[y])continue;
		g[bel[x]].push_back(bel[y]);
		ind[bel[y]]++;
	}
	Toposort();
	
	int ans=0;
	for(int b:bar)ans=max(ans,f[bel[b]]);
	cout<<ans;
	return 0;
}
