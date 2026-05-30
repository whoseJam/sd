#include<iostream>
#include<cstring>
#include<cstdio>
#include<queue>
using namespace std;

typedef long long ll;

const ll N=4005;
const ll M=500005;
ll n,p,m1,f1,m2,f2,INF=0x3f3f3f3f;
ll dis[N],Inq[N],prt[N],R[N];
ll S,T,tot;

ll Day(ll x){
	return x;
}

ll Dirty(ll x){
	return x+n;
}

struct line{
	ll nextLine,to,flow,cost;
}l[M];
ll cnt=1,h[N];

void addEdge(ll u,ll v,ll Flow,ll Cost){
	l[++cnt].nextLine=h[u];l[cnt].to=v;l[cnt].flow=Flow;l[cnt].cost=Cost;h[u]=cnt;
	l[++cnt].nextLine=h[v];l[cnt].to=u;l[cnt].flow=0;l[cnt].cost=-Cost;h[v]=cnt;
}

ll SPFA(){
	queue<ll>q;
	for(ll i=1;i<=n*2+2;i++)dis[i]=INF,Inq[i]=0,prt[i]=0;
	dis[n*2+1]=0;Inq[n*2+1]=1;q.push(n*2+1);
	while(q.size()){
		ll u=q.front();q.pop();
		Inq[u]=0;
		for(ll i=h[u];i;i=l[i].nextLine){
			ll v=l[i].to;
			if(dis[v]>dis[u]+l[i].cost&&l[i].flow>0){
				prt[v]=i;
				dis[v]=dis[u]+l[i].cost;
				if(!Inq[v])Inq[v]=1,q.push(v);
			}
		}
	}
	return dis[n*2+2]!=INF;
}

void Adjust(ll &COST){
	ll u=n*2+2,del=INF;
	while(prt[u]){
		del=min(l[prt[u]].flow,del);
		u=l[prt[u]^1].to;
	}
	u=n*2+2;COST+=dis[n*2+2]*del;
	while(prt[u]){
		l[prt[u]].flow-=del;l[prt[u]^1].flow+=del;
		u=l[prt[u]^1].to;
	}
}

int main(){
	ll ans=0;
	scanf("%lld",&n);
	for(ll i=1;i<=n;i++)cin>>R[i];
	scanf("%lld%lld%lld%lld%lld",&p,&m1,&f1,&m2,&f2);
	
	S=n*2+1;
	T=n*2+2;
	tot=n*2+2;
	for(ll i=1;i<=n;i++){
		addEdge(S,Dirty(i),R[i],0);
		addEdge(Day(i),T,R[i],0);
		if(i+m1<=n)addEdge(Dirty(i),Day(i+m1),INF,f1);
		if(i+m2<=n)addEdge(Dirty(i),Day(i+m2),INF,f2);
		if(i!=1)addEdge(Day(i-1),Day(i),INF,0);
		else addEdge(S,Day(1),INF,p);
	}
	while(SPFA())Adjust(ans);
	printf("%lld",ans);
	return 0;
}