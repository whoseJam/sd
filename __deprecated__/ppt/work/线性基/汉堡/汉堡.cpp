#include<iostream>
#include<cstring>
#include<cstdio>
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

const int DIM=30;
const int N=500005;
int n,q;

struct LinearBasis{
	int linearSet[50];
	int pos[50];
	bool insert(int v,int p){
		for(int i=DIM-1;i>=0;i--){
			if((v>>i)&1){
				if(linearSet[i]){
					if(p>pos[i]){
						swap(p,pos[i]);
						swap(v,linearSet[i]);
					}
					v^=linearSet[i];
				}else{
					pos[i]=p;
					linearSet[i]=v;
					return true;
				}
			}
		}
		return false;
	}
	int query(int l){
		int ans=0;
		for(int i=DIM-1;i>=0;i--){
			if(linearSet[i]&&pos[i]>=l){
				ans=max(ans,ans^linearSet[i]);
			}
		}
		return ans;
	}
}L[N];

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		L[i]=L[i-1];
		L[i].insert(read(),i);
	}
	q=read();
	for(int i=1,l,r;i<=q;i++){
		l=read();r=read();
		cout<<L[r].query(l)<<'\n';
	}
	return 0;
}

