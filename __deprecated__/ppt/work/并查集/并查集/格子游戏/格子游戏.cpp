#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=205;
int fa[N*N],id[N][N],n,m,tot;

int GetFa(int x){
	if(fa[x]==x)return x;
	return fa[x]=GetFa(fa[x]);
}

void Merge(int stp,int x,int y){
	int fx=GetFa(x),fy=GetFa(y);
	if(fx==fy){
		cout<<stp<<endl;
		exit(0);
	}
	fa[fx]=fy;
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n*n;i++)fa[i]=i;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			id[i][j]=++tot;
	
	char opt[3];
	for(int i=1,x,y;i<=m;i++){
		x=read();y=read();scanf("%s",opt);
		if(opt[0]=='D'){
			Merge(i,id[x][y],id[x+1][y]);
		}else{
			Merge(i,id[x][y],id[x][y+1]);
		}
	}
	cout<<"draw"<<endl;
	return 0;
}
