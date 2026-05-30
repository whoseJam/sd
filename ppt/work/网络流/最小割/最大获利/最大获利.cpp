#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;
int N,M,gap[100005],dis[100005];

struct line
{
	int nextLine,to,flow;
}l[1000005];
int cnt=1,h[100005];

void addEdge(int u,int v,int f)
{
	l[++cnt].nextLine=h[u];l[cnt].to=v;l[cnt].flow=f;h[u]=cnt;
	l[++cnt].nextLine=h[v];l[cnt].to=u;l[cnt].flow=0;h[v]=cnt;
}

int DFS(int u,int maxFlow)
{
	int d,giveOut=0;
	if(u==N+M+2)return maxFlow;
	for(int i=h[u];i;i=l[i].nextLine)
	{
		int v=l[i].to;
		if(dis[v]+1==dis[u]&&l[i].flow>0)
		{
			d=DFS(v,min(maxFlow,l[i].flow));
			l[i].flow-=d;
			l[i^1].flow+=d;
			giveOut+=d;maxFlow-=d;
			if(!maxFlow||dis[1]==N+M+2)return giveOut;
		}
	}
	if(!(--gap[dis[u]]))dis[1]=N+M+2;
	gap[++dis[u]]++;
	return giveOut;
}

int SAP()
{
	int ans=0;
	memset(dis,0,sizeof(dis));
	memset(gap,0,sizeof(gap));
	gap[0]=N+M+2;
	while(dis[1]<N+M+2)ans+=DFS(1,0x3f3f3f3f);
	return ans;
}

int main()
{
	int x,y,val,sum=0;
	scanf("%d%d",&N,&M);
	for(int i=1;i<=N;i++)
	{
		scanf("%d",&val);
		addEdge(i+1,N+M+2,val);
	}
	for(int i=N+1;i<=N+M;i++)
	{
		scanf("%d%d%d",&x,&y,&val);
		x++;y++;sum+=val;
		addEdge(1,i+1,val);
		addEdge(i+1,x,0x3f3f3f3f);
		addEdge(i+1,y,0x3f3f3f3f);
	}
	printf("%d",sum-SAP());
	return 0;
}
