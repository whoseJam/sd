#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef long long ll;
const ll Mod=10007;
ll C[1005][1005];
ll A,B,K,N,M;

void Pre(ll n=1000){
	C[0][0]=1;
	for(ll i=1;i<=n;i++){
		C[i][0]=C[i][i]=1;
		for(ll j=1;j<i;j++)
			C[i][j]=(C[i-1][j-1]+C[i-1][j])%Mod;
	}
}

ll Fastpow(ll a,ll b){
	ll ans=1;
	while(b){
		if(b&1)ans=(ans*a)%Mod;
		b>>=1;a=(a*a)%Mod;
	}
	return ans;
}

int main(){
	cin>>A>>B>>K>>N>>M;Pre();
	cout<<(C[K][N]*Fastpow(A,N)*Fastpow(B,M))%Mod;
	return 0;
}