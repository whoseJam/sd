#include<bits/stdc++.h>
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
const int inf=0x3f3f3f3f;
int ch[N][2],fa[N],val[N],siz[N],rev[N];
int cnt,rt,n,m;

void pushRev(int x){
	rev[x]^=1;
	swap(ch[x][0],ch[x][1]);
}

void pushDown(int x){
	if(rev[x]){
		pushRev(ch[x][0]);
		pushRev(ch[x][1]);
		rev[x]=0;
	}
}

void pushUp(int x){
	siz[x]=siz[ch[x][0]]+siz[ch[x][1]]+1;
}

void rotate(int x,int &f){
	int y=fa[x],z=fa[y],L=(ch[y][0]!=x),R=(L^1);
	if(y==f)f=x;else if(ch[z][0]==y)ch[z][0]=x;else ch[z][1]=x;
	fa[x]=z;fa[y]=x;fa[ch[x][R]]=y;
	ch[y][L]=ch[x][R];ch[x][R]=y;
	pushUp(y);pushUp(x);
}

void Splay(int x,int &f){
	while(x!=f){
		int y=fa[x],z=fa[y];
		if(z)pushDown(z);
		pushDown(y);pushDown(x);
		if(y!=f){
			if((ch[y][0]==x)^(ch[z][0]==y))rotate(x,f);
			else rotate(y,f);
		}
		rotate(x,f);
	}
}

void build(int& x,int f,int l,int r){
	x=++cnt;fa[x]=f;
	int mid=(l+r)>>1;
	val[x]=mid;
	if(l<=mid-1)build(ch[x][0],x,l,mid-1);
	if(mid+1<=r)build(ch[x][1],x,mid+1,r);
	pushUp(x);
}

void init(){
	fa[2]=1;ch[1][1]=2;
	val[1]=-inf;val[2]=inf;
	rt=1;cnt=2;
	build(ch[2][0],2,1,n);
	pushUp(2);pushUp(1);
}

int findKth(int x,int k){
	pushDown(x);
	if(!x)return 0;
	if(siz[ch[x][0]]+1>=k&&siz[ch[x][0]]<k)return x;
	else if(siz[ch[x][0]]>=k)return findKth(ch[x][0],k);
	else return findKth(ch[x][1],k-siz[ch[x][0]]-1);
}

int findKth(int k){
	int x=findKth(rt,k);
	return x;
}

int extract(int l,int r){
	int prev=findKth(l-1);
	int next=findKth(r+1);
	Splay(prev,rt);
	Splay(next,ch[rt][1]);
	return ch[next][0];
}

void Rev(int l,int r){
	int x=extract(l,r);
	pushRev(x);
}

void visitVal(int x){
	pushDown(x);
	if(ch[x][0])visitVal(ch[x][0]);
	if(val[x]!=inf&&val[x]!=-inf)cout<<val[x]<<' ';
	if(ch[x][1])visitVal(ch[x][1]);
}

int main(){
	n=read();m=read();
	init();
	for(int i=1,l,r;i<=m;i++){
		l=read();r=read();
		Rev(l+1,r+1);
	}
	visitVal(rt);
	return 0;
}

