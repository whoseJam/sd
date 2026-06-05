#include<iostream>
#include<cstring>
#include<cstdio>
#include<set>
#include<map>
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

const int N=25;
int SG[N],n;

int mex(set<int>& S){
	int cur=0;
	for(auto& v:S){
		if(v!=cur)return cur;
		cur++;
	}
	return cur;
}

void Prepare(){
	SG[n]=0;
	for(int i=n;i>=1;i--){
		set<int>S;
		for(int j=i+1;j<=n;j++)
			for(int k=j;k<=n;k++)
				S.insert(SG[j]^SG[k]);
		SG[i]=mex(S);
	}
}

void Solve(){
	n=read();
	Prepare();
	int ans=0;
	for(int i=1,x;i<=n;i++){
		x=read();
		if(x&1)ans^=SG[i];
	}
	cout<<ans<<"\n";
}

int main(){
	int Case=read();
	while(Case--)Solve();
	return 0;
}

