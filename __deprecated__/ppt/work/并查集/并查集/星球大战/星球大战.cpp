#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
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
int atk[N],isAtked[N],Ans[N],fa[N];
int n,m,k,block;

vector<int>link[N];

int GetFa(int x){
	if(fa[x]==x)return x;
	return fa[x]=GetFa(fa[x]);
}

void Merge(int x,int y){
	int fx=GetFa(x),fy=GetFa(y);
	if(fx==fy)return;
	fa[fx]=fy;block--;
}

int main(){
	n=read();m=read();
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		link[x].push_back(y);
		link[y].push_back(x);
	}
	k=read();
	for(int i=1;i<=k;i++){
		atk[i]=read();
		isAtked[atk[i]]=true;
	}
	block=n;
	for(int i=0;i<n;i++)fa[i]=i;
	for(int u=0;u<n;u++)
		for(auto v:link[u])
			if(!isAtked[u]&&!isAtked[v])
				Merge(u,v);
	
	Ans[k+1]=block-k;
	for(int i=k;i>=1;i--){
		int u=atk[i];
		isAtked[u]=false;
		for(auto v:link[u])
			if(!isAtked[u]&&!isAtked[v])
				Merge(u,v);
		Ans[i]=block-(i-1);
	}
	
	for(int i=1;i<=k+1;i++)
		cout<<Ans[i]<<'\n'; 
	return 0;
}

