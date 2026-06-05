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

const int N=1005;
int n,A[N][N],F[N][N]; 

int Dfs(int i,int j){
	if(i==0||j==0)return 0;
	if(F[i][j]!=-1)return F[i][j];
	F[i][j]=A[i][j]+max(Dfs(i-1,j-1),Dfs(i-1,j));
	return F[i][j];
}

int Solve(){
	for(int i=1;i<=n;i++){
		for(int j=1;j<=i;j++){
			F[i][j]=A[i][j]+max(F[i-1][j-1],F[i-1][j]);
		}
	}
	int ans=0;
	for(int j=1;j<=n;j++)ans=max(ans,F[n][j]);
	return ans;
}

int main(){
	n=read();
	for(int i=1;i<=n;i++)
		for(int j=1;j<=i;j++)A[i][j]=read();
//	cout<<Solve()<<'\n';
	
	memset(F,-1,sizeof(F));
	int ans=0;
	for(int j=1;j<=n;j++)ans=max(ans,Dfs(n,j));
	cout<<ans<<'\n';
	return 0;
}

