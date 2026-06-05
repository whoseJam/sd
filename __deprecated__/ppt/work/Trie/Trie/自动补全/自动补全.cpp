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

const int W=30005;
const int N=10005;
const int M=1000005;
int w,n,tot=1;
char s[M];
int ch[M][26],siz[M],flg[M];

void insert(int l,int id){
	int u=1;
	for(int i=1,dir;i<=l;i++){
		siz[u]++;
		dir=s[i]-'a';
		if(!ch[u][dir])
			ch[u][dir]=++tot;
		u=ch[u][dir];
	}
	siz[u]++;
	flg[u]=id;
}

int find(int u,int k){
	if(siz[u]<k)return -1;
	if(flg[u]&&k==1)return flg[u];
	if(flg[u])k--;
	for(int i=0,v;i<26;i++){
		v=ch[u][i];
		if(!v)continue;
		if(k>siz[v])k-=siz[v];
		else return find(v,k);
	}
	return -1;
}

int query(int l,int k){
	int u=1;
	for(int i=1,dir;i<=l;i++){
		dir=s[i]-'a';
		if(!ch[u][dir])
			return -1;
		u=ch[u][dir];
	}
	return find(u,k);
}

int main(){
	w=read();n=read();
	for(int i=1;i<=w;i++){
		scanf("%s",s+1);
		insert(strlen(s+1),i);
	}
	for(int i=1,k;i<=n;i++){
		k=read();
		scanf("%s",s+1);
		cout<<query(strlen(s+1),k)<<'\n';
	}
	return 0;
}
