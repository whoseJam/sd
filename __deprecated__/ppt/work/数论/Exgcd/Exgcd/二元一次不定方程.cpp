#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
using namespace std;

typedef __int128 ll; 
typedef long long LL;

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

ll Exgcd(ll a,ll b,ll& x0,ll& y0){
	if(!b){x0=1;y0=0;return a;}
	ll x1,y1;
	ll d=Exgcd(b,a%b,x1,y1);
	x0=y1;
	y0=x1-(a/b)*y1;
	return d;
}

ll greaterThan(ll a,ll b){ // k > a/b
	if(a%b==0)return a/b+1;
	if(a*b>0)return a/b+1; // k > 3/2 = 1.5 (1==>2)
	return a/b;	// k > -3/2 = -1.5 = -1
}

ll lessThan(ll a,ll b){ // k < a/b
	if(a%b==0)return a/b-1;
	if(a*b>0)return a/b; // k < 3/2 = 1
	return a/b-1; // k < -3/2 = -1.5 (-1==>-2)
}

void Solve(){
	ll a=read(),b=read(),c=read(),x0,y0;
	ll d=Exgcd(a,b,x0,y0);
	if(c%d!=0){
		printf("-1\n");
		return;
	}
	ll k=c/d;x0*=k;y0*=k;
	ll dx=b/d; // x=x0+s*dx
	ll dy=a/d; // y=y0-s*dy
	ll mns=greaterThan(-x0,dx);
	ll mxs=lessThan(y0,dy);
	if(mns<=mxs){
		LL cnt=mxs-mns+1;
		LL minX=x0+mns*dx;
		LL maxX=x0+mxs*dx;
		LL minY=y0-mxs*dy;
		LL maxY=y0-mns*dy;
		printf("%lld %lld %lld %lld %lld\n",cnt,minX,minY,maxX,maxY);
	}else{
		LL minX=x0+mns*dx;
		LL minY=y0-mxs*dy;
		printf("%lld %lld\n",minX,minY);
	}
}

int main(){
	ll Case=read();
	while(Case--)Solve();
	return 0;
}

