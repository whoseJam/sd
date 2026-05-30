#include<iostream>
#include<cstring>
#include<cstdio>
#include<queue>
#define In(x) x
#define Out(x) x+n
#define Start n*2+1
#define End n*2+2
#define Num n*2+2
using namespace std;

inline int read()
{
	int sum=0,fu=1;char in=getchar();
	while('0'>in||in>'9'){if(in=='-')fu=-1;in=getchar();}
	while('0'<=in&&in<='9'){sum=sum*10+in-'0';in=getchar();}
	return sum*fu;
}

const int inf=0x3f3f3f3f;
int n,m,a[2005];

namespace speed{
	struct line{
		int Nxt,to,flow,cost;
	}l[5000005];
	int cnt=1,h[2005];
	void Link(int u,int v,int f,int c){
		l[++cnt]=(line){h[u],v,f,c};h[u]=cnt;
		l[++cnt]=(line){h[v],u,0,-c};h[v]=cnt;
	}
	
	int dis[2005],Inq[2005],prt[2005],COST;
	bool SPFA(){
		queue<int>q;
		for(int i=1;i<=Num;i++)prt[i]=0,dis[i]=inf;
		dis[Start]=0;Inq[Start]=1;q.push(Start);
		while(q.size()){
			int u=q.front();q.pop();Inq[u]=0;
			for(int i=h[u];i;i=l[i].Nxt){
				int v=l[i].to;
				if(dis[v]>dis[u]+l[i].cost&&l[i].flow>0){
					prt[v]=i;dis[v]=dis[u]+l[i].cost;
					if(!Inq[v])Inq[v]=1,q.push(v);
				}
			}
		}
		return dis[End]!=inf;
	}
	void Adjust(){
		int u=End,del=inf;
		while(prt[u]){
			del=min(del,l[prt[u]].flow);
			u=l[prt[u]^1].to;
		}
		u=End;COST+=del*dis[End];
		while(prt[u]){
			l[prt[u]].flow-=del;l[prt[u]^1].flow+=del;
			u=l[prt[u]^1].to;
		}
	}
}

int main()
{
	n=read();m=read();
	for(int i=1;i<=n;i++)
	{
		a[i]=read();
		speed::Link(Start,In(i),1,0);
		speed::Link(Start,Out(i),1,a[i]);
		speed::Link(Out(i),End,1,0);
	}
	int x,y,z;
	for(int i=1;i<=m;i++)
	{
		x=read();y=read();z=read();
		if(x>y)swap(x,y);
		speed::Link(In(x),Out(y),1,z);
	}
	speed::COST=0;
	while(speed::SPFA())speed::Adjust();
	printf("%d",speed::COST);
	return 0;
}
