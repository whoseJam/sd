#include<iostream>
#include<cstdio>
#define lc (x<<1)
#define rc (x<<1|1) 
using namespace std;

const int N=100005;
int n,m;

struct seg{
	int rev,l,r;
}t[N*4];

void pushRev(int x,int flg){
	t[x].rev^=flg;
}

void pushDown(int x){
	if(t[x].rev){
		pushRev(lc,t[x].rev);
		pushRev(rc,t[x].rev);
		t[x].rev^=1;
	}
}

void buildTree(int x,int l,int r){
	t[x].l=l;t[x].r=r; 
	if(l==r)return;
	int mid=(l+r)>>1;
	buildTree(lc,l,mid);
	buildTree(rc,mid+1,r);
}

void add(int x,int l,int r){
	if(l<=t[x].l&&t[x].r<=r){
		pushRev(x,1);
		return;
	}
	pushDown(x);
	int mid=(t[x].l+t[x].r)>>1;
	if(l<=mid)add(lc,l,r);
	if(r>mid)add(rc,l,r);
}

int ask(int x,int pos){
	if(t[x].l==t[x].r)return t[x].rev;
	pushDown(x);
	int mid=(t[x].l+t[x].r)>>1;
	if(pos<=mid)return ask(lc,pos);
	return ask(rc,pos);
}

int main(){
	int order,l,r;
	cin>>n>>m;
	buildTree(1,1,n);
	
	for(int i=1;i<=m;i++){
		scanf("%d",&order);
		if(order==1){
			scanf("%d%d",&l,&r);
			add(1,l,r);
		}
		if(order==2){
			scanf("%d",&l);
			printf("%d\n",ask(1,l));
		}
	}
	return 0;
}
