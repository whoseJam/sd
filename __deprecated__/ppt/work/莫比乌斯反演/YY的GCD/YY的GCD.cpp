#include<iostream>
#include<cstring>
#include<cstdio>
#define LL long long
using namespace std;

const int maxn=10000005;
bool vis[maxn];
int prim[maxn],mu[maxn],F[maxn],tot=0;
LL sum[maxn];

inline int read(){
	int sum=0,fu=1;char in=getchar();
	while('0'>in||in>'9'){if(in=='-')fu=-1;in=getchar();}
	while('0'<=in&&in<='9'){sum=sum*10+in-'0';in=getchar();}
	return sum*fu;
}

void Sieve(int N){
	mu[1]=1;
	for(int i=2;i<=N;i++){
		if(!vis[i]){
			prim[++tot]=i;
			mu[i]=-1;
		}
		for(int j=1;j<=tot&&prim[j]*i<=N;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0){
				mu[i*prim[j]]=0;
				break;
			}else mu[i*prim[j]]=-mu[i];
		}
	}
	for(int i=1;i<=tot;i++)
		for(int j=1;j*prim[i]<=N;j++)
			F[j*prim[i]]+=mu[j];
	for(int i=1;i<=N;i++)
		sum[i]=sum[i-1]+(LL)F[i];
}

int main(){
	int Case=read();
	Sieve(10000000);
	while(Case--){
		LL N=read(),M=read(),ans=0;
		if(N>M)swap(N,M);
		for(LL l=1,r;l<=N;l=r+1){
			r=min(N/(N/l),M/(M/l));
			ans+=(N/l)*(M/l)*(sum[r]-sum[l-1]);
		}
		printf("%lld\n",ans);
	}
	return 0;
}
