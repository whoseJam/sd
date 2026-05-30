#include<iostream>
#include<cassert>
#include<cstring>
#include<cstdio>
#include<vector> 
#include<map>
#define lc (x<<1)
#define rc (x<<1|1)
using namespace std;

const int N=100005;
int n,m,q,Ans[N];

struct Union{
	int fa[N];
	vector<vector<pair<int,int>>> history; 
	void init(){
		for(int i=1;i<=n;i++)fa[i]=i;
		history.clear();
	}
	void assign(int x,int f){
		history.back().push_back(make_pair(x,fa[x]));
		fa[x]=f;
	}
	void next(){
		history.push_back({});
	}
	void rollback(){
		while(history.back().size()>0){
			auto& item=history.back().back();
			fa[item.first]=item.second;
			history.back().pop_back();
		}
		history.pop_back();
	}
	int getFa(int x){
		if(fa[x]==x)return x;
		int f=getFa(fa[x]);
		if(f!=fa[x])assign(x,f); // fa[x]=f
		return f;
	}
	bool merge(int x,int y){
		int fx=getFa(x);
		int fy=getFa(y);
		if(fx!=fy){
			assign(fx,fy); // fa[fx]=fy
			return true;
		}
		return false;
	}
	bool check(int x,int y){
		int fx=getFa(x);
		int fy=getFa(y);
		return fx==fy;
	}
}u;

struct seg{
	int l,r;
	vector<pair<int,int>> op;
}t[N*4];

void build(int x,int l,int r){
	t[x].l=l;t[x].r=r;
	if(l==r)return;
	int mid=(l+r)>>1;
	build(lc,l,mid);
	build(rc,mid+1,r);
}

void add(int x,int ql,int qr,int a,int b){
	if(ql<=t[x].l&&t[x].r<=qr){
		t[x].op.push_back(make_pair(a,b));
		return;
	}
	int mid=(t[x].l+t[x].r)>>1;
	if(ql<=mid)add(lc,ql,qr,a,b);
	if(qr>mid)add(rc,ql,qr,a,b);
}

void dfs(int x,int cnt){
	u.next();
	for(auto& op:t[x].op)if(u.merge(op.first,op.second))cnt--;
	if(t[x].l==t[x].r){
		Ans[t[x].l]=cnt;
		u.rollback();
		return;
	}
	dfs(lc,cnt);
	dfs(rc,cnt);
	u.rollback();
}

map<pair<int,int>,int> T;
vector<int> Q;

int main(){
	scanf("%d%d",&n,&m);
	u.init();
	for(int i=1,a,b;i<=m;i++){
		scanf("%d%d",&a,&b);
		if(a>b)swap(a,b);
		T[make_pair(a,b)]=0;
	}
	
	scanf("%d",&q);
	build(1,0,q);
	char opt[3];
	for(int i=1,a,b;i<=q;i++){
		scanf("%s",opt);
		if(opt[0]=='A'){
			scanf("%d%d",&a,&b);
			if(a>b)swap(a,b); 
			T[make_pair(a,b)]=i;
		}else if(opt[0]=='D'){
			scanf("%d%d",&a,&b);
			if(a>b)swap(a,b);
			int l=T[make_pair(a,b)];
			int r=i;
			T.erase(make_pair(a,b));
			add(1,l,r,a,b);
		}else{
			Q.push_back(i);
		}
	}
	for(auto& link:T){
		int l=link.second;
		int r=m;
		int a=link.first.first;
		int b=link.first.second;
		add(1,l,r,a,b);
	}
	dfs(1,n);
	for(int q:Q)cout<<Ans[q]<<'\n';
	return 0;
}
