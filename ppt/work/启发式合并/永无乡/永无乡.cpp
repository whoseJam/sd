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
int fa[N],ch[N][2],siz[N],val[N];
int n,m,q;

void pushUp(int x){
	siz[x]=siz[ch[x][0]]+siz[ch[x][1]]+1;
}

void rotate(int x,int &f){
	int y=fa[x],z=fa[y],L=(ch[y][0]!=x),R=L^1;
	if(y==f)f=x;else if(ch[z][0]==y)ch[z][0]=x;else ch[z][1]=x;
	fa[x]=z;fa[y]=x;fa[ch[x][R]]=y;
	ch[y][L]=ch[x][R];ch[x][R]=y;
	pushUp(y);pushUp(x);
}

void Splay(int x,int &f){
	while(x!=f){
		int y=fa[x],z=fa[y];
		if(y!=f){
			if((ch[z][0]==y)^(ch[y][0]==x))rotate(x,f);
			else rotate(y,f);
		}
		rotate(x,f);
	}
}

void insert(int& x,int f,int id){
	if(!x){x=id;fa[id]=f;siz[id]=1;return;}
	if(val[x]>val[id])insert(ch[x][0],x,id);
	else insert(ch[x][1],x,id);
	pushUp(x);
}

void insert(int rt,int x){
	if(rt==x)return;
	insert(rt,0,x);
	Splay(x,rt);
}

int getRoot(int k){
	if(fa[k]==0)return k;
	return getRoot(fa[k]);
}

int findKth(int x,int k){
	if(siz[ch[x][0]]+1==k)return x;
	else if(siz[ch[x][0]]>=k)return findKth(ch[x][0],k);
	else return findKth(ch[x][1],k-siz[ch[x][0]]-1);
}

void Dfs(int u,int rt){
	if(ch[u][0])Dfs(ch[u][0],rt);
	if(ch[u][1])Dfs(ch[u][1],rt);
	insert(rt,u);
}

void Merge(int x,int y){
	int fx=getRoot(x);
	int fy=getRoot(y);
	if(fx==fy)return;
	if(siz[fx]>siz[fy])swap(fx,fy);
	Dfs(fx,fy);
}

int Query(int x,int k){
	int f=getRoot(x);
	if(siz[f]<k)return -1;
	return findKth(f,k);
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++){
		val[i]=read();
		siz[i]=1;
	}
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		Merge(x,y);
	}
	
	q=read();char opt[3];
	for(int i=1,x,y;i<=q;i++){
		scanf("%s",&opt);
		x=read();
		y=read();
		if(opt[0]=='Q')cout<<Query(x,y)<<'\n';
		if(opt[0]=='B')Merge(x,y);
	}
	return 0;
}