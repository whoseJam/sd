#include<algorithm>
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

const int N=5005;
const int M=200005;
int fa[N],ans,tot,n,m;

struct edge{
	int x,y,v;
}e[M];

bool cmp(const edge& a,const edge& b){
	return a.v<b.v;
}

int getFa(int x){
	if(fa[x]==x)return x;
	return fa[x]=getFa(fa[x]);
}

void Merge(int x,int y){
	int fx=getFa(x),fy=getFa(y);
	fa[fx]=fy;
}

void Kruskal(){
	sort(e+1,e+1+m,cmp);
	for(int i=1;i<=n;i++)fa[i]=i;
	for(int i=1;i<=m;i++){
		if(getFa(e[i].x)==getFa(e[i].y))continue;
		Merge(e[i].x,e[i].y);
		ans+=e[i].v;tot++;
	}
}

int main(){
	n=read();m=read();
	for(int i=1;i<=m;i++){
		e[i].x=read();
		e[i].y=read();
		e[i].v=read();
	}
	Kruskal();
	if(tot!=n-1)cout<<"orz\n";
	else cout<<ans<<'\n';
	return 0;
}

