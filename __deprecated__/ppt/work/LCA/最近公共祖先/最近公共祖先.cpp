#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
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

const int N=500005;
int fa[N][20],dep[N],n,m,S;
vector<int> G[N];

void Link(int u,int v){
	G[u].push_back(v);
	G[v].push_back(u);
}

void Dfs(int u,int f,int d){
	fa[u][0]=f;dep[u]=d;
	for(int i=1;i<=19;i++)
		fa[u][i]=fa[fa[u][i-1]][i-1];
	for(int v:G[u]){
		if(v!=f)Dfs(v,u,d+1);
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
	n=read();m=read();S=read();
	for(int i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(x,y);
	}
	Dfs(S,0,1);
	for(int i=1;i<=m;i++)
		cout<<LCA(read(),read())<<'\n';
	return 0;
}

