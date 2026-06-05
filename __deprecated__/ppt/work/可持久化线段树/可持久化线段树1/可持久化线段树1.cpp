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

const int N=1000005;
int n,m,a[N]; 

struct seg{
	int lc,rc,v;
}t[N*30];
int tot,rt[N];

void build(int& x,int l,int r){
	x=++tot;
	if(l==r){t[x].v=a[l];return;}
	int mid=(l+r)>>1;
	build(t[x].lc,l,mid);
	build(t[x].rc,mid+1,r);
}

void insert(int& x,int lastx,int l,int r,int p,int v){
	t[x=++tot]=t[lastx];
	if(l==r){t[x].v=v;return;}
	int mid=(l+r)>>1;
	if(p<=mid)insert(t[x].lc,t[lastx].lc,l,mid,p,v);
	else insert(t[x].rc,t[lastx].rc,mid+1,r,p,v);
}

int query(int x,int l,int r,int pos){
	if(l==r)return t[x].v;
	int mid=(l+r)>>1;
	if(pos<=mid)return query(t[x].lc,l,mid,pos);
	else return query(t[x].rc,mid+1,r,pos);
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++){
		a[i]=read();
	}
	build(rt[0],1,n);
	for(int i=1,ver,opt;i<=m;i++){
		ver=read();
		opt=read();
		if(opt==1){
			int p=read(),v=read();
			insert(rt[i],rt[ver],1,n,p,v);
		}else{
			int p=read();
			cout<<query(rt[ver],1,n,p)<<'\n';
			rt[i]=rt[ver];
		}
	}
	return 0;
}
