#include<iostream>
#include<cstring>
#include<cstdio>
#include<queue>
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

const ll inf=0x3f3f3f3f;
const ll N=40005;
const ll M=10000005;
const ll R=105;
ll n,m,a[R],b[R],c[R][R];

struct line{
	ll Nxt,to,flw,val;
}l[M*2];
ll h[N],cnt;

void Link(ll u,ll v,ll f,ll c){
	l[++cnt]=(line){h[u],v,f,c};h[u]=cnt;
	l[++cnt]=(line){h[v],u,0,-c};h[v]=cnt;
}

namespace MAXFLOW{
	ll S,T,tot,dis[N],prt[N],inq[N],FLOW,COST;
	bool MinSpfa(){
		queue<ll>q;
		for(ll i=1;i<=tot;i++)
			dis[i]=inf;
		dis[S]=0;inq[S]=1;q.push(S);
		while(q.size()){
			ll u=q.front();q.pop();inq[u]=0;
			for(ll i=h[u],v;i;i=l[i].Nxt){
				v=l[i].to;
				if(dis[v]>dis[u]+l[i].val&&l[i].flw){
					dis[v]=dis[u]+l[i].val;
					prt[v]=i;
					if(!inq[v]){
						inq[v]=1;
						q.push(v);
					}
				}
			}
		}
		return dis[T]<inf;
	}
	bool MaxSpfa(){
		queue<ll>q;
		for(ll i=1;i<=tot;i++)
			dis[i]=-inf;
		dis[S]=0;inq[S]=1;q.push(S);
		while(q.size()){
			ll u=q.front();q.pop();inq[u]=0;
			for(ll i=h[u],v;i;i=l[i].Nxt){
				v=l[i].to;
				if(dis[v]<dis[u]+l[i].val&&l[i].flw){
					dis[v]=dis[u]+l[i].val;
					prt[v]=i;
					if(!inq[v]){
						inq[v]=1;
						q.push(v);
					}
				}
			}
		}
		return dis[T]>-inf;
	}
	void Adjust(){
		ll u,v=T,neck=inf;
		while(prt[v]){
			u=l[prt[v]^1].to;
			neck=min(neck,l[prt[v]].flw);
			v=u;
		}
		v=T;
		while(prt[v]){
			u=l[prt[v]^1].to;
			l[prt[v]].flw-=neck;
			l[prt[v]^1].flw+=neck;
			v=u;
		}
		FLOW+=neck;
		COST+=neck*dis[T];
	}
	void MinSolve(){
		while(MinSpfa())Adjust();
	}
	void MaxSolve(){
		while(MaxSpfa())Adjust();
	}
}

void Clear(){
	cnt=1;
	memset(h,0,sizeof(h));
	MAXFLOW::COST=0;
	MAXFLOW::FLOW=0;
}

int main(){
	m=read();n=read();
	for(ll i=1;i<=m;i++)a[i]=read();
	for(ll i=1;i<=n;i++)b[i]=read();
	for(ll i=1;i<=m;i++){
		for(ll j=1;j<=n;j++){
			c[i][j]=read();
		}
	}
	MAXFLOW::S=n+m+1;
	MAXFLOW::T=n+m+2;
	MAXFLOW::tot=n+m+2;
	
	Clear();
	for(ll i=1;i<=m;i++)Link(MAXFLOW::S,i,a[i],0);
	for(ll i=1;i<=n;i++)Link(i+m,MAXFLOW::T,b[i],0);
	for(ll i=1;i<=m;i++)
		for(ll j=1;j<=n;j++)
			Link(i,j+m,inf,c[i][j]);
	MAXFLOW::MinSolve();
	cout<<MAXFLOW::COST<<'\n';
	
	Clear();
	for(ll i=1;i<=m;i++)Link(MAXFLOW::S,i,a[i],0);
	for(ll i=1;i<=n;i++)Link(i+m,MAXFLOW::T,b[i],0);
	for(ll i=1;i<=m;i++)
		for(ll j=1;j<=n;j++)
			Link(i,j+m,inf,c[i][j]);
	MAXFLOW::MaxSolve();
	cout<<MAXFLOW::COST<<'\n';
	return 0;
}

