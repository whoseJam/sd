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

const int N=2000005;
int n,m,mem[N];

int main(){
	int* d=&mem[30005];
	n=read();m=read();
	for(int i=1,v,p;i<=n;i++){
		v=read();p=read();
		d[p-3*v+1]++;
		d[p-2*v+1]-=2;
		d[p+1]+=2;
		d[p+2*v+1]-=2;
		d[p+3*v+1]++;
	}
	for(int i=-30000;i<=m;i++)d[i]+=d[i-1];
	for(int i=-30000;i<=m;i++)d[i]+=d[i-1];
	for(int i=1;i<=m;i++){
		cout<<d[i]<<' ';
	}cout<<'\n';
	return 0;
}

