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

const int inf=0x3f3f3f3f;
const int N=105;
int d[N][N],n,m;

void Floyd(){
	for(int k=1;k<=n;k++)
		for(int i=1;i<=n;i++)
			for(int j=1;j<=n;j++)
				d[i][j]=min(d[i][j],d[i][k]+d[k][j]);
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			if(i!=j)d[i][j]=inf;
	for(int i=1,x,y,w;i<=m;i++){
		x=read();y=read();w=read();
		d[x][y]=min(d[x][y],w);
		d[y][x]=min(d[y][x],w);
	} 
	Floyd();
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n;j++)
			cout<<d[i][j]<<' ';
		cout<<'\n';
	}
	return 0;
}

