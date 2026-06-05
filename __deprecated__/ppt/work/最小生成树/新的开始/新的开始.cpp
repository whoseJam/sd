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

const int N=305;
const int M=100005;
int fa[N],ans,tot,n;

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
	sort(e+1,e+1+tot,cmp);
	for(int i=1;i<=n+1;i++)fa[i]=i;
	for(int i=1;i<=tot;i++){
		if(getFa(e[i].x)==getFa(e[i].y))continue;
		Merge(e[i].x,e[i].y);
		ans+=e[i].v;
	}
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		++tot;
		e[tot].x=i;
		e[tot].y=n+1;
		e[tot].v=read();
	}
	for(int i=1;i<=n;i++){
		for(int j=1,x;j<=n;j++){
			x=read();
			if(i<j){
				++tot;
				e[tot].x=i;
				e[tot].y=j;
				e[tot].v=x;
			}
		}
	}
	Kruskal();
	cout<<ans<<'\n';
	return 0;
}
