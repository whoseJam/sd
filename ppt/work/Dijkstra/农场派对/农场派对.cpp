#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<queue>
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
const int N=1005;
const int M=100005;
typedef pair<int,int> pa;

int dis1[N],vis1[N];
int dis2[N],vis2[N];
int n,m;

struct Node{
	int to,val;
};

vector<Node> G1[N];
vector<Node> G2[N]; 

void Link(vector<Node>* G,int u,int v,int w){
	G[u].push_back((Node){v,w});
}

void Dijkstra(vector<Node>* G,int* dis,int* vis,int S){
	for(int i=1;i<=n;i++)
		dis[i]=inf;
	dis[S]=0;
	priority_queue<pa,vector<pa>,greater<pa> >q;
	q.push(make_pair(0,S));
	while(q.size()){
		int u=q.top().second;q.pop();
		if(vis[u])continue;vis[u]=1;
		for(int i=0,v;i<G[u].size();i++){
			v=G[u][i].to;
			if(dis[v]>dis[u]+G[u][i].val){
				dis[v]=dis[u]+G[u][i].val;
				q.push(make_pair(dis[v],v));
			}
		}
	}
}

int main(){
	n=read();m=read();int X=read();
	for(int i=1,x,y,w;i<=m;i++){
		x=read();y=read();w=read();
		Link(G1,x,y,w);
		Link(G2,y,x,w);
	}
	Dijkstra(G1,dis1,vis1,X);
	Dijkstra(G2,dis2,vis2,X);
	int ans=0;
	for(int i=1;i<=n;i++)
		ans=max(ans,dis1[i]+dis2[i]);
	cout<<ans<<'\n';
	return 0;
}
