#include<iostream>
#include<cstdio>
#include<cstring>
#define ll __int128 
using namespace std;
ll N,a[10005],b[10005],M=1,ans=0;

ll read(){
	int tmp;
	cin>>tmp;
	return tmp;
}

void EXgcd(ll A,ll B,ll &x,ll &y,ll &gcd){
	if(!B){x=1;y=0;gcd=A;return;}
	EXgcd(B,A%B,x,y,gcd);
	ll tmp=x;x=y;y=tmp-(A/B)*y;
}

void output(ll x){
	if(x==0)return;
	output(x/10);
	int tmp=(x%10);
	cout<<tmp;
}

int main(){
	N=read();
	for(ll i=1;i<=N;i++){
		a[i]=read();
		b[i]=read();
		M*=a[i];
	}
	for(ll i=1;i<=N;i++){
		ll Mi=M/a[i],B=a[i],gcd,x0,y0,x;
		EXgcd(Mi,B,x0,y0,gcd);
		ans=((ans+Mi*x0*b[i])%M+M)%M;
	}
	output(ans);
	return 0;
}