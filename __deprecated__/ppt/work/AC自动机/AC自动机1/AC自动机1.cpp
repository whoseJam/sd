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

const int N=1000005;
int ch[N][26],fa[N],flg[N],vis[N];
int tot=1;
char s[N];

void insert(int l){
	int u=1;
	for(int i=1,dir;i<=l;i++){
		dir=s[i]-'a';
		if(!ch[u][dir])
			ch[u][dir]=++tot;
		u=ch[u][dir];
	}
	flg[u]++;
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

int query(int l){
	int ans=0,u=1;
	for(int i=1,dir;i<=l;i++){
		dir=s[i]-'a';
		while(u&&!ch[u][dir])u=fa[u];
		if(ch[u][dir])u=ch[u][dir];
		else u=1;
		for(int f=u;!vis[f];f=fa[f])vis[f]=1;
	}
	for(int i=2;i<=tot;i++)
		if(vis[i])ans+=flg[i];
	return ans;
}

int main(){
	int n=read();
	for(int i=1;i<=n;i++){
		scanf("%s",s+1);
		insert(strlen(s+1));
	}
	build();
	scanf("%s",s+1);
	cout<<query(strlen(s+1));
	return 0;
}

