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

const int N=100005;
const int inf=0x3f3f3f3f;
int ch[N][2],fa[N],val[N],siz[N],num[N];
int cnt,rt,n;

void visitVal(int x){
	if(ch[x][0])visitVal(ch[x][0]);
	if(val[x]!=inf&&val[x]!=-inf){
		cout<<val[x];
		if(num[x]>1){
			cout<<"("<<num[x]<<") ";
		}else cout<<" ";
	}
	else if(val[x]==-inf)cout<<"-inf ";
	else cout<<"+inf\n";
	if(ch[x][1])visitVal(ch[x][1]);
}

void visitNum(int x){
	if(ch[x][0])visitNum(ch[x][0]);
	cout<<num[x]<<" ";
	if(ch[x][1])visitNum(ch[x][1]);
}

void pushUp(int x){
	siz[x]=siz[ch[x][0]]+siz[ch[x][1]]+num[x];
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
		if(y!=f){
			if((ch[y][0]==x)^(ch[z][0]==y))rotate(x,f);
			else rotate(y,f);
		}
		rotate(x,f);
	}
}

void Init(){
	rt=1;cnt=2;
	fa[2]=1;ch[1][1]=2;
	val[1]=-inf;
	val[2]=+inf;
	siz[2]=1;num[1]=1;
	siz[1]=2;num[2]=1;
}

int insert(int& x,int f,int v){
	if(!x){x=++cnt;val[x]=v;siz[x]=num[x]=1;fa[x]=f;return x;}
	if(val[x]==v){num[x]++;return x;}
	else if(val[x]<v)return insert(ch[x][1],x,v);
	else return insert(ch[x][0],x,v);
}

void insert(int v){
	int x=insert(rt,0,v);
	Splay(x,rt);
}

int findPrev(){
	int x=ch[rt][0];
	while(ch[x][1])x=ch[x][1];
	return x;
}

int findNext(){
	int x=ch[rt][1];
	while(ch[x][0])x=ch[x][0];
	return x;
}

int find(int x,int v){
	if(val[x]==v)return x;
	if(val[x]>v)return find(ch[x][0],v);
	return find(ch[x][1],v);
}

void remove(int v){
	int x=find(rt,v);
	Splay(x,rt);
	if(num[x]>1){
		num[x]--;
		return;
	}
	int prev=findPrev();
	int next=findNext();
	Splay(prev,rt);
	Splay(next,ch[rt][1]);
	ch[next][0]=fa[x]=0;
	pushUp(next);pushUp(prev);
}

int queryRank(int v){
	insert(v);
	int x=find(rt,v);
	Splay(x,rt);
	int ans=siz[ch[x][0]];
	remove(v);
	return ans;
}

int findKth(int x,int k){
	if(siz[ch[x][0]]>=k)return findKth(ch[x][0],k);
	if(siz[ch[x][0]]+num[x]>=k)return x;
	return findKth(ch[x][1],k-siz[ch[x][0]]-num[x]);
}
int queryNodeRankEqualK(int k){
	return val[findKth(rt,k+1)];
}

int findPrev(int v){
	insert(v);
	int prev=findPrev();
	int ans=val[prev];
	remove(v);
	return ans;
}

int findNext(int v){
	insert(v);
	int next=findNext();
	int ans=val[next];
	remove(v);
	return ans;
}

int main(){
	Init();
	n=read();
	for(int i=1,opt,x;i<=n;i++){
		opt=read();x=read();
		if(opt==1)insert(x);
		if(opt==2)remove(x);
		if(opt==3)cout<<queryRank(x)<<'\n';
		if(opt==4)cout<<queryNodeRankEqualK(x)<<'\n';
		if(opt==5)cout<<findPrev(x)<<'\n';
		if(opt==6)cout<<findNext(x)<<'\n';
	}
	return 0;
}