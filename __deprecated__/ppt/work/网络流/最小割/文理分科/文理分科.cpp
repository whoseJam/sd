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

const ll inf=0x3f3f3f3f;
const ll N=40005;
const ll M=10000005;
const ll R=105;
ll n,m,a[R][R],s[R][R],sa[R][R],ss[R][R];
ll Ans,id[R][R],idArt[R][R],idSci[R][R];

struct line{
	ll Nxt,to,flw;
}l[M*2];
ll h[N],cnt=1;

void Link(ll u,ll v,ll f){
	l[++cnt]=(line){h[u],v,f};h[u]=cnt;
	l[++cnt]=(line){h[v],u,0};h[v]=cnt;
}

namespace MAXFLOW{
	ll S,T,tot,dis[N],gap[N];
	ll Stream(ll u,ll cur){
		ll sum=0,d;
		if(u==T)return cur;
		for(ll i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(l[i].flw>0&&dis[v]+1==dis[u]){
				d=Stream(v,min(cur,l[i].flw));
				l[i].flw-=d;l[i^1].flw+=d;
				sum+=d;cur-=d;
				if(dis[S]==tot||!cur)return sum;
			}
		}
		if(!(--gap[dis[u]]))dis[S]=tot;
		gap[++dis[u]]++;
		return sum;
	}
	ll Sap(){
		ll ans=0;
		memset(gap,0,sizeof(gap));
		memset(dis,0,sizeof(dis));
		gap[0]=tot;
		while(dis[S]<tot)ans+=Stream(S,inf);
		return ans;
	}
}

void Build(){
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++){
			id[i][j]=++MAXFLOW::tot;
			idArt[i][j]=++MAXFLOW::tot;
			idSci[i][j]=++MAXFLOW::tot;
		}
	MAXFLOW::S=++MAXFLOW::tot;
	MAXFLOW::T=++MAXFLOW::tot;
	
	ll dx[]={1,0,-1,0};
	ll dy[]={0,1,0,-1};
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++){
			Link(MAXFLOW::S,id[i][j],a[i][j]);Ans+=a[i][j];
			Link(id[i][j],MAXFLOW::T,s[i][j]);Ans+=s[i][j];
			Link(MAXFLOW::S,idArt[i][j],sa[i][j]);Ans+=sa[i][j];
			Link(idArt[i][j],id[i][j],inf);
			Link(idSci[i][j],MAXFLOW::T,ss[i][j]);Ans+=ss[i][j];
			Link(id[i][j],idSci[i][j],inf);
			for(ll k=0;k<4;k++){
				ll tx=i+dx[k];
				ll ty=j+dy[k];
				if(1<=tx&&tx<=n&&1<=ty&&ty<=m){
					Link(idArt[i][j],id[tx][ty],inf);
					Link(id[tx][ty],idSci[i][j],inf);
				}
			}
		}
}

int main(){
	n=read();m=read();
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			a[i][j]=read();
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			s[i][j]=read();
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			sa[i][j]=read();
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			ss[i][j]=read();
	Build();
	cout<<Ans-MAXFLOW::Sap()<<'\n';
	return 0;
}

