#include<iostream>
#include<complex>
#include<cstring>
#include<cstdio>
#include<cmath>
#include<map>
using namespace std;
using ll=long long;

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

const ll Mod=998244353;
const ll g=3;
const ll N=4000005;
ll A[N],B[N],tmp[N],wk[N];
ll rev[N],n;

ll Fpow(ll a,ll b){
	ll ans=1;
	while(b){
		if(b&1)ans=ans*a%Mod;
		b>>=1;a=a*a%Mod;
	}
	return ans;
}

ll Make(ll len){
	ll l=log2(len)+1;len=1<<l;
	for(ll i=0;i<len;i++)
		rev[i]=rev[i>>1]>>1|((i&1)<<(l-1));
	return len;
}

void NTT(ll a[],ll len,ll flg){
	ll root=flg==1?g:Fpow(g,Mod-2);
	for(ll i=0;i<len;i++)if(rev[i]>i)swap(a[rev[i]],a[i]);
	for(ll i=1;i<len;i<<=1){
		ll wi=Fpow(root,(Mod-1)/(2*i));
		wk[0]=1;
		for(ll k=1;k<i;k++)wk[k]=wk[k-1]*wi%Mod;
		for(ll j=0;j<len;j+=(i*2))
			for(ll k=0;k<i;k++){
				ll x=a[j+k];
				ll y=a[i+j+k]*wk[k]%Mod;
				a[j+k]=(x+y)%Mod;
				a[i+j+k]=(x-y+Mod)%Mod;
			}
	}
	if(flg==-1){
		ll inv=Fpow(len,Mod-2);
		for(ll i=0;i<len;i++)a[i]=a[i]*inv%Mod;
	}
}

void Inverse(ll a[],ll b[],ll len){
	if(len==1){b[0]=Fpow(a[0],Mod-2);return;}
	Inverse(a,b,len/2);
	ll l=Make(len*2);
	for(ll i=0;i<len;i++)tmp[i]=a[i];
	for(ll i=len;i<l;i++)tmp[i]=0;
	for(ll i=len/2;i<l;i++)b[i]=0;
	NTT(b,l,1);NTT(tmp,l,1); // tmp is a
	for(ll i=0;i<l;i++)
		b[i]=(2*b[i]%Mod-b[i]*b[i]%Mod*tmp[i]%Mod+Mod)%Mod;
	NTT(b,l,-1);
	for(ll i=len;i<l;i++)b[i]=0;
} 

int main(){
	n=read();
	for(ll i=0;i<n;i++)A[i]=read();
	
	Inverse(A,B,(1<<(int)(log2(n)+1)));
	for(ll i=0;i<n;i++)cout<<B[i]%Mod<<' ';
	return 0;
}


