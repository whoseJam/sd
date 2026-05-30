#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
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

const int N=200005;
int x[N],C,n;

int Solve(int minDist){
	int lastX=-1,cnt=0;
	for(int i=1;i<=n;i++){
		if(lastX==-1){
			cnt++;
			lastX=x[i];
		}else if(x[i]-lastX>=minDist){
			cnt++;
			lastX=x[i];
		}
	}
	return cnt;
}

int main(){
	n=read();C=read();
	for(int i=1;i<=n;i++)
		x[i]=read();
	sort(x+1,x+1+n);
	int l=0,r=x[n]-x[1],mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(Solve(mid)>=C)l=mid+1;
		else r=mid-1;
	}
	cout<<r<<'\n';
	return 0;
}

