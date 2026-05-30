#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<stack>
#include<map>
#define lc (x<<1)
#define rc (x<<1|1)
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
const int M=200005;
int n,m,k;

struct Union{
	int current;
	int fa[N*2];
	vector<vector<pair<int,int>>> history; 
	void init(){
		current=-1;
		for(int i=1;i<=n*2;i++)fa[i]=i;
		history.clear();
	}
	void assign(int x,int f){
		history[current].push_back(make_pair(x,fa[x]));
		fa[x]=f;
	}
	void next(){
		current++;
		history.push_back({});
	}
	void rollback(){
		while(history[current].size()>0){
			auto& item=history[current].back();
			fa[item.first]=item.second;
			history[current].pop_back();
		}
		current--;
		history.pop_back();
	}
	int getFa(int x){
		if(fa[x]==x)return x;
		int f=getFa(fa[x]);
		if(f!=fa[x])assign(x,f); // fa[x]=f
		return f;
	}
	void merge(int x,int y){
		int fx=getFa(x);
		int fy=getFa(y);
		if(fx!=fy)assign(fx,fy); // fa[fx]=fy
	}
	bool link(int x,int y){
		merge(x,y+n);
		merge(y,x+n);
		if(getFa(x)==getFa(x+n))return false;
		if(getFa(y)==getFa(y+n))return false;
		return true;
	}
}u;

struct seg{
	int l,r;
	vector<pair<int,int>> edges;
}t[M*4];

void build(int x,int l,int r){
	t[x].l=l;t[x].r=r;
	if(l==r)return;
	int mid=(l+r)>>1;
	build(lc,l,mid);
	build(rc,mid+1,r);
}

void insert(int x,int l,int r,pair<int,int> edge){
	if(l<=t[x].l&&t[x].r<=r){
		t[x].edges.push_back(edge);
		return;
	}
	int mid=(t[x].l+t[x].r)>>1;
	if(l<=mid)insert(lc,l,r,edge);
	if(r>mid)insert(rc,l,r,edge);
}

void dfs(int x,bool success){
	u.next();
	for(auto& edge:t[x].edges)
		success&=u.link(edge.first,edge.second);
	if(t[x].l==t[x].r){
		cout<<(success?"Yes":"No")<<'\n';
		u.rollback();
		return;
	}
	dfs(lc,success);
	dfs(rc,success);
	u.rollback();
}


int main(){
	n=read();m=read();k=read();
	
	u.init();build(1,1,k);
	for(int i=1,x,y,l,r;i<=m;i++){
		x=read();y=read();l=read()+1;r=read();
		if(l<=r)insert(1,l,r,make_pair(x,y));
	}
	dfs(1,true);
	return 0;
}

