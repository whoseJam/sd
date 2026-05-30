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

const int N=500;
int n,son[N][2];
char root;

void Dfs(char u){
	cout<<u;
	if(son[u][0])Dfs(son[u][0]);
	if(son[u][1])Dfs(son[u][1]);
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		char a,b,c;
		cin>>a>>b>>c;
		if(b!='*')son[a][0]=b;
		if(c!='*')son[a][1]=c;
		if(i==1)root=a;
	}
	Dfs(root);
	return 0;
}

