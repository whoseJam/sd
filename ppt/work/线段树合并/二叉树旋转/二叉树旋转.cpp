#include<iostream>
#include<cstring>
#include<cassert>
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

const int N=100005;
const int lim=19;
int tot;

struct seg{
	int sum;
	int lc,rc;
}t[N];

void pushUp(int x){
	t[x].sum=t[t[x].lc].sum+t[t[x].rc].sum;	
}

void insert(int& x,int l,int r,int pos,int d){
	if(!x)x=++tot;
	if(l==r){t[x].sum=d;return;}
	int mid=(l+r)>>1;
	if(pos<=mid)insert(t[x].lc,l,mid,pos,d);
	else insert(t[x].rc,mid+1,r,pos,d);
	pushUp(x);
}

int afterSwap,beforeSwap;
int Merge(int x,int y){
	if(!x||!y)return x+y;
	int xlcnt=t[t[x].lc].sum,xrcnt=t[t[x].rc].sum;
	int yrcnt=t[t[y].rc].sum,ylcnt=t[t[y].lc].sum;
	beforeSwap+=xrcnt*ylcnt;
	afterSwap+=xlcnt*yrcnt;
	t[x].lc=Merge(t[x].lc,t[y].lc);
	t[x].rc=Merge(t[x].rc,t[y].rc);
	return x;
}

int main(){
	return 0;
}

