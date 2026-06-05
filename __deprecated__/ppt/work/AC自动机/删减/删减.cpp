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

const int N=100005;
const int M=75;
int ch[N][26],fa[N],flg[N];
int tot=1,n;
char t[N],s[N];

vector<int> path;
vector<char> res;

void insert(int l){
	int u=1;
	for(int i=1,dir;i<=l;i++){
		dir=t[i]-'a';
		if(!ch[u][dir])
			ch[u][dir]=++tot;
		u=ch[u][dir];
	}
	flg[u]=l;
}

void build(){
	queue<int>q;
	q.push(1);
	while(q.size()){
		int u=q.front();q.pop();
		for(int i=0,v,f;i<26;i++){
			v=ch[u][i];f=fa[u]; 
			if(!v){ch[u][i]=ch[f][i]?ch[f][i]:1;continue;}
			q.push(v);
			fa[v]=ch[f][i]?ch[f][i]:1;
		}
	}
}

void remove(int l){
	int u=1;
	for(int i=1,dir;i<=l;i++){
		dir=s[i]-'a';
		u=ch[u][dir];
		path.push_back(u);
		res.push_back(s[i]);
		
		if(flg[u]){
			int L=flg[u];
			for(int j=1;j<=L;j++){
				path.pop_back();
				res.pop_back();
			}
			int tmp=path.size();
			if(tmp>0)u=path[tmp-1];
			else u=1;			
		}
	}
} 

int main(){
	scanf("%s",s+1);n=read();
	for(int i=1;i<=n;i++){
		scanf("%s",t+1);
		insert(strlen(t+1));
	}
	build();
	remove(strlen(s+1));
	for(int i=0;i<res.size();i++)
		cout<<res[i];
	return 0;
}

