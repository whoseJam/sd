#include<iostream>
#include<cstring>
#include<cstdio>
#define LL long long
#define mod 9875321
using namespace std;
const int N=1000005;
char s[N];
int F[N],seed=27,lens;
int root,cnt,M;
int ch[N][2],fa[N],val[N],siz[N],has[N];

void pushUp(int x)
{
	int Lc=ch[x][0],Rc=ch[x][1];
	siz[x]=siz[Lc]+siz[Rc]+1;
	has[x]=(has[Lc]+(LL)val[x]*F[siz[Lc]]%mod+(LL)F[siz[Lc]+1]*has[Rc]%mod)%mod;
}

void rot(int x,int &f)
{
	int y=fa[x],z=fa[y],L=(ch[y][0]!=x),R=(L^1);
	if(f==y)f=x;
	else
	{
		if(ch[z][0]==y)ch[z][0]=x;
		else ch[z][1]=x;
	}
	fa[x]=z;fa[y]=x;fa[ch[x][R]]=y;
	ch[y][L]=ch[x][R];ch[x][R]=y;
	pushUp(y);pushUp(x);
}

void Splay(int x,int &f)
{
	while(x!=f)
	{
		int y=fa[x],z=fa[y];
		if(y!=f)
		{
			if(ch[z][0]==y^ch[y][0]==x)rot(x,f);
			else rot(y,f);
		}
		rot(x,f);
	}
}

int FindK(int x,int k)
{
	if(siz[ch[x][0]]+1==k)return x;
	if(siz[ch[x][0]]>=k)return FindK(ch[x][0],k);
	return FindK(ch[x][1],k-siz[ch[x][0]]-1);
}

void Insert(int k,int value)
{
	int head=FindK(root,k+1),tail=FindK(root,k+2);
	Splay(head,root);Splay(tail,ch[head][1]);
	fa[++cnt]=tail;val[cnt]=value;ch[tail][0]=cnt;
	pushUp(cnt);pushUp(tail);pushUp(head);
}

int getHash(int k,int len)
{
	int head=FindK(root,k),tail=FindK(root,k+len+1);
	Splay(head,root);Splay(tail,ch[head][1]);
	return has[ch[tail][0]];
}

int getAns(int x,int y)
{
	int Left=1,Right=cnt-max(x,y)-1,mid;
	while(Left<=Right)
	{
		mid=(Left+Right)/2;
		if(getHash(x,mid)==getHash(y,mid))Left=mid+1;
		else Right=mid-1;
	}
	return Right;
}

void buildTree(int l,int r,int &Rt,int prt)
{
	int mid=(l+r)/2;Rt=mid;
	if(l==r)
	{
		val[mid]=has[mid]=s[l]-'a'+1;
		fa[mid]=prt;siz[mid]=1;
		return;
	}
	if(l<=mid-1)buildTree(l,mid-1,ch[mid][0],mid);
	if(mid+1<=r)buildTree(mid+1,r,ch[mid][1],mid);
	val[mid]=s[mid]-'a'+1;fa[mid]=prt;
	pushUp(mid);
}

int main()
{
	scanf("%s",s+2);
	lens=strlen(s+2);
	
	F[0]=1;
	for(int i=1;i<N;i++)
		F[i]=(LL)(F[i-1]*seed)%mod;
	buildTree(1,lens+2,root,0);
	cnt=lens+2;
	
	char opt[3],d[3];
	int x,y;
	scanf("%d",&M);
	for(int i=1;i<=M;i++)
	{
		scanf("%s",opt);
		if(opt[0]=='Q')
		{
			scanf("%d%d",&x,&y);
			printf("%d\n",getAns(x,y));
		}
		if(opt[0]=='R')
		{
			scanf("%d%s",&x,&d);
			int pos=FindK(root,x+1);
			Splay(pos,root);
			val[root]=d[0]-'a'+1;
			pushUp(root);
		}
		if(opt[0]=='I')
		{
			scanf("%d%s",&x,&d);
			Insert(x,d[0]-'a'+1);
		}
	}
	return 0;
}
