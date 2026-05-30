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

const int N=1005;
const int M=5005;
int n,m,inq[N],dis[N],len[N];

struct line{
	int Nxt,to,val;
}l[M];
int h[N],cnt;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

bool Spfa(){
	queue<int>q;
	for(int i=1;i<=n;i++){
		dis[i]=0;
		q.push(i);
		inq[i]=1;
	}
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
	n=read();m=read();
	for(int k=1,i,j,b;k<=m;k++){
		i=read();j=read();b=read(); // Ti<=Tj+b
		Link(j,i,b);
	}
	if(Spfa()){
		cout<<"NO SOLUTION\n";
		return 0;
	}
	
	int offset=0;
	for(int i=1;i<=n;i++)
		offset=min(offset,dis[i]);
	for(int i=1;i<=n;i++)
		dis[i]-=offset;
	for(int i=1;i<=n;i++)
		cout<<dis[i]<<'\n';
	return 0;
}

