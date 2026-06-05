#include<iostream>
#include<cstring>
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

const int N=1000005;
const int lim=19;
int nxt[N],fa[N][20],dep[N],n,m;
char A[N];

void Prepare(){
	nxt[1]=0;
	int cur=0;
	for(int i=2;i<=n;i++){
		while(cur&&A[cur+1]!=A[i])
			cur=nxt[cur];
		if(A[cur+1]==A[i])nxt[i]=++cur;
		else nxt[i]=0;
	}
	for(int u=1;u<=n;u++){
		fa[u][0]=nxt[u];
		dep[u]=dep[nxt[u]]+1;
		for(int i=1;i<=lim;i++)
			fa[u][i]=fa[fa[u][i-1]][i-1];
	}
} 

int LCA(int x,int y){
	if(dep[x]<dep[y])swap(x,y);
	for(int i=lim;i>=0;i--)
		if(dep[fa[x][i]]>=dep[y])x=fa[x][i];
	if(x==y)return x;
	for(int i=lim;i>=0;i--)
		if(fa[x][i]!=fa[y][i]){
			x=fa[x][i];
			y=fa[y][i];
		}
	return fa[x][0];
}

int main(){
	scanf("%s",A+1);n=strlen(A+1); 
	Prepare();
	m=read();
	for(int i=1,p,q,f;i<=m;i++){
		p=read();q=read();
		f=LCA(fa[p][0],fa[q][0]);
		cout<<f<<'\n';
	}
	return 0;
}


