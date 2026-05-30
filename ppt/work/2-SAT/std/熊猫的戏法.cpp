#include<iostream>
#include<cstring>
#include<cstdio>
#include<stack>
using namespace std;

const int N=2005;
const int M=1000005;
int low[N],dfn[N],ins[N],bel[N],SCC,tot;
stack<int> stk;
int a[N],b[N];
int n,m;

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

int inc(int x){
	return x;
}

int ouc(int x){
	return x+m;
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
	cin>>n>>m;
	for(int i=1;i<=m;i++){
		cin>>a[i]>>b[i];
		if(a[i]>b[i])swap(a[i],b[i]);
	}
	for(int i=1;i<=m;i++){
		for(int j=i+1;j<=m;j++){
			if((a[i]<a[j]&&a[j]<b[i]&&b[i]<b[j])||
			   (a[j]<a[i]&&a[i]<b[j]&&b[j]<b[i])){
				Link(inc(i),ouc(j));
				Link(inc(j),ouc(i));
				Link(ouc(i),inc(j));
				Link(ouc(j),inc(i));
			}
		}
	}
	for(int i=1;i<=m*2;i++)
		if(!dfn[i])Tarjan(i);
	for(int i=1;i<=m;i++){
		if(bel[inc(i)]==bel[ouc(i)]){
			cout<<"the evil panda is lying again";
			return 0;
		}
	}
	cout<<"panda is telling the truth...";
	return 0;
}

