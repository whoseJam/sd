#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef long long ll;

namespace FastIO{
	inline ll read(){
		ll s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const ll M=15;
ll a[M],b[M];

ll Exgcd(ll a,ll b,ll &x,ll &y){
	if(!b){x=1;y=0;return a;}
	ll x1,y1;
	ll d=Exgcd(b,a%b,x1,y1);
	x=y1;
	y=x1-(a/b)*y1;
	return d;
}

ll gcd(ll a,ll b){
	if(!b)return a;
	return gcd(b,a%b);
}

ll lcm(ll a,ll b){
	return a/gcd(a,b)*b;
}

void Solve(){
	ll n=read(),m=read();
	for(ll i=1;i<=m;i++)a[i]=read();
	for(ll i=1;i<=m;i++)b[i]=read();

	// x mod a[i] = b[i]
	ll a1=a[1],b1=b[1],x=b1;
	for(ll i=2;i<=m;i++){
		ll x0,y0,c=b[i]-b1;
		ll d=Exgcd(a1,a[i],x0,y0);
		if(c%d!=0){
			cout<<0<<'\n';
			return;
		}
		x=b1+(x0*c/d)*a1;
		b1=x;
		a1=lcm(a1,a[i]);
		x=(x%a1+a1)%a1;
	}
	if(x>n){
		cout<<0<<'\n';
		return;
	}
	ll cnt=0;
	if(0<x&&x<n)cnt++;
	cnt+=(n-x)/a1;
	cout<<cnt<<'\n';
}

int main(){
	ll Case=read();
	while(Case--)Solve();
	return 0;
}

