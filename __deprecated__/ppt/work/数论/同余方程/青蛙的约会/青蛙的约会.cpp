#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;
typedef long long ll; 

ll Exgcd(ll a,ll b,ll &x,ll &y){
	if(!b){x=1;y=0;return a;}
	ll x0,y0;
	ll d=Exgcd(b,a%b,x0,y0);
	x=y0;y=x0-(a/b)*y0;
	return d;
}

void Solve(ll a,ll b,ll c){ // ax+by=c, min(x)
	ll x,y;
	ll d=Exgcd(a,b,x,y);
	if(c%d!=0){cout<<"Impossible"<<endl;return;}
	ll k=c/d,tmp=b/d;
	x=k*x;
	x=(x%tmp+tmp)%tmp;
	cout<<x<<endl;
}

int main(){
	ll x,y,m,n,L;
	while(cin>>x>>y>>m>>n>>L){
		if(m==n){
			cout<<"Impossible"<<endl;
			continue;
		}
		if(m>n){
			swap(m,n);
			swap(x,y);
		}
		
		// (n-m)t=x-y(mod L)
		// (n-m)[t]+L[Y]=x-y   []中的是未知数 
		Solve(n-m,L,x-y);
	}
	return 0;
}
