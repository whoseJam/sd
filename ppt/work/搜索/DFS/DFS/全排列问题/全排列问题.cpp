#include<iostream>
#include<iomanip>
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

int n,p[10],used[10];

void Dfs(int dep){
	if(dep==n){
		for(int i=0;i<n;i++){
			cout<<setw(5)<<p[i];
		}cout<<'\n';
		return;
	}
	for(int i=1;i<=n;i++){
		if(!used[i]){
			p[dep]=i;
			used[i]=1;
			Dfs(dep+1);
			p[dep]=0;
			used[i]=0;
		}
	}
} 

int main(){
	n=read();
	Dfs(0);
	return 0;
}

