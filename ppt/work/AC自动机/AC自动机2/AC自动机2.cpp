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
const int N=155;
const int M=75;
int ch[N*M][26],fa[N*M],vis[N*M],pos[N];
int tot=1,n;
char s[N][M];
char t[L];

void insert(int idx,int l){
	int u=1;
	for(int i=1,dir;i<=l;i++){
		dir=s[idx][i]-'a';
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
}

void query(int l){
	int ans=0,u=1;
	for(int i=1,dir;i<=l;i++){
		dir=t[i]-'a';
		while(u&&!ch[u][dir])u=fa[u];
		if(ch[u][dir])u=ch[u][dir];
		else u=1;
		for(int f=u;f;f=fa[f])vis[f]++;
	}
	int maxx=0;
	for(int i=1;i<=n;i++)
		maxx=max(maxx,vis[pos[i]]);
	cout<<maxx<<'\n';
	for(int i=1;i<=n;i++)
		if(vis[pos[i]]==maxx)
			printf("%s\n",s[i]+1);
}

void clear(){
	tot=1;
	memset(ch,0,sizeof(ch));
	memset(fa,0,sizeof(fa));
	memset(vis,0,sizeof(vis));
	memset(pos,0,sizeof(pos));
}

int main(){
	n=read();
	while(n!=0){
		clear();
		for(int i=1;i<=n;i++){
			scanf("%s",s[i]+1);
			insert(i,strlen(s[i]+1));
		}
		build();
		scanf("%s",t+1);
		query(strlen(t+1));
		
		n=read();
	}
	return 0;
}

