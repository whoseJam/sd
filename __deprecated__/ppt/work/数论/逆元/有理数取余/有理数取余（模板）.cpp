#include<bits/stdc++.h>
using namespace std;

typedef long long ll;

const ll Mod=19260817;

ll read(){
	ll s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		s=s%Mod;
		t=getchar();
	}
	return s*f;
}

ll Fpow(ll a,ll b){
	ll ans=1;
	while(b){
		if(b&1)ans=ans*a%Mod;
		b>>=1;a=a*a%Mod;
	}
	return ans;
}

ll Inv(ll x){
	return Fpow(x,Mod-2);
} 

int main(){
	ll a=read(),b=read();
	if(b==0)cout<<"Angry!\n";
	else cout<<a*Inv(b)%Mod<<'\n';
	return 0;
}

