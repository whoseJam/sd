#include<iostream>
#include<cstring>
typedef long long ll;
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

const int Mod=1e9+7;
const int N=1000005;
int nxt[N],dep[N],n;
char A[N];

void Prepare(){
	nxt[1]=0;
	dep[1]=1;
	int cur=0;
	for(int i=2;i<=n;i++){
		while(cur&&A[cur+1]!=A[i])
			cur=nxt[cur];
		if(A[cur+1]==A[i])nxt[i]=++cur;
		else nxt[i]=0;
		dep[i]=dep[nxt[i]]+1;
	}
} 

void Solve(){
	scanf("%s",A+1);n=strlen(A+1);
	Prepare();
	int ans=1,cur=1;
	for(int i=1;i<=n;i++){
		while(cur&&A[cur+1]!=A[i])cur=nxt[cur];
		if(A[cur+1]==A[i])cur++;
		while(cur>(i/2))cur=nxt[cur];
		ans=(ll)ans*(dep[cur]+1)%Mod;
	}
	cout<<ans<<'\n';
}

int main(){
	int Case=read();
	while(Case--)Solve();
	return 0;
}

