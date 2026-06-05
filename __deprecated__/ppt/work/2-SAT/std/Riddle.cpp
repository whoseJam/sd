#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<stack>
#include<queue>
#define GET getchar()
#define Yes(x) x
#define No(x) x+n
#define Pre(x) x+(n<<1)
#define Suf(x) x+(n<<1)+n
using namespace std;

inline int read(){
	int s=0,f=1;char t=GET;
	while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
	while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
	return s*f;
}

const int M=1000005;
const int N=1000005;

int n,m,k,st[M],en[M],country[N];
int arr[N],tot;
int low[N<<2],dfn[N<<2],bel[N<<2],Ins[N<<2],Times,BCC;
stack<int>s;

struct line{
	int Nxt,to;
}l[(N<<4)+(N<<2)];
int h[N<<2],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

void Tarjan(int u){
	dfn[u]=low[u]=++Times;
	s.push(u);Ins[u]=1;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(!dfn[v]){
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(Ins[v])low[u]=min(low[u],dfn[v]);
	}
	if(low[u]==dfn[u]){
		BCC++;
		while(2333){
			bel[s.top()]=BCC;
			Ins[s.top()]=0;
			if(s.top()==u){s.pop();break;}
			s.pop();
		}
	}
}

int main(){
	n=read();m=read();k=read();
	for(int i=1;i<=m;i++){
		st[i]=read();
		en[i]=read();
	}
	for(int i=1;i<=n;i++){
		Link(Pre(i),No(i));
		Link(Suf(i),No(i));
	}
	for(int i=1,w;i<=k;i++){
		w=read();tot=0;
		while(w--){
			arr[++tot]=read();
			country[arr[tot]]=i;
		}
		for(int j=2;j<=tot;j++){
			Link(Suf(arr[j-1]),Suf(arr[j]));
			Link(Pre(arr[j]),Pre(arr[j-1]));
		}
		for(int j=1;j<=tot;j++){
			if(j-1>=1)Link(Yes(arr[j]),Pre(arr[j-1]));
			if(j+1<=tot)Link(Yes(arr[j]),Suf(arr[j+1]));
		}
	}
	for(int i=1;i<=m;i++){
		Link(No(st[i]),Yes(en[i]));
		Link(No(en[i]),Yes(st[i]));
	}
	for(int i=1;i<=(n<<2);i++)
		if(!dfn[i])Tarjan(i);
	for(int i=1;i<=n;i++){
		if(bel[No(i)]==bel[Yes(i)]){
			printf("NIE");
			return 0;
		}
	}
	printf("TAK");
	return 0;
}
