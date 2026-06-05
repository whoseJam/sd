#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=300005;
const int lim=19;
int fa[N][20],dep[N],dis[N],n,m;
int d[N],s[N];

struct plan{
	int x,y,lca,dis;
}p[N];

bool cmp(const plan& a,const plan& b){
	return a.dis>b.dis;
}

struct line{
	int Nxt,to,val;
}l[N*2];
int h[N],cnt;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
	l[++cnt]=(line){h[v],u,w};h[v]=cnt;
}

int LCA(int x,int y){
	if(dep[x]<dep[y])swap(x,y);
	for(int i=lim;i>=0;i--)
		if(dep[fa[x][i]]>=dep[y])
			x=fa[x][i];
	if(x==y)return x;
	for(int i=lim;i>=0;i--)
		if(fa[x][i]!=fa[y][i]){
			x=fa[x][i];
			y=fa[y][i];
		}
	return fa[x][0];
}

void Dfs1(int u,int f,int d){
	fa[u][0]=f;dep[u]=d;
	for(int i=1;i<=lim;i++)
		fa[u][i]=fa[fa[u][i-1]][i-1];
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			dis[v]=dis[u]+l[i].val;
			Dfs1(v,u,d+1);
		}
	}
}

int CNT,MAXLEN;
void Dfs2(int u,int f){
	s[u]=d[u];
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v!=f){
			Dfs2(v,u);
			s[u]+=s[v];
			if(s[v]==CNT){
				MAXLEN=max(MAXLEN,l[i].val);
			}
		}
	}
}

bool Check(int limit){
	MAXLEN=0;
	int LONGESTPATH=0;
	while(p[CNT+1].dis>limit){
		CNT++;
		d[p[CNT].x]++;
		d[p[CNT].y]++;
		d[p[CNT].lca]-=2;
	}
	while(p[CNT].dis<=limit){
		d[p[CNT].x]--;
		d[p[CNT].y]--;
		d[p[CNT].lca]+=2;
		CNT--;
	}
	if(CNT>=1)LONGESTPATH=p[1].dis;
	Dfs2(1,0);
	return LONGESTPATH-MAXLEN<=limit; 
}

int main(){
	n=read();m=read();
	for(int i=1,x,y,w;i<n;i++){
		x=read();y=read();w=read();
		Link(x,y,w);
	}
	Dfs1(1,0,1);

	int maxlen=0;
	for(int i=1;i<=m;i++){
		p[i].x=read();
		p[i].y=read();
		p[i].lca=LCA(p[i].x,p[i].y);
		p[i].dis=dis[p[i].x]+dis[p[i].y]-2*dis[p[i].lca];
		maxlen=max(maxlen,p[i].dis);
	}
	sort(p+1,p+1+m,cmp);

	int l=0,r=maxlen;
	while(l<=r){
		int mid=(l+r)>>1;
		if(Check(mid))r=mid-1;
		else l=mid+1;
	}
	cout<<l<<'\n';
	return 0;
}
