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

const int Mod=100000000;
const int N=13;
const int M=13;
int m,n,stat[M],f[M][1<<12];
vector<int> validS[M];

int main(){
	m=read();n=read();
	for(int i=1;i<=m;i++){
		stat[i]=0;
		for(int j=1;j<=n;j++){
			stat[i]=(stat[i]<<1)|read();
		}
	}
	int All=(1<<n)-1;
	for(int S=0;S<=All;S++){
		if(S&(S<<1))continue;
		for(int i=1;i<=m;i++){
			if((stat[i]&S)==S)validS[i].push_back(S);
		}
	}
	

	for(int S:validS[1])f[1][S]=1;
	for(int i=1;i<m;i++){
		for(int S:validS[i]){
			if(!f[i][S])continue;
			for(int T:validS[i+1]){
				if((S&T)==0)f[i+1][T]=(f[i+1][T]+f[i][S])%Mod;
			}
		}
	}
	int ans=0;
	for(auto T:validS[m]){
		ans=(ans+f[m][T])%Mod;
	}
	cout<<ans<<'\n';
	return 0;
}

