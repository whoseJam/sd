#include<bits/stdc++.h>
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

const int inf=0x3f3f3f3f;
const int N=105;
const int M=15;
int pow3[M],f[N][60000];
int n,m,lastS[M],curS[M],ans;
char s[N][M];

void decode(int S){
	for(int i=1;i<=m;i++){
		lastS[i]=S%3;
		S/=3;
	}
}

int encode(){
	int ans=0;
	for(int i=1;i<=m;i++)
		ans=ans+pow3[i-1]*curS[i];
	return ans;
}

void Dfs(int i,int j,int cnt){
	int S=encode();
	f[i][S]=max(f[i][S],cnt);
	ans=max(ans,cnt);
	for(;j<=m;j++){
		if(lastS[j]==0&&curS[j]==0&&s[i][j]=='P'){
			curS[j]=2;
			Dfs(i,j+3,cnt+1);
			curS[j]=0;
		}
	}
} 

int main(){
	pow3[0]=1;
	for(int i=1;i<=10;i++)pow3[i]=pow3[i-1]*3;
	n=read();m=read();
	for(int i=1;i<=n;i++)
		scanf("%s",s[i]+1);
	
	memset(f,-1,sizeof(f));
	f[0][0]=0;
	for(int i=0;i<n;i++){
		for(int S=0;S<pow3[m];S++){
			if(f[i][S]==-1)continue;
			decode(S);
			for(int k=1;k<=m;k++)
				curS[k]=max(0,lastS[k]-1);
			Dfs(i+1,1,f[i][S]);
		}
	}
	cout<<ans;
	return 0;
}

