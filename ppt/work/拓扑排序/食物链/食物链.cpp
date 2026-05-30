#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<queue>
#include<cmath>
#define GET getchar()
#define LL long long
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
		int s=0,f=1;char t=GET;
		while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
		return s*f;
	}
}
using FastIO::read;

const int N=100005;
int n,m,dp[N];
queue<int>q;

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt,In[N],Out[N];

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;In[v]++;Out[u]++;
}

int main(){
	n=read();m=read();
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		Link(x,y);
	}
	for(int i=1;i<=n;i++){
		if(!In[i]){
			if(Out[i])dp[i]=1;
			q.push(i);
		}
	}
	while(q.size()){
		int u=q.front();q.pop();
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			dp[v]+=dp[u];
			if(!(--In[v]))q.push(v);
		}
	}
	int Ans=0;
	for(int i=1;i<=n;i++)if(!Out[i])Ans+=dp[i];
	cout<<Ans<<'\n';
	return 0;
}
