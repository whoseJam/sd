#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
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

const double inf=1e10;
const int N=105;
const int M=1000005;
int n,m,A[N],B[N],mp[N][N];

struct line{
	int Nxt,to;
	double flw;
}l[M*2];
int h[N],cnt;

void Link(int u,int v,double f){
	l[++cnt]=(line){h[u],v,f};h[u]=cnt;
	l[++cnt]=(line){h[v],u,0};h[v]=cnt;
}

void Clear(){
	cnt=1;
	memset(h,0,sizeof(h));
}

namespace MAXFLOW{
	int S,T,tot,dis[N],gap[N];
	double Stream(int u,double cur){
		double sum=0,d;
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
	double Sap(){
		double ans=0;
		memset(gap,0,sizeof(gap));
		memset(dis,0,sizeof(dis));
		gap[0]=tot;
		while(dis[S]<tot)ans+=Stream(S,inf);
		return ans;
	}
}

int Weapon(int x){
	return x;
}

int Robot(int x){
	return x+m;
}

bool Check(double T){
	Clear();
	MAXFLOW::S=n+m+1;
	MAXFLOW::T=n+m+2;
	MAXFLOW::tot=n+m+2;
	for(int i=1;i<=m;i++){
		Link(MAXFLOW::S,Weapon(i),T*B[i]);
	}
	double totalA=0;
	for(int i=1;i<=n;i++){
		Link(Robot(i),MAXFLOW::T,A[i]);
		totalA+=A[i];
	}
	for(int i=1;i<=m;i++){
		for(int j=1;j<=n;j++){
			if(mp[i][j]){
				Link(Weapon(i),Robot(j),inf);
			}
		}
	}
	double ans=MAXFLOW::Sap();
	return fabs(ans-totalA)<=1e-7;
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)A[i]=read();
	for(int i=1;i<=m;i++)B[i]=read();
	for(int i=1;i<=m;i++){
		for(int j=1;j<=n;j++){
			mp[i][j]=read();
		}
	}
	
	double l=0,r=1e5,mid;
	while(r-l>1e-7){
		mid=(l+r)/2.0;
		if(Check(mid))r=mid;
		else l=mid;
	}
	printf("%.6lf\n",l);
	return 0;
}

