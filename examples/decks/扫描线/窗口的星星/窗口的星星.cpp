#include<bits/stdc++.h>
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

const ll N=10005;
ll W,H,Ls[N*2],Lsn;

struct star{
	ll x,y,l;
}s[N];

struct bound{
	ll flg,h,l,r,light;
}b[N*2];

#define lc (x<<1)
#define rc (x<<1|1) 

struct seg{
	ll l,r,max,add;
}t[N*8];

void pushUp(ll x){
	t[x].max=max(t[lc].max,t[rc].max);
}

void pushAdd(ll x,ll d){
	t[x].max+=d;
	t[x].add+=d;
}

void pushDown(ll x){
	if(t[x].add){
		pushAdd(lc,t[x].add);
		pushAdd(rc,t[x].add);
		t[x].add=0;
	}
}

void Build(ll x,ll l,ll r){
	t[x].l=l;t[x].r=r;
	t[x].max=t[x].add=0;
	if(l==r)return;
	ll mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x);
}

void Add(ll x,ll l,ll r,ll d){
	if(l<=t[x].l&&t[x].r<=r){
		pushAdd(x,d);
		return;
	}
	pushDown(x);
	ll mid=(t[x].l+t[x].r)>>1;
	if(l<=mid)Add(lc,l,r,d);
	if(r>mid)Add(rc,l,r,d);
	pushUp(x);
}

ll Query(){
	return t[1].max;
}

bool cmp(const bound& a,const bound& b){
	if(a.h==b.h)return a.flg<b.flg;
	return a.h<b.h;
}

ll n,tot;

void Clear(){
	tot=0;Lsn=0;
}

void Solve(){
	Clear();
	n=read();W=read();H=read();
	for(ll i=1;i<=n;i++){
		s[i].x=read();
		s[i].y=read();
		s[i].l=read();
		Ls[++Lsn]=s[i].x-W+1;
		Ls[++Lsn]=s[i].x;
	}
	sort(Ls+1,Ls+1+Lsn);
	Lsn=unique(Ls+1,Ls+1+Lsn)-Ls-1;
	for(ll i=1;i<=n;i++){
		ll l=lower_bound(Ls+1,Ls+1+Lsn,s[i].x-W+1)-Ls;
		ll r=lower_bound(Ls+1,Ls+1+Lsn,s[i].x)-Ls;
		b[++tot]=(bound){1,s[i].y-H+1,l,r,s[i].l};
		b[++tot]=(bound){-1,s[i].y+1,l,r,s[i].l};
	}
	Build(1,1,Lsn);
	sort(b+1,b+1+tot,cmp);
	ll Ans=0;
	for(ll i=1;i<=tot;i++){
		if(b[i].flg==1){
			Add(1,b[i].l,b[i].r,b[i].light); 
		}else{
			Add(1,b[i].l,b[i].r,-b[i].light);
		}
		Ans=max(Ans,Query());
	}
	cout<<Ans<<'\n'; 
}

int main(){
	ll T=read();
	while(T--)Solve();
	return 0;
}

