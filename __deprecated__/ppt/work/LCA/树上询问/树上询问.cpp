#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<map>
using namespace std;
using ll=long long;
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

const ll N=500005;
ll fa[N][20],dep[N],siz[N],n,q;
vector<ll> G[N];
void Link(ll u,ll v){
	G[u].push_back(v);
	G[v].push_back(u);
}
void Dfs(ll u,ll f,ll d){
	fa[u][0]=f;dep[u]=d;siz[u]=1;
	for(ll i=1;i<=19;i++)
		fa[u][i]=fa[fa[u][i-1]][i-1];
	for(ll v:G[u]){
		if(v!=f){
			Dfs(v,u,d+1);
			siz[u]+=siz[v];
		}
	}
}
ll LCA(ll x,ll y){
	if(dep[x]<dep[y])swap(x,y);
	for(ll i=19;i>=0;i--)
		if(dep[fa[x][i]]>=dep[y])
			x=fa[x][i];
	if(x==y)return x;
	for(ll i=19;i>=0;i--)
		if(fa[x][i]!=fa[y][i]){
			x=fa[x][i];
			y=fa[y][i];
		}
	return fa[x][0];
}
ll Climb(ll x,ll g){
	for(ll i=19;i>=0;i--)
		if(dep[fa[x][i]]>dep[g])x=fa[x][i];
	return x;
}
ll Dis(ll a,ll b){
	return dep[a]+dep[b]-2*dep[LCA(a,b)];
}
bool inSub(ll f,ll x){
	return LCA(x,f)==f;	
}
void Solve(ll a,ll b,ll c){
	if(LCA(a,b)==c){
		ll siza=a==c?0:siz[Climb(a,c)];
		ll sizb=b==c?0:siz[Climb(b,c)];
		cout<<n-siza-sizb<<'\n';
		return;
	}else if(inSub(c,a)&&!inSub(c,b)){
		ll sa=Climb(a,c);
		if(c==a)cout<<siz[a]<<'\n';
		else cout<<n-siz[sa]-(n-siz[c])<<'\n';
	}else if(inSub(c,b)&&!inSub(c,a)){
		ll sb=Climb(b,c);
		if(c==b)cout<<siz[b]<<'\n';
		else cout<<n-siz[sb]-(n-siz[c])<<'\n';
	}else cout<<0<<'\n';
}
int main(){
	n=read();q=read();
	for(ll i=1;i<=n-1;i++)Link(read(),read());
	Dfs(1,0,1);
	for(ll i=1;i<=q;i++){
		ll a=read(),b=read(),c=read();
		Solve(a,b,c);
	}
	return 0;
}

