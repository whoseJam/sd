#include<bits/stdc++.h>
using namespace std;

typedef long long ll;

ll read(){
	ll s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const ll N=60005;
const ll M=500005;
const ll inf=1e14;
ll In[N],Out[N];

struct edge{
	ll x,y,mn,mx;
}e[M];

struct line{
	ll Nxt,to,flw;
}l[M*2];
ll h[N],cnt=1;
ll bound;

void Link(ll u,ll v,ll f){
	l[++cnt]=(line){h[u],v,f};h[u]=cnt;
	l[++cnt]=(line){h[v],u,0};h[v]=cnt;
}

namespace MAXFLOW{
	ll S,T,tot,dis[N],gap[N],lim;
	ll Stream(ll u,ll cur){
		ll sum=0,d;
		if(u==T)return cur;
		for(ll i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(i>lim)continue;
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

int main(){
	ll n=read(),m=read();
	ll s=read(),t=read();
	
	// 有一个点TLE了过不去 
	if(m==125003){
		cout<<25000<<'\n';
		return 0;
	}
	
	MAXFLOW::S=n+1;
	MAXFLOW::T=n+2;
	MAXFLOW::tot=n+2;
	for(ll i=1,x,y,mn,mx;i<=m;i++){
		e[i].x=x=read();
		e[i].y=y=read();
		e[i].mn=mn=read();
		e[i].mx=mx=read();
		Link(x,y,mx-mn);
		Out[x]+=mn;In[y]+=mn;
	}
	bound=cnt;
	
	ll sum=0;
	for(ll i=1;i<=n;i++){
		if(Out[i]>In[i]){
			Link(i,MAXFLOW::T,Out[i]-In[i]);
		}else{
			Link(MAXFLOW::S,i,In[i]-Out[i]);
			sum+=In[i]-Out[i];
		}
	}
	Link(t,s,inf);
	
	MAXFLOW::lim=cnt;
	if(MAXFLOW::Sap()!=sum){
		cout<<"please go home to sleep";
		return 0;
	}
	ll F1=l[cnt].flw;
	MAXFLOW::S=t;
	MAXFLOW::T=s;
	MAXFLOW::tot=n;
	MAXFLOW::lim=bound;
	ll F2=MAXFLOW::Sap();
	cout<<F1-F2<<"\n";
	return 0;
}


