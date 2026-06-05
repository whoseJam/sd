#include<bits/stdc++.h>
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

//void DP(){
//	f[1][1][1][1]=a[1][1];//³õÊ¼»¯
//	for(int x1=1;x1<=m;x1++)
//		for(int y1=1;y1<=n;y1++)
//			for(int x2=1;x2<=m;x2++)
//				for(int y2=1;y2<=n;y2++){
//					int t=0;
//					if(f[x1-1][y1][x2-1][y2]>t)t=f[x1-1][y1][x2-1][y2];
//					if(f[x1][y1-1][x2-1][y2]>t)t=f[x1][y1-1][x2-1][y2];
//					if(f[x1-1][y1][x2][y2-1]>t)t=f[x1-1][y1][x2][y2-1];
//					if(f[x1][y1-1][x2][y2-1]>t)t=f[x1][y1-1][x2][y2-1];
//					if(x1!=x2||y1!=y2)f[x1][y1][x2][y2]=t+a[x1][y1]+a[x2][y2];
//				}
//	cout<<f[m][n-1][m-1][n]<<endl;
//} 

const int N=105;
int f[N][N][N],a[N][N],m,n;

int main(){
	cin>>m>>n;
	for(int i=1;i<=m;i++)
		for(int j=1;j<=n;j++)cin>>a[i][j];
	f[2][1][1]=a[1][1];
	for(int k=3;k<=m+n;k++)
		for(int x1=1;x1<=m;x1++)
			for(int x2=x1+1;x2<=m;x2++){
				int maxx=0;
				if(f[k-1][x1][x2]>maxx)maxx=f[k-1][x1][x2];
				if(f[k-1][x1-1][x2]>maxx)maxx=f[k-1][x1-1][x2];
				if(f[k-1][x1][x2-1]>maxx)maxx=f[k-1][x1][x2-1];
				if(f[k-1][x1-1][x2-1]>maxx)maxx=f[k-1][x1-1][x2-1];
				f[k][x1][x2]=maxx+a[x1][k-x1]+a[x2][k-x2];
			}
	cout<<f[m+n-1][m-1][m];
	return 0;
}

