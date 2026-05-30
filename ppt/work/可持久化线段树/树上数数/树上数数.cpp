#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
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

const int N=100005;
int n,m,a[N],fa[N][20],dep[N];
int Ls[N],Lsn;

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

struct seg{
	int lc,rc,siz;
}t[N*30];
int rt[N],tot;

void insert(int& x,int lst,int l,int r,int p){
	t[x=++tot]=t[lst];t[x].siz++;
	if(l==r)return;
	int mid=(l+r)>>1;
	if(p<=mid)insert(t[x].lc,t[lst].lc,l,mid,p);
	else insert(t[x].rc,t[lst].rc,mid+1,r,p);
}

int nodeSize(int x1,int x2,int x3,int x4){
	return t[x1].siz+t[x2].siz-t[x3].siz-t[x4].siz;
}

int query(int x1,int x2,int x3,int x4,int l,int r,int k){
	if(l==r)return l;
	int mid=(l+r)>>1,lsiz=nodeSize(t[x1].lc,t[x2].lc,t[x3].lc,t[x4].lc);
	if(lsiz>=k)return query(t[x1].lc,t[x2].lc,t[x3].lc,t[x4].lc,l,mid,k);
	return query(t[x1].rc,t[x2].rc,t[x3].rc,t[x4].rc,mid+1,r,k-lsiz);
}

void Dfs(int u,int f,int d){
	dep[u]=d;fa[u][0]=f;
	for(int i=1;i<=19;i++)fa[u][i]=fa[fa[u][i-1]][i-1];
	insert(rt[u],rt[f],1,Lsn,a[u]);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			Dfs(v,u,d+1);
		}
	}
}

int LCA(int x,int y){
	if(dep[x]<dep[y])swap(x,y);
	for(int i=19;i>=0;i--)
		if(dep[fa[x][i]]>=dep[y])x=fa[x][i];
	if(x==y)return x;
	for(int i=19;i>=0;i--)
		if(fa[x][i]!=fa[y][i]){
			x=fa[x][i];
			y=fa[y][i];
		}
	return fa[x][0];
}

int Solve(int u,int v,int k){
	int g=LCA(u,v),fg=fa[g][0];
	int pos=query(rt[u],rt[v],rt[g],rt[fg],1,Lsn,k);
	return Ls[pos];
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)Ls[++Lsn]=a[i]=read();
	for(int i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(x,y);
	}
	sort(Ls+1,Ls+1+Lsn);
	Lsn=unique(Ls+1,Ls+1+Lsn)-Ls-1;
	for(int i=1;i<=n;i++)
		a[i]=lower_bound(Ls+1,Ls+1+Lsn,a[i])-Ls;
	Dfs(1,0,1);
	
	int lastans=0;
	for(int i=1,u,v,k;i<=m;i++){
		u=read()^lastans;v=read();k=read();
		cout<<(lastans=Solve(u,v,k))<<'\n';
	}
	
	return 0;
}

