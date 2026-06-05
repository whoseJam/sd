#include<iostream>
#include<cstring>
#include<cstdio>
#include<stack>

using namespace std;

const int M=100005;
const int N=20005;
int n,m,tot,SCC;
int bel[N],dfn[N],low[N],ins[N];
stack<int>s;

struct line{
	int Nxt,to;
}l[M];
int cnt,h[N];

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

int seeWife(int x){
	return x;
}

int seeHusband(int x){
	return x+n;
}

void Tarjan(int u){
	dfn[u]=low[u]=++tot;
	s.push(u);ins[u]=1;
	for(int i=h[u];i;i=l[i].Nxt){
		int v=l[i].to;
		if(!dfn[v]){
			Tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(ins[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u]){
		SCC++;
		while(true){
			bel[s.top()]=SCC;
			ins[s.top()]=0;
			if(s.top()==u){s.pop();break;}
			s.pop();
		}
	}
}

void Build(int i1,char s1,int i2,char s2){
	if(i1==i2)return;
	if(i1!=0&&i2==0)swap(i1,i2),swap(s1,s2);
	if(i1==0){
		if(s1=='w')return;
		if(s1=='h'){
			if(s2=='h')Link(seeHusband(i2),seeWife(i2));
			if(s2=='w')Link(seeWife(i2),seeHusband(i2));
		}
		return;
	}
	if(s1==s2&&s1=='w'){
		Link(seeWife(i1),seeHusband(i2));
		Link(seeWife(i2),seeHusband(i1));
	}else if(s1==s2&&s1=='h'){
		Link(seeHusband(i1),seeWife(i2));
		Link(seeHusband(i2),seeWife(i1));
	}else if(s1=='w'&&s2=='h'){
		Link(seeWife(i1),seeWife(i2));
		Link(seeHusband(i2),seeHusband(i1));
	}else if(s1=='h'&&s2=='w'){
		Link(seeHusband(i1),seeHusband(i2));
		Link(seeWife(i2),seeWife(i1));
	}
}

void Clear(){
	cnt=tot=SCC=0;
	memset(h,0,sizeof(h));
	memset(low,0,sizeof(low));
	memset(dfn,0,sizeof(dfn));
	memset(bel,0,sizeof(bel));
}

void Solve(){
	Clear();
	
	int num1,num2;
	char sex1[3],sex2[3];
	for(int i=1;i<=m;i++){
		scanf("%d%s%d%s",&num1,&sex1,&num2,&sex2);
		Build(num1,sex1[0],num2,sex2[0]);
	}
	
	for(int i=0;i<2*n;i++)
		if(!dfn[i])Tarjan(i);
	for(int i=0;i<n;i++){
		if(bel[seeWife(i)]==bel[seeHusband(i)]){
			printf("bad luck\n");
			return;
		}
	}
	for(int i=1;i<n;i++){
		if(bel[seeWife(i)]<bel[seeHusband(i)])printf("%dh ",i);
		else printf("%dw ",i);
	}
	printf("\n");
}

int main(){
	while(scanf("%d%d",&n,&m)!=EOF){
		if(n==0&&m==0)break;
		Solve();
	}
	return 0;
}
