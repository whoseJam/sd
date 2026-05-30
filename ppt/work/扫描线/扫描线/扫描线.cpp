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

const ll N=100005;
ll Ls[N*2],Lsn,n,tot;

struct Rect{
	ll x1,y1,x2,y2;
}R[N];

struct Bound{
	ll flg,h,l,r;
}B[N*2];

bool cmp(const Bound& a,const Bound& b){
	return a.h<b.h;
}

#define lc (x<<1)
#define rc (x<<1|1)

struct seg{
	ll l,r,mn,cnt,add;
}t[N*8];

void pushUp(ll x){
	t[x].mn=min(t[lc].mn,t[rc].mn);
	t[x].cnt=0;
	if(t[x].mn==t[lc].mn)t[x].cnt+=t[lc].cnt;
	if(t[x].mn==t[rc].mn)t[x].cnt+=t[rc].cnt;
}

void pushAdd(ll x,ll add){
	t[x].mn+=add;
	t[x].add+=add;
}

void pushDown(ll x){
	if(t[x].add!=0){
		pushAdd(lc,t[x].add);
		pushAdd(rc,t[x].add);
		t[x].add=0;
	}
}

void Build(ll x,ll l,ll r){
	t[x].l=l;t[x].r=r;
	if(l==r){
		t[x].cnt=Ls[l+1]-Ls[l];
		t[x].mn=0;
		return;
	}
	ll mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x);
}

void Add(ll x,ll l,ll r,ll add){
	if(l<=t[x].l&&t[x].r<=r){
		pushAdd(x,add);
		return;
	}
	pushDown(x);
	ll mid=(t[x].l+t[x].r)>>1;
	if(l<=mid)Add(lc,l,r,add);
	if(r>mid)Add(rc,l,r,add);
	pushUp(x);
}

ll Sum(){
	if(t[1].mn==0)return Ls[Lsn]-Ls[1]-t[1].cnt;
	return Ls[Lsn]-Ls[1];
}

int main(){
	n=read();
	for(ll i=1;i<=n;i++){
		R[i].x1=read();
		R[i].y1=read();
		R[i].x2=read();
		R[i].y2=read();
		Ls[++Lsn]=R[i].x1;
		Ls[++Lsn]=R[i].x2;
	}
	sort(Ls+1,Ls+1+Lsn);
	Lsn=unique(Ls+1,Ls+1+Lsn)-Ls-1;
	for(ll i=1;i<=n;i++){
		R[i].x1=lower_bound(Ls+1,Ls+1+Lsn,R[i].x1)-Ls;
		R[i].x2=lower_bound(Ls+1,Ls+1+Lsn,R[i].x2)-Ls;
		B[++tot]=(Bound){1,R[i].y1,R[i].x1,R[i].x2};
		B[++tot]=(Bound){-1,R[i].y2,R[i].x1,R[i].x2};
	}
	sort(B+1,B+1+tot,cmp);
	Build(1,1,Lsn-1);
	
	ll Ans=0;
	for(ll i=1;i<=tot;i++){
		if(i>1)Ans+=(B[i].h-B[i-1].h)*Sum();
		Add(1,B[i].l,B[i].r-1,B[i].flg);
	}
	cout<<Ans<<'\n';
	return 0;
}