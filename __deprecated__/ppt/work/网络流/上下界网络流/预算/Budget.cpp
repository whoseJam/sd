#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;
int N,M,C,s,t,S,T,Down[1005],Max[205][205],Min[205][205];
int dis[1005],gap[1005],res[205][205];

struct line
{
	int nextLine,to,flow,down;
}l[1000005];
int cnt,h[1005];

void addEdge(int u,int v,int f,int D)
{
	l[++cnt].nextLine=h[u];l[cnt].to=v;l[cnt].flow=f;l[cnt].down=D;h[u]=cnt;
	l[++cnt].nextLine=h[v];l[cnt].to=u;l[cnt].flow=0;h[v]=cnt;
}

void Clear()	//realS=N+M+3,realT=realS+1,s=N+M+1,t=N+M+2
{
	cnt=1;
	memset(l,0,sizeof(l));
	memset(h,0,sizeof(h));
	memset(Down,0,sizeof(Down));
	memset(Max,0x3f3f3f,sizeof(Max));
	memset(Min,0,sizeof(Min));
}

int DFS(int u,int maxFlow)
{
	int d,giveOut=0;
	if(u==T)return maxFlow;
	for(int i=h[u];i;i=l[i].nextLine)
	{
		int v=l[i].to;
		if(dis[v]+1==dis[u]&&l[i].flow>0)
		{
			d=DFS(v,min(maxFlow,l[i].flow));
			l[i].flow-=d;
			l[i^1].flow+=d;
			giveOut+=d;maxFlow-=d;
			if(!maxFlow||dis[S]==N+M+4)return giveOut;
		}
	}
	if(!(--gap[dis[u]]))dis[S]=N+M+4;
	gap[++dis[u]]++;
	return giveOut;
}

int SAP()
{
	int ans=0;
	memset(gap,0,sizeof(gap));
	memset(dis,0,sizeof(dis));
	gap[0]=M+N+4;
	while(dis[S]<M+N+4)ans+=DFS(S,0x3f3f3f3f);
	return ans;
}

int main()
{
	int Case,tmp,t1,t2,num;
	char Tu;
	scanf("%d",&Case);
	while(Case--)
	{
		scanf("%d%d",&N,&M);
		Clear();s=N+M+1,t=N+M+2,S=N+M+3,T=N+M+4;
		for(int i=1;i<=N;i++)
		{
			scanf("%d",&tmp);
			addEdge(s,i,0,tmp);
			Down[i]+=tmp;
			Down[s]-=tmp;
		}
		for(int i=N+1;i<=N+M;i++)
		{
			scanf("%d",&tmp);
			addEdge(i,t,0,tmp);
			Down[i]-=tmp;
			Down[t]+=tmp;
		}
		scanf("%d",&C);
		int x1,x2,y1,y2,UP,DOWN;
		for(int i=1;i<=C;i++)
		{
			cin>>t1>>t2>>Tu>>num;
			if(Tu=='=')UP=DOWN=num;
			if(Tu=='<')UP=num-1,DOWN=0;
			if(Tu=='>')UP=0x3f3f3f3f,DOWN=num+1;
			if(t1==0)x1=1,x2=N;
			else x1=x2=t1;
			if(t2==0)y1=1,y2=M;
			else y1=y2=t2;
			for(int i=x1;i<=x2;i++)
				for(int j=y1;j<=y2;j++)
					Max[i][j]=min(Max[i][j],UP),Min[i][j]=max(Min[i][j],DOWN);
		}
		
		int flag=0,all=0;
		for(int i=1;i<=N;i++)
			for(int j=1;j<=M;j++)
			{
				if(Min[i][j]>Max[i][j])flag=1;
				addEdge(i,j+N,Max[i][j]-Min[i][j],Min[i][j]);
				Down[i]-=Min[i][j];
				Down[j+N]+=Min[i][j];
			}
		addEdge(t,s,0x3f3f3f3f,0);
		if(flag)
		{
			printf("IMPOSSIBLE\n\n");
			continue;
		}
		for(int i=1;i<=N+M+2;i++)
		{
			if(Down[i]>0)addEdge(S,i,Down[i],0),all+=Down[i];
			else addEdge(i,T,-Down[i],0);
		}
		
		if(SAP()==all)
		{
			for(int i=1;i<=N;i++)
				for(int j=h[i];j;j=l[j].nextLine)
					if(N+1<=l[j].to&&l[j].to<=N+M)
						res[i][l[j].to-N]=l[j].down+l[j^1].flow;
			for(int i=1;i<=N;i++)
			{
				for(int j=1;j<=M;j++)
					printf("%d ",res[i][j]);
				printf("\n");
			}
		}
		else printf("IMPOSSIBLE\n");
		printf("\n");
	}
	return 0;
}
