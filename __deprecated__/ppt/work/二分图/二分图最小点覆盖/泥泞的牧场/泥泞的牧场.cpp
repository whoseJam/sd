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

const int N=55;
const int M=1005;
const int E=500005;
int match[M],vis[M],R,C,Ans;
int rowId[N][N],colId[N][N],tot;
char mp[N][N]; 

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
	for(int u=1;u<=tot;u++){
		memset(vis,0,sizeof(vis));
		if(findPath(u))ans++;
	}
	return ans;
}

int main(){
	R=read();C=read();
	for(int i=1;i<=R;i++){
		for(int j=1;j<=C;j++){
			cin>>mp[i][j];
		}
	}
	for(int i=1;i<=R;i++){
		for(int j=1;j<=C;j++){
			if(mp[i][j]=='*')tot++;
			while(mp[i][j]=='*'){
				rowId[i][j]=tot;
				j++;
			}
		}
	}
	for(int j=1;j<=C;j++){
		for(int i=1;i<=R;i++){
			if(mp[i][j]=='*')tot++;
			while(mp[i][j]=='*'){
				colId[i][j]=tot;
				i++;
			}
		}
	} 
	for(int i=1;i<=R;i++)
		for(int j=1;j<=C;j++)
			if(mp[i][j]=='*'){
				Link(rowId[i][j],colId[i][j]);
			}
	cout<<MaxMatch()<<'\n';
	return 0;
}

