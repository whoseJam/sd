#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;
const int N=100005;
int mu[N],sum[N],prim[N],tot=0;
bool vis[N];

inline int read(){
	int sum=0,fu=1;char in=getchar();
	while('0'>in||in>'9'){if(in=='-')fu=-1;in=getchar();}
	while('0'<=in&&in<='9'){sum=sum*10+in-'0';in=getchar();}
	return sum*fu;
}

void Sieve(){
	mu[1]=1;
	for(int i=2;i<=50000;i++){
		if(!vis[i])prim[++tot]=i,mu[i]=-1;
		for(int j=1;j<=tot&&i*prim[j]<=50000;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0)break;
			else mu[i*prim[j]]=-mu[i];
		}
	}
	for(int i=1;i<=50000;i++)
		sum[i]=sum[i-1]+mu[i];
}

int main(){
	int Case=read();
	Sieve();
	while(Case--){
		int a=read(),b=read(),k=read(),ans=0;
		a/=k;b/=k;
		if(a>b)swap(a,b);
		for(int l=1,r;l<=a;l=r+1){
			r=min(a/(a/l),b/(b/l));
			ans+=(a/l)*(b/l)*(sum[r]-sum[l-1]);
		}
		printf("%d\n",ans);
	}
	return 0;
}
