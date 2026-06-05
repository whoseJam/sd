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

const ll N=55;
char mp[N][N];
ll n,m;

struct Frac{
	ll u;
	ll d;
}f[N][N];

ll gcd(ll a,ll b){
	if(!b)return a;
	return gcd(b,a%b);
}

ll lcm(ll a,ll b){
	return a/gcd(a,b)*b;
}

Frac operator +(const Frac& a,const Frac& b){
	ll l=lcm(a.d,b.d);
	ll u=a.u*(l/a.d)+b.u*(l/b.d);
	ll d=l;
	ll g=gcd(u,d);
	return (Frac){u/g,d/g};
}

Frac operator *(const Frac& a,const Frac& b){
	ll u=a.u*b.u;
	ll d=a.d*b.d;
	ll g=gcd(u,d);
	return (Frac){u/g,d/g};
}

int main(){
	n=read();m=read();
	for(ll i=1;i<=n;i++){
		for(ll j=1;j<=i;j++){
			cin>>mp[i][j];
		}
	}
	
	for(ll i=2;i<=n+1;i++){
		for(ll j=1;j<=i;j++){
			f[i][j]=(Frac){0,1};
		}
	}
	f[1][1]=(Frac){1,1};
	
	for(ll i=1;i<=n;i++){
		for(ll j=1;j<=i;j++){
			if(mp[i][j]=='*'){
				f[i+1][j]=f[i+1][j]+f[i][j]*(Frac){1,2};
				f[i+1][j+1]=f[i+1][j+1]+f[i][j]*(Frac){1,2};
			}else{
				if(i+2<=n+1)f[i+2][j+1]=f[i+2][j+1]+f[i][j];
			}
		}
	}
	
	cout<<f[n+1][m+1].u<<"/"<<f[n+1][m+1].d; 
	return 0;
}

