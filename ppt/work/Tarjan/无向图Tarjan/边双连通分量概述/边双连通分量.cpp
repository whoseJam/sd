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

const int N=500005;
const int M=2000005;
int low[N],dfn[N],prt[N],bel[N],tot,eBCC;
int n,m;
stack<int>stk;
vector<vector<int>> ans;

struct line{
	int Nxt,to;
}l[M*2];
int h[N],cnt=1;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Tarjan(int u){
	dfn[u]=low[u]=++tot;
	stk.push(u);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if((prt[u]^1)!=i){
			if(!dfn[v]){
				prt[v]=i;
				Tarjan(v);
				low[u]=min(low[u],low[v]);
			}else low[u]=min(low[u],dfn[v]);
		}
	}
	if(low[u]==dfn[u]){
		ans.push_back({});
		while(true){
			int cur=stk.top();
			ans[eBCC].push_back(cur);
			stk.pop();
			bel[cur]=eBCC;
			if(cur==u)break;
		}
		eBCC++;
	}
}

int main(){
	n=read();m=read();
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		Link(x,y);
	}
	for(int i=1;i<=n;i++)
		if(!dfn[i])Tarjan(i);
	cout<<eBCC<<'\n';
	for(int i=0;i<eBCC;i++){
		cout<<ans[i].size()<<' ';
		for(auto it:ans[i]){
			cout<<it<<' ';
		}cout<<'\n';
	}
	return 0;
}

