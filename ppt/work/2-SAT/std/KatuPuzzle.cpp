#include<iostream>
#include<cstring>
#include<cstdio>
#include<stack>
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

typedef pair<int,int> pa;
const int N=200005;
const int M=1000005;
int low[N],dfn[N],ins[N],bel[N],SCC,tot;
stack<int> stk;
int n,m;

int T(int x){
	return x;
}

int F(int x){
	return x+n;
}

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
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
	char tmp[10];
	for(int i=1,a,b,c;i<=m;i++){
		a=read()+1;
		b=read()+1;
		c=read();
		scanf("%s",tmp);
		if(tmp[0]=='A'){
			if(c==1){ // a&b=1
				Link(F(a),T(a));
				Link(F(b),T(b));
			}else{ // a&b=0 
				Link(T(a),F(b));
				Link(T(b),F(a));
			}
		}else if(tmp[0]=='O'){
			if(c==1){ // a|b=1
				Link(F(a),T(b));
				Link(F(b),T(a));
			}else{ // a|b=0
				Link(T(a),F(a));
				Link(T(b),F(b));
			}
		}else if(tmp[0]=='X'){
			if(c==1){ // a^b=1
				Link(T(a),F(b));
				Link(F(a),T(b));
				Link(T(b),F(a));
				Link(F(b),T(a));
			}else{ // a^b=0
				Link(T(a),T(b));
				Link(F(a),F(b));
				Link(T(b),T(a));
				Link(F(b),F(a));
			}
		}
	}
	for(int i=1;i<=n*2;i++)
		if(!dfn[i])Tarjan(i);
	for(int i=1;i<=n;i++){
		if(bel[F(i)]==bel[T(i)]){
			cout<<"NO";
			return 0;
		}
	}
//	for(int i=1;i<=n;i++){
//		if(bel[F(i)]<bel[T(i)]){
//			cout<<"X("<<(i-1)<<")="<<0<<"\n";
//		}else cout<<"X("<<(i-1)<<")="<<1<<"\n";
//	}
	cout<<"YES";
	return 0;
}

