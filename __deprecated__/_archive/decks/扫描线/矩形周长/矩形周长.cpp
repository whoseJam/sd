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

const int N=5005;
const int M=20005;
int n;

struct Rect{
	int x,y,width,height;
}R[N];

struct Border{
	int y,l,r,flg;
}B[N*2];

bool cmp(const Border& a,const Border& b){
	if(a.y!=b.y)return a.y<b.y;
	return a.flg>b.flg;
}

#define lc (x<<1)
#define rc (x<<1|1)

struct seg{
	int l,r,cnt,mn,add;
}t[M*4];
int tmp[M];

void pushUp(int x){
	t[x].mn=min(t[lc].mn,t[rc].mn);
	t[x].cnt=0;
	if(t[x].mn==t[lc].mn)t[x].cnt+=t[lc].cnt;
	if(t[x].mn==t[rc].mn)t[x].cnt+=t[rc].cnt; 
}

void pushAdd(int x,int d){
	t[x].add+=d;
	t[x].mn+=d;
}

void pushDown(int x){
	if(t[x].add){
		pushAdd(lc,t[x].add);
		pushAdd(rc,t[x].add);
		t[x].add=0;
	}
}

void Build(int x,int l,int r){
	t[x].l=l;t[x].r=r;t[x].add=0;
	if(l==r){t[x].mn=0;t[x].cnt=1;return;}
	int mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x); 
}

int Ask(){
	if(t[1].mn==0)return t[1].r-t[1].l+1-t[1].cnt;
	return t[1].r-t[1].l+1;
}

void Add(int x,int l,int r,int d){
	if(l<=t[x].l&&t[x].r<=r){
		pushAdd(x,d);
		return;
	}
	pushDown(x);
	int mid=(t[x].l+t[x].r)>>1;
	if(l<=mid)Add(lc,l,r,d);
	if(r>mid)Add(rc,l,r,d);
	pushUp(x);
}

int Solve(){
	int tot=0;
	for(int i=1;i<=n;i++){
		B[++tot]=(Border){R[i].y,R[i].x,R[i].x+R[i].width-1,1};
		B[++tot]=(Border){R[i].y+R[i].height,R[i].x,R[i].x+R[i].width-1,-1};
	}
	sort(B+1,B+1+tot,cmp);
	
	Build(1,1,20001);
	
	int lastans=0,ans=0;
	for(int l=1,r;l<=tot;l=r+1){
		r=l;
		while(r+1<=tot&&B[r+1].y==B[l].y&&B[r+1].flg==B[l].flg)r++;
		for(int i=l;i<=r;i++){
			Add(1,B[i].l,B[i].r,B[i].flg);
		}
		int current=Ask();
		ans+=abs(current-lastans);
		lastans=current;
	}
	return ans;
}

int main(){
	n=read();
	for(int i=1,x1,x2,y1,y2;i<=n;i++){
		x1=read();y1=read();
		x2=read();y2=read();
		R[i].x=x1+10001;
		R[i].y=y1+10001;
		R[i].width=x2-x1;
		R[i].height=y2-y1;
	}
	int x=Solve();
	for(int i=1;i<=n;i++){
		swap(R[i].x,R[i].y);
		swap(R[i].width,R[i].height);
	}
	int y=Solve();
	cout<<x+y<<'\n';
	return 0;
}

