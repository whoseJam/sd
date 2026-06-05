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

const int N=30005;
int ch[N][2],fa[N],flg[N];
int tot=1,n;
string s[N];

void insert(const string& s){
	int u=1;
	for(int i=0,dir;i<s.length();i++){
		dir=s[i]-'0';
		if(!ch[u][dir])
			ch[u][dir]=++tot;
		u=ch[u][dir];
	}
	flg[u]=true;
}

void build(){
	queue<int>q;
	q.push(1);
	while(q.size()){
		int u=q.front();q.pop();
		for(int i=0,v,f;i<=1;i++){
			v=ch[u][i];f=fa[u];
			if(!v){ch[u][i]=ch[f][i]?ch[f][i]:1;continue;}
			q.push(v);
			fa[v]=ch[f][i]?ch[f][i]:1;
			flg[v]|=flg[fa[v]];
		}
	}
}

int ins[N],used[N];
bool Dfs(int x){
	ins[x]=1;
	for(int i=0; i<2; i++){
		int v=ch[x][i];
		if(ins[v])return 1;
		if(used[v]||flg[v])continue;
		used[v]=1;
		if(Dfs(v))return 1;
	}
	ins[x]=0;
	return 0;
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		cin>>s[i];
		insert(s[i]);
	}
	build();
	if(Dfs(1))cout<<"TAK";
	else cout<<"NIE";
	return 0;
}

