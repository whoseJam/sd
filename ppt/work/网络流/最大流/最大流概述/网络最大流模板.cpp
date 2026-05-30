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

const ll N=205;
const ll M=5005;
const ll inf=0x3f3f3f3f;

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

int main(){
	ll n=read(),m=read(),s=read(),t=read();
	for(ll i=1,x,y;i<=m;i++){
		x=read();y=read();
		Link(x,y,read());
	}
	MAXFLOW::S=s;
	MAXFLOW::T=t;
	MAXFLOW::tot=n;
	cout<<MAXFLOW::Sap()<<'\n';
	return 0;
}

