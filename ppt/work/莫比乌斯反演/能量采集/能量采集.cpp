#include<iostream>
#include<cstring>
#include<cstdio>
#define LL long long
using namespace std;

inline LL read(){
	LL sum=0,fu=1;char in=getchar();
	while('0'>in||in>'9'){if(in=='-')fu=-1;in=getchar();}
	while('0'<=in&&in<='9'){sum=sum*10+in-'0';in=getchar();}
	return sum*fu;
}

const LL MAXN=100005; 
bool vis[MAXN];
LL prim[MAXN],tot=0,phi[MAXN];
void Sieve(LL N){
	phi[1]=1;
	for(LL i=2;i<=N;i++){
		if(!vis[i])prim[++tot]=i,phi[i]=i-1;
		for(LL j=1;j<=tot&&prim[j]*i<=N;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0){
				phi[i*prim[j]]=phi[i]*prim[j];
				break;
			}else phi[i*prim[j]]=phi[i]*(prim[j]-1);
		}
	}
}

int main(){
	LL n=read(),m=read();
	Sieve(min(n,m));
	LL ans=0;
	for(LL d=1;d<=min(n,m);d++){
		ans+=phi[d]*(n/d)*(m/d);
	}
	printf("%lld",ans*2-m*n);
	return 0;
}
