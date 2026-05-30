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

const int N=205;
const int M=10005;
int low[N],dfn[N],ins[N],bel[N],SCC,tot;
stack<int> stk;
int n,m;

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

int Man(int x){
	return x;
} 

int Han(int x){
	return x+n;
}

int Obey(int x,char c){
	if(c=='m')return Man(x);
	return Han(x);
}

int Disobey(int x,char c){
	if(c=='m')return Han(x);
	return Man(x);
}

void Tarjan(int u){
	dfn[u]=low[u]=++tot;
	stk.push(u);ins[u]=true;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(!dfn[v]){
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}else if(ins[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u]){
		SCC++;
		while(stk.size()){
			int t=stk.top();stk.pop();
			bel[t]=SCC;
			ins[t]=false;
			if(t==u)break;
		}
	}
}

void Clear(){
	cnt=0;
	memset(h,0,sizeof(h));
	memset(low,0,sizeof(low));
	memset(dfn,0,sizeof(dfn));
}

void Solve(){
	Clear();
	n=read();m=read();
	for(int i=1,x,y;i<=m;i++){
		char tx,ty;
		cin>>tx>>x>>ty>>y;
		Link(Disobey(x,tx),Obey(y,ty));
		Link(Disobey(y,ty),Obey(x,tx));
	}
	for(int i=1;i<=n*2;i++)
		if(!dfn[i])Tarjan(i);
	for(int i=1;i<=n;i++){
		if(bel[Han(i)]==bel[Man(i)]){
			cout<<"BAD\n";
			return;
		}
	}
	cout<<"GOOD\n";
}

int main(){
	int Case=read();
	while(Case--)Solve();
	return 0;
}


