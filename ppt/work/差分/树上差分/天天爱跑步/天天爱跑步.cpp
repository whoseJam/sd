#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<queue>
#include<cmath>
#define GET getchar()
using namespace std;

inline int read(){
	int s=0,f=1;char t=GET;
	while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
	while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
	return s*f;
}

const int N=300000;
const int H=600000;
int fa[N][25],dep[N],w[N],n,Ans[N],m;

struct line{
	int Nxt,to,val;
}l[N*2];
line L[4][N];
int cnt,CNT[4],h[N],Hed[4][N];

void Link(line *Lin,int *Head,int &Cnt,int u,int v,int w){
	Lin[++Cnt]=(line){Head[u],v,w};Head[u]=Cnt;
}

void Dfs(int u,int f,int d){
	fa[u][0]=f;dep[u]=d;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Dfs(v,u,d+1);
	}
}

void LCAInit(){
	int Log=log(n)/log(2);
	for(int j=1;j<=Log;j++)
		for(int i=1;i<=n;i++)fa[i][j]=fa[fa[i][j-1]][j-1];
}

int LCA(int x,int y){
	if(dep[x]<dep[y])swap(x,y);
	int k=log(dep[x])/log(2);
	for(int i=k;i>=0;i--)if(dep[fa[x][i]]>=dep[y])x=fa[x][i];
	if(x==y)return x;
	for(int i=k;i>=0;i--)if(fa[x][i]!=fa[y][i])x=fa[x][i],y=fa[y][i];
	return fa[x][0];
}

int q[H],p[H];
void Count(int u,int f){
	int memq=q[w[u]+dep[u]],memp=p[w[u]-dep[u]+N];
	for(int i=Hed[0][u];i;i=L[0][i].Nxt)q[L[0][i].val]++;
	for(int i=Hed[2][u];i;i=L[2][i].Nxt)p[L[2][i].val]++;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Count(v,u);
	}
	Ans[u]+=q[w[u]+dep[u]]-memq+p[w[u]-dep[u]+N]-memp;
	for(int i=Hed[1][u];i;i=L[1][i].Nxt)q[L[1][i].val]--;
	for(int i=Hed[3][u];i;i=L[3][i].Nxt)p[L[3][i].val]--;
}

int main(){
	n=read();m=read();
	for(int i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(l,h,cnt,x,y,0);
		Link(l,h,cnt,y,x,0);
	}
	Dfs(1,0,1);
	LCAInit();
	for(int i=1;i<=n;i++)w[i]=read();
	for(int i=1,x,y,g;i<=m;i++){
		x=read();y=read();g=LCA(x,y);
		if(dep[x]==dep[g]+w[g])Ans[g]--;
		Link(L[0],Hed[0],CNT[0],x,0,dep[x]);
		Link(L[1],Hed[1],CNT[1],g,0,dep[x]);
		Link(L[2],Hed[2],CNT[2],y,0,dep[x]-dep[g]*2+N);
		Link(L[3],Hed[3],CNT[3],g,0,dep[x]-dep[g]*2+N);
	}
	Count(1,0);
	for(int i=1;i<=n;i++)
		printf("%d ",Ans[i]);
	return 0;
}
