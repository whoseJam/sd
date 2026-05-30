#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<deque>
using namespace std;

namespace FastIO{
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int inf=0x3f3f3f3f;
const int N=505;
int n,m,id[N][N],tot,dis[N*N];
char mp[N][N];

struct Node{
	int to,val;
};

vector<Node> G[N*N];

void Link(int u,int v,int w){
	G[u].push_back((Node){v,w});
	G[v].push_back((Node){u,w});
}

void Bfs01(){
	deque<int>q;
	q.push_back(id[1][1]);dis[1]=0;
	while(q.size()){
		int u=q.front();q.pop_front();
		for(int i=0;i<G[u].size();i++){
			int v=G[u][i].to;
			int w=G[u][i].val;
			if(dis[v]>dis[u]+w){
				dis[v]=dis[u]+w;
				if(w==0){
					q.push_front(v);
				}else if(w==1){
					q.push_back(v);
				}
			}
		}
	}
}

int main(){
	cin>>n>>m;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++)
			cin>>mp[i][j];
	for(int i=1;i<=n+1;i++)
		for(int j=1;j<=m+1;j++){
			id[i][j]=++tot;
			dis[tot]=inf;
		}
	for(int i=1;i<=n;i++){
		for(int j=1;j<=m;j++){
			if(mp[i][j]=='\\'){
				Link(id[i][j],id[i+1][j+1],0);
				Link(id[i+1][j],id[i][j+1],1);
			}else{
				Link(id[i][j],id[i+1][j+1],1);
				Link(id[i+1][j],id[i][j+1],0);
			}
		}
	}
	Bfs01();
	if(dis[id[n+1][m+1]]==inf)cout<<"NO SOLUTION";
	else cout<<dis[id[n+1][m+1]];
	return 0;
}

