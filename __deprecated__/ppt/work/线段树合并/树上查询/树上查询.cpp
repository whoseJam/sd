#include<iostream>
#include<cstring>
#include<vector>
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

const int N=500005;
int test[105][105];
int n,q,tot,rt[N];
bool flag;

struct seg{
	int lcnt,rcnt,lc,rc;
}t[N*30];

void pushUp(int x,int l,int r){
	int mid=(l+r)>>1;
	int lsize=mid-l+1;
	int rsize=r-mid;
	t[x].lcnt=(t[t[x].lc].lcnt==lsize)?lsize+t[t[x].rc].lcnt:t[t[x].lc].lcnt;
	t[x].rcnt=(t[t[x].rc].rcnt==rsize)?rsize+t[t[x].lc].rcnt:t[t[x].rc].rcnt;
}

void Insert(int &x,int l,int r,int pos){
	x=++tot;
	if(l==r){t[x].lcnt=t[x].rcnt=1;return;}
	int mid=(l+r)>>1;
	if(pos<=mid)Insert(t[x].lc,l,mid,pos);
	else Insert(t[x].rc,mid+1,r,pos);
	pushUp(x,l,r);
}

int Merge(int x,int y,int l,int r,vector<int>& at){
	if(!x||!y)return x+y;
	int mid=(l+r)>>1;
	int xlc=t[t[x].lc].rcnt;
	int xrc=t[t[x].rc].lcnt;
	int ylc=t[t[y].lc].rcnt;
	int yrc=t[t[y].rc].lcnt;
	if((xlc>0&&yrc>0)||(ylc>0&&xrc>0))at.push_back(mid);
	t[x].lc=Merge(t[x].lc,t[y].lc,l,mid,at);
	t[x].rc=Merge(t[x].rc,t[y].rc,mid+1,r,at);
	pushUp(x,l,r);
	return x;
}

// query [at,+inf)
int queryL(int x,int l,int r,int at){
	if(at<=l)return t[x].lcnt;
	int mid=(l+r)>>1;
	if(at<=mid){
		int lcnt=queryL(t[x].lc,l,mid,at);
		int lsize=mid-max(at,l)+1;
		if(lsize==lcnt)return lcnt+queryL(t[x].rc,mid+1,r,at);
	}else return queryL(t[x].rc,mid+1,r,at);
}

// query (-inf,at]
int queryR(int x,int l,int r,int at){
	if(at>=r)return t[x].rcnt;
	int mid=(l+r)>>1;
	if(at>mid){
		int rcnt=queryR(t[x].rc,mid+1,r,at);
		int rsize=min(at,r)-mid;
		if(rsize==rcnt)return rcnt+queryR(t[x].lc,l,mid,at);
	}else return queryR(t[x].lc,l,mid,at);
}

void debug(int x,int l,int r){
	if(l==r){cout<<t[x].lcnt<<" ";return;}
	int mid=(l+r)>>1;
	debug(t[x].lc,l,mid);
	debug(t[x].rc,mid+1,r);
}

void debugDetail(int x,int l,int r){
	if(!x)return;
	cout<<l<<" -> "<<r<<" lcnt="<<t[x].lcnt<<" rcnt="<<t[x].rcnt<<"\n";
	if(l==r)return;
	int mid=(l+r)>>1;
	debugDetail(t[x].lc,l,mid);
	debugDetail(t[x].rc,mid+1,r);
}

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Dfs(int u,int f){
	vector<int>at;
	Insert(rt[u],1,n,u);
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			Dfs(v,u);
			rt[u]=Merge(rt[u],rt[v],1,n,at);
		}
	}
	for(int& a:at){
		int lcnt=queryL(rt[u],1,n,a+1);
		int rcnt=queryR(rt[u],1,n,a);
//		cout<<"u="<<u<<" a="<<a<<" lcnt="<<lcnt<<" rcnt="<<rcnt<<"\n";
		int l1=a-rcnt+1;
		int l2=a;
		int r1=a+1;
		int r2=a+lcnt;
		for(int l=l1;l<=l2;l++)
			for(int r=r1;r<=r2;r++){
				test[l][r]=u;
			}
	}
}

int main(){
	n=read();
	for(int i=1,x,y;i<n;i++){
		x=read();y=read();
		Link(x,y);
	}
	Dfs(1,0);
	
	for(int i=1;i<=n;i++)test[i][i]=i;
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n;j++){
			cout<<test[i][j]<<" ";
		}cout<<"\n";
	}
	return 0;
}
/*
6
1 2
2 5
2 6
6 3
6 4
*/

