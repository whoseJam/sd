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

const int N=105;
char mp[N][N];
int n,m,col[N][N];
int dx[4]={0,-1,0,1};
int dy[4]={-1,0,1,0};

void Dfs(int x,int y){
	col[x][y]=1;
	for(int i=0;i<4;i++){
		int tx=x+dx[i];
		int ty=y+dy[i];
		if(1<=tx&&tx<=n&&1<=ty&&ty<=m&&!col[tx][ty]&&mp[tx][ty]!='0'){
			Dfs(tx,ty);
		}
	}
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++)
			cin>>mp[i][j];

	int Ans=0;
	for(int i=1;i<=n;i++){
		for(int j=1;j<=m;j++){
			if(mp[i][j]!='0'&&!col[i][j]){
				Dfs(i,j);
				Ans++;
			}
		}
	}
	cout<<Ans<<'\n';
	return 0;
}

