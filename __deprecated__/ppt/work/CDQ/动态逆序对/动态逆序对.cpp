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

const ll N=100005;
ll n,m,ans[N],a[N];

struct TArray{
	ll sm[N];
	ll lowbit(ll x){
		return x&(-x);
	}
	void add(ll x,ll d){
		for(ll i=x;i<=n;i+=lowbit(i))
			sm[i]+=d;
	}
	ll ask(ll x){
		ll ans=0;
		for(ll i=x;i>0;i-=lowbit(i))
			ans+=sm[i];
		return ans;
	}
	void clear(){
		memset(sm,0,sizeof(sm));
	}
}T;

struct node{
	ll x,a,t;
}d[N];
bool cmpT(const node& a,const node& b){
	return a.t>b.t;
}
bool cmpX(const node& a,const node& b){
	return a.x<b.x;
}

void Solve1(ll l,ll r){
	ll mid=(l+r)>>1;
	ll cur=l-1;
	for(ll i=mid+1;i<=r;i++){ // Tj>Ti
		while(cur+1<=mid&&d[cur+1].x<d[i].x){ // Xj<Xi
			cur++;
			T.add(d[cur].a,1);
		}
		ans[d[i].t]+=T.ask(n)-T.ask(d[i].a); // Aj>Ai
	}
	for(ll i=l;i<=cur;i++)
		T.add(d[i].a,-1);
}

void Solve2(ll l,ll r){
	ll mid=(l+r)>>1;
	ll cur=mid+1;
	for(ll i=r;i>=mid+1;i--){ // Tj>Ti
		while(cur-1>=l&&d[cur-1].x>d[i].x){ // Xj>Xi
			cur--;
			T.add(d[cur].a,1);
		}
		ans[d[i].t]+=T.ask(d[i].a); // Aj<Ai
	}
	for(ll i=mid;i>=cur;i--)
		T.add(d[i].a,-1);
}

void CDQ(ll l,ll r){
	if(l==r)return;
	ll mid=(l+r)>>1;
	CDQ(l,mid);
	CDQ(mid+1,r);
	Solve1(l,r);
	Solve2(l,r);
	sort(d+l,d+r+1,cmpX);
}

int main(){
	n=read();m=read();
	for(ll i=1;i<=n;i++){
		a[i]=read();
		d[a[i]].x=i;
		d[a[i]].a=a[i];
	}
	for(ll i=1,x;i<=m;i++){
		x=read();
		d[x].t=i;
	}
	for(ll i=1;i<=n;i++)
		if(d[i].t==0)d[i].t=m+1;
	sort(d+1,d+1+n,cmpT);
	CDQ(1,n);
	
	ll Ans=0;
	for(ll i=n;i>=1;i--){
		Ans+=T.ask(a[i]);
		T.add(a[i],1);
	}
	for(ll i=1;i<=m;i++){
		cout<<Ans<<'\n';
		Ans-=ans[i];
	}
	return 0;
}

