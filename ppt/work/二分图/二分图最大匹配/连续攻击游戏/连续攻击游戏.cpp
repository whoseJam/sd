#include<iostream>
#include<cstring>
#include<cstdio>
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

const int N=1000005;
const int M=10005; 
const int E=2000005;
int match[N],vis[N],n,m,Tim;

struct line{
	int Nxt,to;
}l[E];
int h[M],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

bool findPath(int u){
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(vis[v]!=Tim){
			vis[v]=Tim;
			if(!match[v]||findPath(match[v])){
				match[v]=u;
				return true;
			}
		}
	}
	return false;
}


int main(){
	n=read();
	for(int i=1,a,b;i<=n;i++){
		a=read();b=read();
		Link(a,i);
		Link(b,i);
	}
	for(int i=1;i<=10000;i++){
		Tim++;
		if(!findPath(i)){
			cout<<i-1<<'\n';
			return 0;
		}
	}
	cout<<10000<<'\n';
	return 0;
}

