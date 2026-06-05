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

const int inf=1e9;
const int N=200005;
int rt[N],n,m,a[N],tot,mna,mxa;

struct seg{
	int lc,rc,siz;
}t[N*30];

void insert(int& x,int lastx,int l,int r,int p){
	t[x=++tot]=t[lastx];t[x].siz++; 
	if(l==r)return;
	int mid=(l+r)>>1;
	if(p<=mid)insert(t[x].lc,t[lastx].lc,l,mid,p);
	else insert(t[x].rc,t[lastx].rc,mid+1,r,p);
}

int nodeSize(int xl,int xr){
	return t[xr].siz-t[xl].siz;
}

int query(int xl,int xr,int l,int r,int k){
	if(l==r)return l;
	int mid=(l+r)>>1,siz=nodeSize(t[xl].lc,t[xr].lc);
	if(k<=siz)return query(t[xl].lc,t[xr].lc,l,mid,k);
	else return query(t[xl].rc,t[xr].rc,mid+1,r,k-siz);
}

int main(){
	n=read();m=read();mna=inf;mxa=0;
	for(int i=1;i<=n;i++){
		a[i]=read();
		mna=min(mna,a[i]);
		mxa=max(mxa,a[i]);
	}
	for(int i=1;i<=n;i++){
		insert(rt[i],rt[i-1],mna,mxa,a[i]);
	}
	for(int i=1,l,r,k;i<=m;i++){
		l=read();r=read();k=read();
		cout<<query(rt[l-1],rt[r],mna,mxa,k)<<'\n';
	}
	return 0;
}

