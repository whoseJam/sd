#include<iostream>
#include<cstring>
#include<cstdio>
#include<stack>
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

typedef pair<int,int> pa;
const int N=8005;
const int M=20005;
int low[N],dfn[N],ins[N],bel[N],SCC,tot;
pa door[N],key[N];
stack<int> stk;
int n,m;

int T(int x){
	return x;
}

int F(int x){
	return x+n*2;
}

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

void Tarjan(int u){
	dfn[u]=low[u]=++tot;
	stk.push(u);ins[u]=true;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(!dfn[v]){
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}else if(ins[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u]){
		SCC++;
		while(stk.size()){
			int t=stk.top();stk.pop();
			bel[t]=SCC;
			ins[t]=false;
			if(t==u)break;
		}
	}
}

void Clear(){
	cnt=tot=SCC=0;
	memset(h,0,sizeof(h));
	memset(low,0,sizeof(low));
	memset(dfn,0,sizeof(dfn));
	memset(bel,0,sizeof(bel));
	memset(ins,0,sizeof(ins));
	while(stk.size())stk.pop();
}

bool Check(int k){
	Clear();
	for(int i=1;i<=n;i++){
		Link(T(key[i].first),F(key[i].second));
		Link(T(key[i].second),F(key[i].first));
	}
	for(int i=1;i<=k;i++){
		Link(F(door[i].first),T(door[i].second));
		Link(F(door[i].second),T(door[i].first));
	}
	for(int i=1;i<=n*4;i++)
		if(!dfn[i])Tarjan(i);
	for(int i=1;i<=n*2;i++)
		if(bel[F(i)]==bel[T(i)])return false;
	return true;
}

void Solve(){
	for(int i=1;i<=n;i++){
		key[i].first=read();
		key[i].second=read();
	}
	for(int i=1;i<=m;i++){
		door[i].first=read();
		door[i].second=read(); 
	}
	int l=1,r=m,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(Check(mid))l=mid+1;
		else r=mid-1;
	}
	cout<<r<<'\n';
}

int main(){
	while(true){
		n=read();m=read();
		if(n==0&&m==0)break;
		Solve();
	}
	return 0;
}
