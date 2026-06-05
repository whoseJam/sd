#include<algorithm>
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

const ll W=2000005;
const ll N=200005;
ll w,tim,tot,qtot,ans[N];

#define ADD (1)
#define QUERY_MINUS (2)
#define QUERY_PLUS (3)

struct TArray{
	ll sm[N];
	ll lowbit(ll x){
		return x&(-x); 
	}
	void add(ll x,ll d){
		for(ll i=x;i<=tim;i+=lowbit(i))
			sm[i]+=d;
	}
	ll ask(ll x){
		ll ans=0;
		for(ll i=x;i>0;i-=lowbit(i))
			ans+=sm[i];
		return ans;
	}
}T;

struct node{
	ll x,y,t,type;
	union{
		ll id;
		ll a;
	};
}d[N];

bool cmpX(const node& a,const node& b){
	if(a.x!=b.x)return a.x<b.x;
	if(a.y!=b.y)return a.y<b.y;
	return a.t<b.t;
}
bool cmpY(const node& a,const node& b){
	if(a.y!=b.y)return a.y<b.y;
	return a.t<b.t;
}

void CDQ(ll l,ll r){
	if(l==r)return;
	ll mid=(l+r)>>1;
	CDQ(l,mid);
	CDQ(mid+1,r);
	ll cur=l-1;
	for(ll i=mid+1;i<=r;i++){
		while(cur+1<=mid&&d[cur+1].y<=d[i].y){
			cur++;
			if(d[cur].type==ADD)
				T.add(d[cur].t,d[cur].a);
		}
		ll id=d[i].id;
		if(d[i].type==QUERY_PLUS){
			ans[id]+=T.ask(d[i].t);
		}else if(d[i].type==QUERY_MINUS){
			ans[id]-=T.ask(d[i].t);
		}
	}
	for(ll i=l;i<=cur;i++)
		if(d[i].type==ADD)
			T.add(d[i].t,-d[i].a);
	sort(d+l,d+r+1,cmpY);
}

int main(){
	read();w=read();
	while(true){
		ll opt=read();
		if(opt==1){
			tot++;
			d[tot].x=read();
			d[tot].y=read();
			d[tot].type=ADD;
			d[tot].a=read();
			d[tot].t=++tim;
		}else if(opt==2){
			ll x1=read(),y1=read();
			ll x2=read(),y2=read();
			tim++;qtot++;
			d[++tot]=(node){x2,y2,tim,QUERY_PLUS,qtot};
			d[++tot]=(node){x1-1,y2,tim,QUERY_MINUS,qtot};
			d[++tot]=(node){x2,y1-1,tim,QUERY_MINUS,qtot};
			d[++tot]=(node){x1-1,y1-1,tim,QUERY_PLUS,qtot};
		}else break;
	}
	sort(d+1,d+1+tot,cmpX);
	CDQ(1,tot);
	for(ll i=1;i<=qtot;i++)
		cout<<ans[i]<<'\n';
	return 0;
}

