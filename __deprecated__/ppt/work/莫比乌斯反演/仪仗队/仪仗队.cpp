#include<iostream>
#include<cstring>
#include<cstdio>
#define GET getchar()
using namespace std;

inline int read(){
	int s=0,f=1;char t=GET;
	while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
	while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
	return s*f;
}

const int N=40005;
bool vis[N];
int prim[N],tot,mu[N],sum[N];

void Sieve(int up){
	mu[1]=1;sum[1]=1; 
	for(int i=2;i<=up;i++){
		if(!vis[i])mu[prim[++tot]=i]=-1;
		for(int j=1;j<=tot&&i*prim[j]<=up;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0)break;
			mu[i*prim[j]]=-mu[i];
		}
		sum[i]=sum[i-1]+mu[i];
	}
}

int main(){
	int n=read()-1,ans=0;
	Sieve(n);
	for(int l=1,r;l<=n;l=r+1){
		r=n/(n/l);
		ans+=(n/l)*(n/l)*(sum[r]-sum[l-1]);
	}
	if(n==0)cout<<0;
	else printf("%d",ans+2);
	return 0;
}
