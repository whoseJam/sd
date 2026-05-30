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

const int N=155;
const int M=6005;
int match[N],vis[N],n,m;
int matchedBy[N];

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

bool findPath(int u){
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(!vis[v]){
			vis[v]=true;
			if(!match[v]||findPath(match[v])){
				match[v]=u;
				return true;
			}
		}
	}
	return false;
}

int MaxMatch(){
	int ans=0;
	memset(match,0,sizeof(match));
	for(int u=1;u<=n;u++){
		memset(vis,0,sizeof(vis));
		if(findPath(u))ans++;
	}
	return ans;
}

void output(int x){
	if(match[x])output(match[x]);
	cout<<x<<' ';
}

int main(){
	n=read();m=read();
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		Link(x,y);
	}
	int cnt=n-MaxMatch();
	for(int i=1;i<=n;i++)
		matchedBy[match[i]]=i;
	for(int i=1;i<=n;i++){
		if(!matchedBy[i]){
			output(i);
			cout<<'\n';
		}
	}
	cout<<cnt<<'\n';
	return 0;
}

