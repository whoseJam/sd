#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
using namespace std;

namespace FastIO{
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=500005;
int fa[N][20],dep[N],dis[N],n,m,S;
char str[10];

struct line{
	int Nxt,to,val;
}l[N*2];
int h[N],cnt;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
	l[++cnt]=(line){h[v],u,w};h[v]=cnt;
}

void Dfs(int u,int f,int d){
	fa[u][0]=f;dep[u]=d;
	for(int i=1;i<=19;i++)
		fa[u][i]=fa[fa[u][i-1]][i-1];
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			dis[v]=dis[u]+l[i].val;
			Dfs(v,u,d+1);
		}
	}
}

int LCA(int x,int y){
	if(dep[x]<dep[y])swap(x,y);
	for(int i=19;i>=0;i--)
		if(dep[fa[x][i]]>=dep[y])
			x=fa[x][i];
	if(x==y)return x;
	for(int i=19;i>=0;i--)
		if(fa[x][i]!=fa[y][i]){
			x=fa[x][i];
			y=fa[y][i];
		}
	return fa[x][0];
}

int main(){
	n=read();m=read();
	for(int i=1,x,y,w;i<n;i++){
		x=read();y=read();w=read();
		Link(x,y,w);
		scanf("%s",str);
	}
	Dfs(1,0,1);
	
	int q=read();
	for(int i=1;i<=q;i++){
		int x=read();
		int y=read();
		int g=LCA(x,y);
		cout<<dis[x]+dis[y]-2*dis[g]<<'\n';
	}
	return 0;
}

