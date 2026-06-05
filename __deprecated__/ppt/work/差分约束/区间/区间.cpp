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

const int N=50005;
const int M=200005;
const int LIM=50001;
int n,inq[N],dis[N];

struct line{
	int Nxt,to,val;
}l[M];
int h[N],cnt;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

void Spfa(){
	queue<int>q;
	for(int i=0;i<=LIM;i++){
		dis[i]=0;
		q.push(i);
		inq[i]=1;
	}
	while(q.size()){
		int u=q.front();q.pop();inq[u]=0;
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(dis[v]<dis[u]+l[i].val){
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
	n=read();
	for(int k=1,ai,bi,ci;k<=n;k++){
		ai=read()+1;bi=read()+1;ci=read();
		Link(ai-1,bi,ci); // sum(bi)>=sum(ai-1)+ci
	}
	for(int i=0;i<LIM;i++){
		//sum(i+1)>=sum(i)+0
		Link(i,i+1,0);
		//sum(i)>=sum(i+1)-1
		Link(i+1,i,-1);
	}
	Spfa();
	cout<<dis[LIM]<<'\n';
	return 0;
}

