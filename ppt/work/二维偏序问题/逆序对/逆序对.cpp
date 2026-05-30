#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio> 
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

const ll N=500005;
ll Ls[N],Lsn,a[N],n;

struct TArray{
	ll c[N];
	ll lowbit(ll x){
		return x&(-x);
	}
	void add(ll x,ll d){
		for(ll i=x;i<=Lsn;i+=lowbit(i))
			c[i]+=d;
	}
	ll sum(ll x){
		ll ans=0;
		for(ll i=x;i>0;i-=lowbit(i))
			ans+=c[i];
		return ans;
	}
	ll sum(ll l,ll r){
		return sum(r)-sum(l-1);
	}
	void clear(){
		memset(c,0,sizeof(c));
	}
}T;

int main(){
	n=read();
	for(ll i=1;i<=n;i++){
		a[i]=read();
		Ls[++Lsn]=a[i];
	}
	sort(Ls+1,Ls+1+Lsn);
	Lsn=unique(Ls+1,Ls+1+Lsn)-(Ls+1);
	for(ll i=1;i<=n;i++)
		a[i]=lower_bound(Ls+1,Ls+1+Lsn,a[i])-Ls;
	
	ll ans=0;
	for(ll i=1;i<=n;i++){
		ans+=T.sum(a[i]+1,Lsn);
		T.add(a[i],1);
	} 
	cout<<ans<<'\n';
	return 0;
}
