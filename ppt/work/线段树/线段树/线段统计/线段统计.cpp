#include<vector>
#include<cstdio>
#include<cstring>
#include<iostream>
#include<algorithm>
#define LL long long
#define lc (x<<1)
#define rc (x<<1|1)
 
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=100005;
int a[N],n,m;

struct seg{
	int l,r,cnt,col;
}t[N*4];

void pushCol(int x,int d){
	t[x].col=d;
	if(d==1)t[x].cnt=t[x].r-t[x].l+1;
	if(d==2)t[x].cnt=0;
}

void pushDown(int x){
	if(t[x].col){
		pushCol(lc,t[x].col);
		pushCol(rc,t[x].col);
		t[x].col=0;
	}
}

void pushUp(int x){
	t[x].cnt=t[lc].cnt+t[rc].cnt;
}

void Build(int x,int l,int r){
	t[x].l=l;t[x].r=r;
	if(l==r)return;
	int mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x);
}

void Add(int x,int l,int r,int d){
	if(t[x].r<l||t[x].l>r)return;
	if(l<=t[x].l&&t[x].r<=r){pushCol(x,d);return;}
	pushDown(x);
	Add(lc,l,r,d);
	Add(rc,l,r,d);
	pushUp(x);
}

int Query(int x,int l,int r){
	if(t[x].r<l||t[x].l>r)return 0; 
	if(l<=t[x].l&&t[x].r<=r)return t[x].cnt;
	pushDown(x);
	return Query(lc,l,r)+Query(rc,l,r);
}

int main(){
	n=read();m=read();
	Build(1,1,n);
	for(int i=1;i<=m;i++){
		int tp=read(),l=read(),r=read();
		if(tp==1||tp==2)Add(1,l+1,r,tp);
		else cout<<Query(1,l+1,r)<<endl;
	}
}
/*
20 6
1 1 15
2 4 9
1 7 18
1 7 9
2 1 3
3 0 20
*/