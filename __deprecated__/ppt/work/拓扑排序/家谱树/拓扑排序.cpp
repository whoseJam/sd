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

const int N=105;
const int M=10005;

int n,Ind[N];

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;Ind[v]++;
}

void Toposort(){
	queue<int>q;
	for(int u=1;u<=n;u++)
		if(!Ind[u])q.push(u);
	while(q.size()){
		int u=q.front();q.pop();
		cout<<u<<' ';
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			Ind[v]--;
			if(Ind[v]==0){
				q.push(v);
			}
		}
	}
}

int main(){
	n=read();
	for(int u=1,v;u<=n;u++){
		while(v=read()){
			Link(u,v);
		}
	}
	Toposort();
	return 0;
}

