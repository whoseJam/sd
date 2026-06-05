#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int L=1000005;
const int N=205;
const int M=75;
int ch[L][26],fa[L],vis[L],pos[N];
int tot=1,n;
string s[N];

struct line{
	int Nxt,to;
}l[L];
int h[L],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

void insert(int idx,const string& s){
	int u=1;
	for(int i=0,dir;i<s.length();i++){
		dir=s[i]-'a';
		if(!ch[u][dir])
			ch[u][dir]=++tot;
		u=ch[u][dir];
	}
	pos[idx]=u;
}

void build(){
	queue<int>q;
	q.push(1);
	while(q.size()){
		int u=q.front();q.pop();
		for(int i=0,v,f;i<26;i++){
			if(!ch[u][i])continue;
			q.push(v=ch[u][i]);
			f=fa[u];
			while(f&&ch[f][i]==0)f=fa[f];
			if(ch[f][i])fa[v]=ch[f][i];
			else fa[v]=1;
		}
	}
	for(int i=1;i<=tot;i++)
		if(fa[i])Link(fa[i],i);
}

void query(const string& s){
	int ans=0,u=1;
	for(int i=0,dir;i<s.length();i++){
		dir=s[i]-'a';
		while(u&&!ch[u][dir])u=fa[u];
		if(ch[u][dir])u=ch[u][dir];
		else u=1;
		vis[u]++;
	}
}

void Dfs(int u){
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		Dfs(v);
		vis[u]+=vis[v]; 
	}
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		cin>>s[i];
		insert(i,s[i]);
	}
	build();
	for(int i=1;i<=n;i++)
		query(s[i]);
	Dfs(1);
	for(int i=1;i<=n;i++)
		cout<<vis[pos[i]]<<'\n';
	return 0;
}

