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

const int N=16005;
const int M=40005;
int low[N],dfn[N],ins[N],bel[N],SCC,tot;
stack<int> stk;
int n,m,Ind[N];

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

int another(int x){
	if(x%2==1)return x+1;
	return x-1;
}

int First(int x){
	return x*2-1;
} 

int Second(int x){
	return x*2;
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

int main(){
	n=read();m=read();
	for(int i=1,a,b;i<=m;i++){
		a=read();b=read();
		Link(a,another(b));
		Link(b,another(a));
	}
	for(int i=1;i<=n*2;i++)
		if(!dfn[i])Tarjan(i);
	for(int i=1;i<=n;i++){
		if(bel[First(i)]==bel[Second(i)]){
			cout<<"NIE";
			return 0;
		}
	}
	for(int i=1;i<=n;i++){
		if(bel[First(i)]<bel[Second(i)]){
			cout<<First(i)<<'\n';
		}else cout<<Second(i)<<'\n';
	}
	return 0;
}
