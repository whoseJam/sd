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

const int inf=0x3f3f3f3f;
const int N=2005;
const int M=3005;
int dis[N],inq[N],len[N],n,m;

struct line{
	int Nxt,to,val;
}l[M*2];
int h[N],cnt;

void Link(int u,int v,int w){
	l[++cnt]=(line){h[u],v,w};h[u]=cnt;
}

bool SPFA(int S){
	for(int i=1;i<=n;i++)dis[i]=inf;
	dis[S]=0;inq[S]=1; 
	queue<int>q;
	q.push(S);
	while(q.size()){
		int u=q.front();q.pop();inq[u]=0;
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			if(dis[v]>dis[u]+l[i].val){
				dis[v]=dis[u]+l[i].val;
				len[v]=len[u]+1;
				if(len[v]>=n)return true; 
				if(!inq[v]){
					q.push(v);
					inq[v]=1;
				}
			}
		}
	}
	return false;
}

void Clear(){
	memset(h,0,sizeof(h));
	memset(len,0,sizeof(len));
	memset(inq,0,sizeof(inq));
	cnt=0;
}

void Solve(){
	Clear();
	n=read();m=read();
	for(int i=1,x,y,w;i<=m;i++){
		x=read();y=read();w=read();
		Link(x,y,w);
		if(w>=0)Link(y,x,w);
	}
	if(SPFA(1))cout<<"YES\n";
	else cout<<"NO\n";
}

int main(){
	int Case=read();
	while(Case--)Solve();
	return 0;
}

