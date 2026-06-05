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

const int N=100005;
int n,m,col[N],colCount[N],sum[N],Ans[N];
int son[N],siz[N];

struct Query{
	int id,k;
};

vector<Query> queries[N];

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void AddCol(int c){
	colCount[c]++;
	sum[colCount[c]]++;
}

void RemoveCol(int c){
	sum[colCount[c]]--;
	colCount[c]--;
}

void Add(int u,int f){
	AddCol(col[u]);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Add(v,u);
	}
}

void Remove(int u,int f){
	RemoveCol(col[u]);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Remove(v,u);
	}
}

void Dfs(int u,int f){
	siz[u]=1;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			Dfs(v,u);
			siz[u]+=siz[v];
			if(siz[son[u]]<siz[v])
				son[u]=v;
		}
	}
}

void Dsu(int u,int f){
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f&&v!=son[u]){
			Dsu(v,u);
			Remove(v,u);
		}
	}
	if(son[u])Dsu(son[u],u);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f&&v!=son[u]){
			Add(v,u);
		}
	}
	AddCol(col[u]);
	for(auto query:queries[u]){
		int id=query.id;
		int k=query.k;
		Ans[id]=sum[k];
	}
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)
		col[i]=read();
	for(int i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(x,y);
	}
	for(int i=1;i<=m;i++){
		int u=read();
		int k=read();
		queries[u].push_back((Query){i,k});
	}
	Dfs(1,0);
	Dsu(1,0);
	
	for(int i=1;i<=m;i++){
		cout<<Ans[i]<<'\n';
	}
	return 0;
}


