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
const int lim=19;
int n,count[N],Ans[N],dep[N];
int son[N],siz[N],fa[N][20];
vector<int>roots;

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

void AddNode(int u){
	count[dep[u]]++;
}

void RemoveNode(int u){
	count[dep[u]]--;
}

void Add(int u,int f){
	AddNode(u);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Add(v,u);
	}
}

void Remove(int u,int f){
	RemoveNode(u);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Remove(v,u);
	}
}

void Dfs(int u,int f){
	siz[u]=1;fa[u][0]=f;dep[u]=dep[f]+1;
	for(int i=1;i<=lim;i++)
		fa[u][i]=fa[fa[u][i-1]][i-1];
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
	AddNode(u);
	for(auto& query:queries[u]){
		int id=query.id;
		int k=query.k;
		Ans[id]=count[dep[u]+k]-1;
	}
}

int Climb(int x,int k){
	for(int i=lim;i>=0;i--)
		if(k-(1<<i)>=0){
			k-=(1<<i);
			x=fa[x][i];
		}
	return x;
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		int fa=read();
		if(!fa)roots.push_back(i);
		Link(fa,i);
	}
	for(auto rt:roots){
		Dfs(rt,0);
	}
	
	int m=read(); 
	for(int i=1,x,k;i<=m;i++){
		x=read();k=read();
		int kth=Climb(x,k);
		queries[kth].push_back((Query){i,k});
	}
	
	for(auto rt:roots){
		Dsu(rt,0);
		Remove(rt,0);
	}
	for(int i=1;i<=m;i++)
		cout<<Ans[i]<<' ';
	return 0;
}

