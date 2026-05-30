#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int inf=0x7fffffff;
const int N=10005;
const int M=500005;
int dis[N],inq[N],n,m;

struct line{
	int Nxt,to,val;
}l[M];
int h[N],cnt;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

void SPFA(int S){
	queue<int>q;
	for(int i=1;i<=n;i++)
		dis[i]=inf;
	dis[S]=0;inq[S]=1;q.push(S);
	while(q.size()){
		int u=q.front();q.pop();inq[u]=0;
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(dis[v]>dis[u]+l[i].val){
				dis[v]=dis[u]+l[i].val;
				if(!inq[v]){
					q.push(v);
					inq[v]=1;
				}
			}
		}
	}
}

int main(){
	n=read();m=read();int s=read(); 
	for(int i=1,x,y,w;i<=m;i++){
		x=read();y=read();w=read();
		Link(x,y,w);
	}
	SPFA(s);
	for(int i=1;i<=n;i++)cout<<dis[i]<<' ';
	return 0;
}

