#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef long long ll; 

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

ll gcd(ll a,ll b){
	if(!b)return a;
	return gcd(b,a%b);
}

ll lcm(ll a,ll b){
	return a/gcd(a,b)*b;
}

struct Frac{
	ll u;
	ll d;
};

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

ll digitCount(ll x){
	ll ans=0;
	while(x){ans++;x/=10;}
	return ans;
}

void output(char x,int count){
	for(int i=1;i<=count;i++)
		cout<<x;
}

int main(){
	ll n=read();

	Frac ans=(Frac){0,1};
	for(ll i=1;i<=n;i++){
		ans=ans+(Frac){n,i};
	}
	
	ll u=ans.u;
	ll d=ans.d;
	ll v=u/d;
	ll r=u%d;
	
	if(r==0){
		cout<<v;
		return 0;
	}
	
	output(' ', digitCount(v));
	cout<<r<<'\n';
	
	cout<<v;
	output('-', digitCount(d));
	cout<<'\n';
	
	output(' ', digitCount(v));
	cout<<d;
	return 0;
}

