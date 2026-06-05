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

const int N=300005;
int fa[N][20],dep[N],w[N],s[N],a[N];
int n,k,ans;

struct line{
	int Nxt,to;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

void Dfs1(int u,int f){
	fa[u][0]=f;dep[u]=dep[f]+1;
	for(int i=1;i<=18;i++)
		fa[u][i]=fa[fa[u][i-1]][i-1];
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f)Dfs1(v,u);
	}
}

int LCA(int a,int b){
	if(dep[a]<dep[b])swap(a,b);
	for(int i=18;i>=0;i--)if(dep[fa[a][i]]>=dep[b])a=fa[a][i];
	if(a==b)return a;
	for(int i=18;i>=0;i--)
		if(fa[a][i]!=fa[b][i]){
			a=fa[a][i];
			b=fa[b][i];
		}
	return fa[a][0];
}

void Dfs2(int u,int f){
	s[u]=w[u];
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			Dfs2(v,u);
			s[u]+=s[v];
		}
	}
	ans=max(ans,s[u]);
}

int main(){
	n=read();
	for(int i=1;i<=n;i++)a[i]=read();
	for(int i=1,x,y;i<=n-1;i++){
		x=read();y=read();
		Link(x,y);
	}
	Dfs1(1,0);
	for(int i=1,g;i<n;i++){
		g=LCA(a[i],a[i+1]);
		w[a[i]]++;w[a[i+1]]++;
		w[g]--;w[fa[g][0]]--;
	}
	Dfs2(1,0);
	for(int i=2;i<=n;i++)s[a[i]]--;
	for(int i=1;i<=n;i++)cout<<s[i]<<'\n';
	return 0;
}

