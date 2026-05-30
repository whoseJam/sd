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

const int N=200005;
int n,K,col[N];

int Solve(int v){
	int cur[4]={0},cnt=1;
	for(int i=1;i<=n;i++){
		cur[col[i]]++;
		if(cur[1]*cur[2]*cur[3]>v){
			cnt++;
			cur[1]=cur[2]=cur[3]=0;
			cur[col[i]]++;
		}
	}
	return cnt;
}

int main(){
	n=read();K=read();
	for(int i=1;i<=n;i++)
		col[i]=read();
	
	int l=0,r=1e8,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(Solve(mid)<=K)r=mid-1;
		else l=mid+1;
	}
	cout<<l<<'\n';
	return 0;
}
