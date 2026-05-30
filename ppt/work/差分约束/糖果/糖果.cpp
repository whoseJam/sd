#include<iostream>
#include<cstring>
#include<cstdio>
#include<queue>
using namespace std;

const int N=100005;
const int M=1000005;
const int inf=0x3f3f3f3f;
typedef long long ll;
int n,k,dis[N],inq[N],len[N];

struct line{
	int Nxt,to,val;
}l[M];
int cnt,h[N];

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

int Spfa(){
	queue<int>q;
	for(int i=1;i<=n;i++){
		dis[i]=0;
		q.push(i);
		inq[i]=1;
	}
	while(q.size()){
		int u=q.front();q.pop();
		inq[u]=0;
		for(int i=h[u];i;i=l[i].Nxt){
			int v=l[i].to;
			if(dis[v]<dis[u]+l[i].val){
				dis[v]=dis[u]+l[i].val;
				len[v]=len[u]+1;
				if(len[v]>=n)return true;
				if(!inq[v]){
					inq[v]=1;q.push(v);
				}
			}
		}
	}
	return false;
}

int main(){
	int flag=0;
	scanf("%d%d",&n,&k);
	for(int i=1,order,a,b;i<=k;i++){
		scanf("%d%d%d",&order,&a,&b);
		if(order==1){ // X[a]==X[b]
			Link(a,b,0); // X[a]+0<=X[b]
			Link(b,a,0); // X[b]+0<=X[a]
		}
		if(order==2){ // X[a]<X[b]
			if(a==b)flag=1;
			Link(a,b,1); // X[a]+1<=X[b]
		}
		if(order==3){ // X[a]>=X[b]
			Link(b,a,0); // X[b]+0<=X[a]
		}
		if(order==4){ // X[a]>X[b]
			if(a==b)flag=1;
			Link(b,a,1); // X[b]+1<=X[a]
		}
		if(order==5){ // X[b]>=X[a]
			Link(a,b,0); // X[a]+0<=X[b]
		}
	}
	if(flag){printf("-1");return 0;}
	if(!Spfa()){
		int offset=0;
		for(int i=1;i<=n;i++)
			offset=min(offset,dis[i]);
		for(int i=1;i<=n;i++)
			dis[i]=(dis[i]-offset)+1;
		ll ans=0;
		for(int i=1;i<=n;i++)
			ans+=dis[i];
		printf("%lld",ans);
	}else printf("-1");
	return 0;
}
