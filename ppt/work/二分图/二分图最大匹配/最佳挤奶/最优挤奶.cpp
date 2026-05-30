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
const int N=505;
const int E=50005;
int vis[N],K,C,m,d[N][N];
vector<int>match[N]; 

struct line{
	int Nxt,to;
}l[E];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
}

bool findPath(int u){
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(!vis[v]){
			vis[v]=true;
			if(match[v].size()<m){
				match[v].push_back(u);
				return true;
			}else{
				for(int t=0;t<match[v].size();t++){
					if(findPath(match[v][t])){
						match[v][t]=u;
						return true;
					}
				}
			}
		}
	}
	return false;
}

bool Check(int maxlen){
	cnt=0;
	memset(h,0,sizeof(h));
	for(int i=1;i<=K;i++)match[i].clear();
	for(int i=K+1;i<=K+C;i++)
		for(int j=1;j<=K;j++)
			if(maxlen>=d[i][j]){
				Link(i-K,j);	// Cow i -> House j
			}
	int ans=0;
	for(int i=1;i<=C;i++){
		memset(vis,0,sizeof(vis));
		if(findPath(i))ans++;
	}
	return ans==C;
}

void Floyd(){
	for(int k=1;k<=K+C;k++)
		for(int i=1;i<=K+C;i++)
			for(int j=1;j<=K+C;j++)
				d[i][j]=min(d[i][j],d[i][k]+d[k][j]);
}

void Solve(){
	int l=0,r=1000,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(Check(mid))r=mid-1;
		else l=mid+1;
	}
	cout<<l<<'\n';
}

int main(){
	K=read();C=read();m=read();
	for(int i=1;i<=K+C;i++)
		for(int j=1;j<=K+C;j++){
			d[i][j]=read();
			if(d[i][j]==0)d[i][j]=inf;
		}
	Floyd();
	Solve();
	return 0;
}

