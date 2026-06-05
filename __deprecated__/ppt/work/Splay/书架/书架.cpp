#include<bits/stdc++.h>
using namespace std;

namespace FastIO{
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
int ch[N][2],fa[N],val[N],siz[N];
int rt,n,m;
map<int,int> trans;

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
		if(y!=f){
			if((ch[y][0]==x)^(ch[z][0]==y))rotate(x,f);
			else rotate(y,f);
		}
		rotate(x,f);
	}
}

void build(int& x,int f,int l,int r){
	int mid=(l+r)>>1;x=mid;fa[x]=f;
	if(l<=mid-1)build(ch[x][0],x,l,mid-1);
	if(mid+1<=r)build(ch[x][1],x,mid+1,r);
	pushUp(x);
}

void init(){
	fa[n+2]=n+1;ch[n+1][1]=n+2;
	val[n+1]=-inf;val[n+2]=inf;rt=n+1;
	build(ch[n+2][0],n+2,1,n);
	pushUp(n+2);pushUp(n+1);
}

int findKth(int x,int k){
	if(!x)return 0;
	if(siz[ch[x][0]]+1>=k&&siz[ch[x][0]]<k)return x;
	else if(siz[ch[x][0]]>=k)return findKth(ch[x][0],k);
	else return findKth(ch[x][1],k-siz[ch[x][0]]-1);
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

int findKth(int k){
	int x=findKth(rt,k);
	return x;
}

int takeOut(int x){
//	int x=findKth(k);
	Splay(x,rt);
	int prev=findPrev();
	int next=findNext();
	Splay(prev,rt);
	Splay(next,ch[rt][1]);
	fa[x]=ch[next][0]=0;
	pushUp(next);pushUp(prev);
	return x;
}

void insertAfter(int x,int k){
	int prev=findKth(k);
	Splay(prev,rt);
	int next=findNext();
	Splay(next,ch[rt][1]);
	fa[x]=next;ch[next][0]=x;
	pushUp(next);pushUp(prev);
}

int Rank(int x){
	Splay(x,rt);
	return siz[ch[rt][0]];
}

void visitVal(int x){
	if(ch[x][0])visitVal(ch[x][0]);
	if(val[x]!=inf&&val[x]!=-inf)cout<<val[x]<<' ';
	if(ch[x][1])visitVal(ch[x][1]);
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++){
		val[i]=read();
		trans[val[i]]=i;
	}
	init();
	
	char op[10];
	for(int i=1,l,r;i<=m;i++){
		scanf("%s",op);
		if(op[0]=='T'){
			int s=trans[read()];
			int id=takeOut(s);
			insertAfter(id,1);
		}else if(op[0]=='B'){
			int s=trans[read()];
			int id=takeOut(s);
			insertAfter(id,n);
		}else if(op[0]=='I'){
			int s=trans[read()];
			int t=read();
			int rk=Rank(s)+t;
			int id=takeOut(s);
			insertAfter(id,rk);
		}else if(op[0]=='A'){
			int s=trans[read()];
			cout<<Rank(s)-1<<'\n';
		}else if(op[0]=='Q'){
			int s=read();
			int x=findKth(s+1);
			cout<<val[x]<<'\n';
		}
	}
	return 0;
}

