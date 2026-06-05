#include<iostream>
#include<vector>
#include<cstdio>
#include<queue>

using namespace std;

const int M=200005;
const int N=50005;
const int inf=0x3f3f3f3f;
typedef pair<int,int> pa;
int n,m,pos[6],dist[6][N],vis[6][N];
int seq[10],used[10];
int ans=inf;

struct line{
	int Nxt,to,val;
}l[M];
int cnt,h[N];

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

void Dijkstra(int s,int flg){
	priority_queue<pa,vector<pa>,greater<pa> >q;
	for(int i=0;i<=N;i++){
		dist[flg][i]=inf;
		vis[flg][i]=0;
	}
	dist[flg][s]=0;q.push(make_pair(dist[flg][s],s));
	while(q.size()){
		int u=q.top().second;
		q.pop();
		if(vis[flg][u])continue;
		vis[flg][u]=1;
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(dist[flg][v]>dist[flg][u]+l[i].val){
				dist[flg][v]=dist[flg][u]+l[i].val;
				q.push(make_pair(dist[flg][v],v));
			}
		}
	}
}

int getDist(){
	int sum=dist[0][pos[seq[1]]];
	for(int i=1;i<=4;i++)
		sum=sum+dist[seq[i]][pos[seq[i+1]]];
	return sum;
}

void Dfs(int dep){
	if(dep==6){
		ans=min(ans,getDist());
		return;
	}
	for(int i=1;i<=5;i++){
		if(!used[i]){
			used[i]=1;
			seq[dep]=i;
			Dfs(dep+1);
			used[i]=0;
		}
	}
}

int main(){
	scanf("%d%d%d%d%d%d%d",&n,&m,&pos[1],&pos[2],&pos[3],&pos[4],&pos[5]);
	for(int i=1,u,v,w;i<=m;i++){
		scanf("%d%d%d",&u,&v,&w);
		Link(u,v,w);
		Link(v,u,w);
	}
	Dijkstra(1,0);
	Dijkstra(pos[1],1);
	Dijkstra(pos[2],2);
	Dijkstra(pos[3],3);
	Dijkstra(pos[4],4);
	Dijkstra(pos[5],5);
	Dfs(1);
	printf("%d",ans);
	return 0;
}
