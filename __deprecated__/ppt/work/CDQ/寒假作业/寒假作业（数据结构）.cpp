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
ll a[N],k,sm[N],n,tot;

struct TArray{
	ll sm[N];
	ll lowbit(ll x){
		return x&(-x);
	}
	void add(ll x,ll d){
		for(ll i=x;i<=tot;i+=lowbit(i))
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
	ll v,i;
}d[N];

bool cmp(const node& a,const node& b){
	if(a.v!=b.v)return a.v<b.v;
	return a.i<b.i;
}

ll Solve(){
	ll ans=0;
	sort(d+1,d+1+tot,cmp);
	for(ll i=1;i<=tot;i++){
		ans+=T.ask(d[i].i);
		T.add(d[i].i,1);
	}
	return ans;
}

int main(){
	n=read();k=read();
	for(ll i=1;i<=n;i++){
		a[i]=read();
		sm[i]=sm[i-1]+a[i];
	}
	for(ll i=0;i<=n;i++)
		d[++tot]=(node){sm[i]-k*i,i+1}; 
	cout<<Solve()<<'\n';
	return 0;
}

