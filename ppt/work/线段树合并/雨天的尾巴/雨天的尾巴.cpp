#include<iostream>
#include<cstring>
#include<cassert>
#include<cstdio>
#include<map>
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

const int N=100005;
const int MAXZ=100000;
const int lim=19;
int tot,fa[N][20],rt[N],Ans[N],dep[N],n,q;
using pa=pair<int,int>;

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

struct seg{
	int mx,mxid;
	int lc,rc;
}t[N];

void pushUp(int x){
	t[x].mxid=t[x].mx=0;
	if(t[t[x].lc].mx>t[x].mx){
		t[x].mx=t[t[x].lc].mx;
		t[x].mxid=t[t[x].lc].mxid;
	}
	if(t[t[x].rc].mx>t[x].mx){
		t[x].mx=t[t[x].rc].mx;
		t[x].mxid=t[t[x].rc].mxid;
	}	
}

void insert(int& x,int l,int r,int pos,int d){
	if(!x)x=++tot;
	if(l==r){t[x].mx=d;t[x].mxid=l;return;}
	int mid=(l+r)>>1;
	if(pos<=mid)insert(t[x].lc,l,mid,pos,d);
	else insert(t[x].rc,mid+1,r,pos,d);
	pushUp(x);
}

int Merge(int x,int y){
	if(!x||!y)return x+y;
	if(t[x].mx<t[y].mx||(t[x].mx==t[y].mx&&t[x].mxid>t[y].mxid)){
		t[x].mx=t[y].mx;
		t[x].mxid=t[y].mxid;
	}
	t[x].lc=Merge(t[x].lc,t[y].lc);
	t[x].rc=Merge(t[x].rc,t[y].rc);
	return x;
}

void Dfs1(int u,int f,int d){
	fa[u][0]=f;dep[u]=d;
	for(int i=1;i<=lim;i++)fa[u][i]=fa[fa[u][i-1]][i-1];
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Dfs1(v,u,d+1);
	}
}

int LCA(int x,int y){
	if(dep[x]<dep[y])swap(x,y);
	for(int i=lim;i>=0;i--)
		if(dep[fa[x][i]]>=dep[y])x=fa[x][i];
	if(x==y)return x;
	for(int i=lim;i>=0;i--)
		if(fa[x][i]!=fa[y][i]){
			x=fa[x][i];
			y=fa[y][i];
		}
	return fa[x][0];
}

void Add(int x,int y,int cnt,int type){
	insert(rt[x],1,MAXZ,type,+cnt);
	insert(rt[y],1,MAXZ,type,+cnt);
	int lca=LCA(x,y);
	insert(rt[lca],1,MAXZ,type,-cnt);
	if(fa[lca][0])insert(rt[fa[lca][0]],1,MAXZ,type,-cnt);
}

void Dfs2(int u,int f){
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			Dfs2(v,u);
			rt[u]=Merge(rt[u],rt[v]);
		}
	}
	Ans[u]=t[rt[u]].mxid;
}

int main(){
	n=read();q=read();
	for(int i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(x,y);
	}
	Dfs1(1,0,0);
	for(int i=1,x,y,type;i<=q;i++){
		x=read();y=read();type=read();
		Add(x,y,1,type);
	}
	Dfs2(1,0);
	for(int i=1;i<=n;i++)
		cout<<Ans[i]<<'\n';
	return 0;
}

