#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=100005;
int n,K,L[N],maxL,sumL;

int Solve(int v){
	int ans=0;
	for(int i=1;i<=n;i++){
		ans+=(L[i]/v);
	}
	return ans;
}

int main(){
	n=read();K=read();
	for(int i=1;i<=n;i++){
		L[i]=read();
		maxL=max(maxL,L[i]);
		sumL+=L[i];
	}
	if(K>sumL){
		cout<<0<<'\n';
		return 0;
	}
	int l=1,r=maxL,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(Solve(mid)>=K)l=mid+1;
		else r=mid-1;
	}
	cout<<r<<'\n';
	return 0;
}

