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

const int inf=1e9;
const int N=200005;
int rt[N],n,m,a[N],tot,Ans[N];

struct Wood{
	int l,r,s;
}W[N];

struct Bullet{
	int pos,t;
}B[N];

bool cmp(const Bullet& a,const Bullet& b){
	return a.pos<b.pos;
}

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
	n=read();m=read();
	for(int i=1;i<=n;i++){
		W[i].l=read();
		W[i].r=read();
		W[i].s=read();
	}
	for(int i=1;i<=m;i++){
		B[i].pos=read();
		B[i].t=i;
	}
	sort(B+1,B+1+m,cmp);
	
	for(int i=1,cur=1;i<=200000;i++){
		rt[i]=rt[i-1];
		while(cur<=m&&B[cur].pos==i){
			insert(rt[i],rt[i],1,200001,B[cur].t);
			cur++;
		}
	}
	for(int i=1;i<=n;i++){
		int l=W[i].l;
		int r=W[i].r;
		int s=W[i].s;
		int b=query(rt[l-1],rt[r],1,200001,s);
		Ans[b]++;
	}
	for(int i=1;i<=m;i++)
		cout<<Ans[i]<<'\n';
	return 0;
}
