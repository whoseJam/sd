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

const int Mod=1e9+7;
const int N=22;
int n,a[N][N],f[N][1<<21];

bool contain(int S,int i){
	return (S>>i-1)&1;
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n;j++){
			a[i][j]=read();
		}
	}
	
	int All=(1<<n)-1;
	f[0][0]=1;
	for(int i=0;i<n;i++){
		for(int S=0;S<=All;S++){
			if(!f[i][S])continue;
			for(int w=1;w<=n;w++){
				if(contain(S,w))continue;
				if(!a[i+1][w])continue;
				int T=S|(1<<w-1);
				f[i+1][T]=(f[i+1][T]+f[i][S])%Mod;
			}
		}
	}
	cout<<f[n][All]<<'\n';
	return 0;
}

