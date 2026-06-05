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
const int M=10;
int f[2][1<<M][1<<M];
int n,m,ans,mp[N],cnt[1<<M];
char s[N][M+1];
vector<int>valid;

int id(int x){
	return x&1;
}

int nextId(int x){
	return id(x)^1;
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++){
		scanf("%s",s[i]+1);
		for(int j=1;j<=m;j++){
			if(s[i][j]=='P')mp[i]|=(1<<j-1);
		}
	}
	int All=(1<<m)-1;
	for(int S=0;S<=All;S++){
		cnt[S]=cnt[S>>1]+(S&1);
		if(S&(S<<1))continue;
		if(S&(S<<2))continue;
		valid.push_back(S);
	}
	
	memset(f,-1,sizeof(f));
	for(int S:valid){
		if((mp[2]&S)!=S)continue;
		for(int T:valid){
			if((mp[1]&T)!=T)continue;
			if(S&T)continue;
			f[id(2)][S][T]=max(f[id(2)][S][T],cnt[S]+cnt[T]);
			ans=max(ans,f[id(2)][S][T]);
		}
	}
	for(int i=2;i<n;i++){
		memset(f[nextId(i)],-1,sizeof(f[nextId(i)]));
		for(int S:valid){
			if((mp[i]&S)!=S)continue;
			for(int T:valid){
				if((mp[i-1]&T)!=T)continue;
				if(f[id(i)][S][T]<0)continue;
				for(int P:valid){
					if((mp[i+1]&P)!=P)continue;
					if(S&P)continue;
					if(T&P)continue;
					f[nextId(i)][P][S]=max(f[nextId(i)][P][S],f[id(i)][S][T]+cnt[P]);
					ans=max(ans,f[nextId(i)][P][S]);
				}
			}
		}
	}
	cout<<ans;
	return 0;
}

