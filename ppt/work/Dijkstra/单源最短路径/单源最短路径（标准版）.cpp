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

const ll inf=0x3f3f3f3f;
const ll N=100005;
const ll M=200005;
ll dis[N],vis[N],n,m;

struct line{
	ll Nxt,to,val;
}l[M];
ll h[N],cnt;

typedef pair<ll,ll> pa;

void Link(ll u,ll v,ll w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

void Dijkstra(ll S){
	for(ll i=1;i<=n;i++)
		dis[i]=inf;
	dis[S]=0;
	priority_queue<pa,vector<pa>,greater<pa>>q;
	q.push(make_pair(0,S));
	while(q.size()){
		ll u=q.top().second;q.pop();
		if(vis[u])continue;vis[u]=1;
		for(ll i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(dis[v]>dis[u]+l[i].val){
				dis[v]=dis[u]+l[i].val;
				q.push(make_pair(dis[v],v));
			}
		}
	}
}

int main(){
	n=read();m=read();ll S=read();
	for(ll i=1,x,y,w;i<=m;i++){
		x=read();y=read();w=read();
		Link(x,y,w);
	}
	Dijkstra(S);
	for(ll i=1;i<=n;i++)
		cout<<dis[i]<<' ';
	return 0;
}

