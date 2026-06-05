#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef long long ll;

namespace FastIO{
	const ll L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline ll read(){
		ll s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const ll N=100005;
ll n,col[N],colCount[N],mxCol,smCol,Ans[N];
ll son[N],siz[N];

struct line{
	ll Nxt,to;
}l[N*2];
ll h[N],cnt;

void Link(ll u,ll v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void AddCol(ll c){
	colCount[c]++;
	if(mxCol<colCount[c]){
		mxCol=colCount[c];
		smCol=c;
	}else if(mxCol==colCount[c]){
		smCol+=c;
	}
}

void RemoveCol(ll c){
	colCount[c]=0;
}

void Add(ll u,ll f){
	AddCol(col[u]);
	for(ll i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Add(v,u);
	}
}

void Remove(ll u,ll f){
	RemoveCol(col[u]);
	for(ll i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Remove(v,u);
	}
}

void Dfs(ll u,ll f){
	siz[u]=1;
	for(ll i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			Dfs(v,u);
			siz[u]+=siz[v];
			if(siz[son[u]]<siz[v])
				son[u]=v;
		}
	}
}

void Dsu(ll u,ll f){
	for(ll i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f&&v!=son[u]){
			Dsu(v,u);
			Remove(v,u);
			mxCol=smCol=0;
		}
	}
	if(son[u])Dsu(son[u],u);
	for(ll i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f&&v!=son[u]){
			Add(v,u);
		}
	}
	AddCol(col[u]);
	Ans[u]=smCol;
}

int main(){
	n=read();
	for(ll i=1;i<=n;i++)
		col[i]=read();
	for(ll i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(x,y);
	}
	Dfs(1,0);
	Dsu(1,0);
	for(ll i=1;i<=n;i++)
		cout<<Ans[i]<<' ';
	return 0;
}

