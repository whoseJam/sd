#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
#define	LL long long
using namespace std;

inline LL read(){
	LL sum=0,fu=1;char in=getchar();
	while('0'>in||in>'9'){if(in=='-')fu=-1;in=getchar();}
	while('0'<=in&&in<='9'){sum=sum*10+in-'0';in=getchar();}
	return sum*fu;
}

LL n;

LL phi(LL N){
	LL ans=N;
	for(LL i=2;i<=sqrt(n);i++)
		if(N%i==0){
			ans*=(i-1);ans/=i;
			while(N%i==0)N/=i;
		}
	if(N>1)ans=ans*(N-1)/N;
	return ans;
}

int main(){
	n=read();
	LL ans=0;
	for(LL i=1;i<=sqrt(n);i++){
		if(n%i==0){
			ans+=i*phi(n/i);
			if(i*i<n)ans+=(n/i)*phi(i);
		}
	}
	printf("%lld",ans);
	return 0;
}
