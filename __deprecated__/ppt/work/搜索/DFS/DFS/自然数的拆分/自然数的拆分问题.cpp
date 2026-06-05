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

int p[100],n;

void Dfs(int dep){
	int sum=0;
	for(int i=1;i<=dep-1;i++)
		sum+=p[i];
	if(sum==n&&dep>2){
		for(int i=1;i<=dep-1;i++)
			cout<<p[i]<<("+\n"[i==dep-1]);
		return;
	}
	int mn=(dep==1)?1:p[dep-1];
	for(int i=mn;i<=n;i++){
		if(sum+i<=n){
			p[dep]=i;
			Dfs(dep+1);
			p[dep]=0;
		}
	}
}

int main(){
	n=read();
	Dfs(1);
	return 0;
}

