#include<bits/stdc++.h>
using namespace std;

const int R=25;
const int N=805;
const int M=160005;
const int inf=0x3f3f3f3f;
char mp[R][R];
int In[R][R],Out[R][R],tot;
int r,c,d,H[R][R];

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

int getDis(int x1,int y1,int x2,int y2){
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

bool canJumpOut(int x,int y){
	if(x<=d)return true;
	if(y<=d)return true;
	if(r-x+1<=d)return true;
	if(c-y+1<=d)return true;
	return false;
}

void Build(){
	for(int i=1;i<=r;i++){
		for(int j=1;j<=c;j++){
			In[i][j]=++MAXFLOW::tot;
			Out[i][j]=++MAXFLOW::tot;
		}
	}
	MAXFLOW::S=++MAXFLOW::tot;
	MAXFLOW::T=++MAXFLOW::tot;
	for(int i=1;i<=r;i++){
		for(int j=1;j<=c;j++){
			Link(In[i][j],Out[i][j],H[i][j]);
			if(mp[i][j]=='L')Link(MAXFLOW::S,In[i][j],1);
			for(int x=1;x<=r;x++){
				for(int y=1;y<=c;y++){
					if(getDis(i,j,x,y)<=d*d){
						Link(Out[i][j],In[x][y],inf);
					}
				}
			}
			if(canJumpOut(i,j)){
				Link(Out[i][j],MAXFLOW::T,inf);
			}
		}
	}
}

int main(){
	cin>>r>>c>>d;
	for(int i=1;i<=r;i++)
		for(int j=1;j<=c;j++){
			char tmp;
			cin>>tmp;
			H[i][j]=tmp-'0';
		}
	for(int i=1;i<=r;i++)
		for(int j=1;j<=c;j++){
			cin>>mp[i][j];
			if(mp[i][j]=='L')tot++;
		}
	Build();
	cout<<tot-MAXFLOW::Sap()<<'\n';
	return 0;
}


