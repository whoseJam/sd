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

const int N=105;
const int M=10005;
int d[N][N],a[M];
int n,m,ans;

int main(){
	n=read();m=read();
	for(int i=1;i<=m;i++)a[i]=read();
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n;j++){
			d[i][j]=read();
		}
	}
	for(int k=1;k<=n;k++)
		for(int i=1;i<=n;i++)
			for(int j=1;j<=n;j++)
				d[i][j]=min(d[i][j],d[i][k]+d[k][j]);
	for(int i=1;i<m;i++)
		ans+=d[a[i]][a[i+1]];
	cout<<ans;
	return 0;
}

