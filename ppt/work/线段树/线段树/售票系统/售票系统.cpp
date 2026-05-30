#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#define GET getchar()
#define lc x<<1
#define rc x<<1|1
using namespace std;

inline int read(){
	int s=0,f=1;char t=GET;
	while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
	while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
	return s*f;
}

const int N=100005,inf=0x3f3f3f3f;
int n,m,UP;

struct segmentTree{
	int l,r,add,Min;
}t[N*4];

void pushAdd(int x,int del){
	t[x].add+=del;
	t[x].Min+=del;
}

void pushDown(int x){
	if(t[x].add){
		pushAdd(lc,t[x].add);
		pushAdd(rc,t[x].add);
		t[x].add=0;
	}
}

void pushUp(int x){
	t[x].Min=min(t[lc].Min,t[rc].Min);
}

void buildTree(int x,int l,int r){
	t[x].l=l;t[x].r=r;t[x].add=0;
	if(l==r)return;
	int mid=(l+r)>>1;
	buildTree(lc,l,mid);
	buildTree(rc,mid+1,r);
	pushUp(x);
}

void Add(int x,int l,int r,int del){
	if(t[x].l>r||t[x].r<l)return;
	if(l<=t[x].l&&t[x].r<=r){
		pushAdd(x,del);
		return;
	}
	pushDown(x);
	Add(lc,l,r,del);
	Add(rc,l,r,del);
	pushUp(x);
}

int Ask(int x,int l,int r){
	if(t[x].l>r||t[x].r<l)return inf;
	if(l<=t[x].l&&t[x].r<=r)return t[x].Min;
	pushDown(x);
	return min(Ask(lc,l,r),Ask(rc,l,r));
}

int main(){
	n=read();UP=read();m=read();
	buildTree(1,1,n);Add(1,1,n,UP);
	for(int i=1,l,r,need;i<=m;i++){
		l=read();r=read()-1;need=read();
		if(Ask(1,l,r)>=need){
			Add(1,l,r,-need);
			printf("YES\n");
		}
		else printf("NO\n");
	}
	return 0;
}
