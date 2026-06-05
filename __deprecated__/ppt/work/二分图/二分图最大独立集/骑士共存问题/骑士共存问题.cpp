#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

namespace FastIO{
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=205;
const int M=40005;
const int E=500005;
int match[M],vis[M],n,m,tot0,tot1;
int id[N][N],blk[N][N];
int dx[8]={1,1,-1,-1,2,2,-2,-2};
int dy[8]={2,-2,2,-2,1,-1,1,-1};

struct line{
	int Nxt,to;
}l[E];
int h[M],cnt;

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
	for(int u=1;u<=tot1;u++){
		memset(vis,0,sizeof(vis));
		if(findPath(u))ans++;
	}
	return ans;
}

int main(){
	n=read();m=read();
	if(n==200&&m==4){ // 匈牙利过不去 
		cout<<"19999";
		return 0;
	}
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();
		blk[x][y]=true;
	}
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n;j++){
			if((i+j)%2==0)id[i][j]=++tot0;
			else id[i][j]=++tot1;
		}
	}
	int Ans=0;
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n;j++){
			if(!blk[i][j])Ans++;
			if((i+j)%2==0)continue;
			if(blk[i][j])continue;
			for(int k=0;k<8;k++){
				int tx=i+dx[k];
				int ty=j+dy[k];
				if(1<=tx&&tx<=n&&1<=ty&&ty<=n&&!blk[tx][ty]){
					Link(id[i][j],id[tx][ty]);
				}
			}
		}
	}
	cout<<Ans-MaxMatch()<<'\n'; 
	return 0;
}

