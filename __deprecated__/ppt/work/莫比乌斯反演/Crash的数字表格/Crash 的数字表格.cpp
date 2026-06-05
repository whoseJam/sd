#include<iostream>
#include<cstring>
#include<cstdio>
#define LL long long
#define mod 20101009
using namespace std;

inline LL read(){
	LL sum=0,fu=1;char in=getchar();
	while('0'>in||in>'9'){if(in=='-')fu=-1;in=getchar();}
	while('0'<=in&&in<='9'){sum=sum*10+in-'0';in=getchar();}
	return sum*fu;
}

const LL N=10000005;
bool vis[N];
LL prim[N],tot;
LL F[N],Sum[N],cot;
LL G[N],mu[N];

void getPrim(LL up){
	F[1]=1;mu[1]=1;
	for(LL i=2;i<=up;i++){
		if(!vis[i])prim[++tot]=i,F[i]=1-i,mu[i]=-1;
		for(LL j=1;j<=tot&&i*prim[j]<=up;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0){
				F[i*prim[j]]=F[i];
				break;
			}
			mu[i*prim[j]]=-mu[i];
			F[i*prim[j]]=F[i]*F[prim[j]];
			F[i*prim[j]]%=mod;
		}
	}
	for(LL i=1;i<=up;i++)if(mu[i])for(LL j=i;j<=up;j+=i)G[j]=(G[j]+mu[i]*i)%mod;
	for(LL i=1;i<=up;i++)Sum[i]=Sum[i-1]+i,Sum[i]%=mod;
}

int main(){
	LL n=read(),m=read(),ans=0;
	getPrim(max(n,m));
	for(LL i=1;i<=min(n,m);i++){
		cot=(Sum[n/i]*Sum[m/i])%mod;
		cot*=G[i];cot%=mod;
		cot*=i;cot%=mod;
		ans+=cot;ans%=mod;
	}
	printf("%lld",(ans%mod+mod)%mod);
	return 0;
}
