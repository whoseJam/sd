#include<iostream>
#include<cstring>
#include<cstdio>
#define LL long long
using namespace std;

inline int read(){
	int sum=0,fu=1;char in=getchar();
	while('0'>in||in>'9'){if(in=='-')fu=-1;in=getchar();}
	while('0'<=in&&in<='9'){sum=sum*10+in-'0';in=getchar();}
	return sum*fu;
}

const int N=50005;
int n,m;
bool vis[N];
int prim[N],mu[N],tot;
LL sum[N],F[N];

LL Ask(int x){
	LL ans=0;
	for(int l=1,r;l<=x;l=r+1){
		r=x/(x/l);
		ans+=(LL)(r-l+1)*(LL)(x/l);
	}
	return ans;
}

void Sieve(int up){
	mu[1]=1;F[1]=Ask(1);
	for(int i=2;i<=up;i++){
		F[i]=Ask(i);
		if(!vis[i])prim[++tot]=i,mu[i]=-1;
		for(int j=1;j<=tot&&i*prim[j]<=up;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0)break;
			else mu[i*prim[j]]=-mu[i];
		}
	}
	for(int i=1;i<=up;i++)sum[i]=sum[i-1]+mu[i];
}

int main(){
	Sieve(50000);
	int Case=read();
	while(Case--){
		n=read();m=read();
		LL Ans=0;
		for(int l=1,r;l<=min(n,m);l=r+1){
			r=min(n/(n/l),m/(m/l));
			Ans+=(sum[r]-sum[l-1])*F[n/l]*F[m/l];
		}
		printf("%lld\n",Ans);
	}
	return 0;
}
