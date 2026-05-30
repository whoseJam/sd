#include<iostream>
#include<cstring>
#include<cstdio>
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
const int M=5000005;
int A0,B0,L0,A1,B1,L1;
int n,inq[N],dis[N],len[N];

struct line{
	int Nxt,to,val;
}l[M];
int h[N],cnt;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

bool Spfa(){
	queue<int>q;
	for(int i=0;i<=n;i++)dis[i]=inf;
	q.push(0);dis[0]=0;
	while(q.size()){
		int u=q.front();q.pop();inq[u]=0;
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(dis[v]>dis[u]+l[i].val){
				dis[v]=dis[u]+l[i].val;
				len[v]=len[u]+1;
				if(len[v]>=n)return true;
				if(!inq[v]){
					q.push(v);
					inq[v]=1;
				}
			}
		}
	}
	return false;
}

int main(){
	n=read();
	A0=read();B0=read();L0=read();
	A1=read();B1=read();L1=read();
	for(int i=1;i<=n;i++)Link(i-1,i,1); // X[i]<=X[i-1]+1
	for(int i=1;i<=n;i++)Link(i,i-1,0); // X[i-1]<=X[i]+0
	for(int i=1;i+L0-1<=n;i++){
		Link(i+L0-1,i-1,B0-L0); // X[i-1]<=X[i+L0-1]+(B0-L0)
		Link(i-1,i+L0-1,L0-A0); // X[i+L0-1]<=X[i-1]+(L0-A0)
	}
	for(int i=1;i+L1-1<=n;i++){
		Link(i+L1-1,i-1,-A1); // X[i-1]<=X[i+L1-1]+(-A1)
		Link(i-1,i+L1-1,B1); // X[i+L1-1]<=X[i-1]+B1
	}
	if(Spfa()){
		cout<<-1<<'\n';
		return 0;
	}
	
	int offset=0;
	for(int i=0;i<=n;i++)
		offset=min(offset,dis[i]);
	for(int i=0;i<=n;i++)
		dis[i]-=offset;
	cout<<dis[n]<<'\n';
	return 0;
}
