#include<iostream>
#include<cstring>
#include<vector>
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

const int inf=0x3f3f3f3f;
const int N=1005;
const int M=10005;
int n,m,A,B;
vector<pair<int,int>> edges;

struct line{
	int Nxt,to,flw;
}l[M*2];
int h[N],cnt=1;

void Link(int u,int v,int f){
	l[++cnt]=(line){h[u],v,f};h[u]=cnt;
	l[++cnt]=(line){h[v],u,0};h[v]=cnt;
}

namespace MAXFLOW{
	int S,T,tot,dis[N],gap[N];
	int Stream(int u,int cur){
		int sum=0,d;
		if(u==T)return cur;
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(l[i].flw>0&&dis[v]+1==dis[u]){
				d=Stream(v,min(cur,l[i].flw));
				l[i].flw-=d;l[i^1].flw+=d;
				sum+=d;cur-=d;
				if(dis[S]==tot||!cur)return sum;
			}
		}
		if(!(--gap[dis[u]]))dis[S]=tot;
		gap[++dis[u]]++;
		return sum;
	}
	int Sap(){
		int ans=0;
		memset(gap,0,sizeof(gap));
		memset(dis,0,sizeof(dis));
		gap[0]=tot;
		while(dis[S]<tot)ans+=Stream(S,inf);
		return ans;
	}
}

int main(){
	m=read();n=read();A=m;B=n-m;
	while(true){
		int x=read(),y=read();
		if(x==-1&&y==-1)break;
		if(x>A)swap(x,y);
		Link(x,y,1);
		edges.push_back(make_pair(x,y));
	}
	MAXFLOW::S=n+1;
	MAXFLOW::T=n+2;
	MAXFLOW::tot=n+2;
	for(int i=1;i<=A;i++)
		Link(MAXFLOW::S,i,1);
	for(int i=A+1;i<=A+B;i++)
		Link(i,MAXFLOW::T,1);
	cout<<MAXFLOW::Sap()<<'\n';
	for(int i=0;i<edges.size();i++){
		int idx=(i+1)*2;
		if(l[idx].flw==0){
			cout<<edges[i].first<<' '<<edges[i].second<<'\n';
		}
	}
	return 0;
}

