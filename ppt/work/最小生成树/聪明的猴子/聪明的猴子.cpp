#include<algorithm>
#include<iostream>
#include<cstdio>
#include<cmath>
using namespace std;

const int N=1005;
const double inf=1e9; 
double x[N],y[N],monkey[N],dis[N];
double mxl;
int n,m,vis[N];

double getDist(int a,int b){
	return sqrt((x[a]-x[b])*(x[a]-x[b])+(y[a]-y[b])*(y[a]-y[b]));
}

void Prim(int s){
	for(int i=1;i<=n;i++)dis[i]=inf;
	dis[s]=0;dis[0]=inf;
	for(int i=1;i<=n;i++){
		int u=0;
		for(int v=1;v<=n;v++)
			if(!vis[v]&&dis[u]>dis[v])u=v;
		
		mxl=max(mxl,dis[u]);
		vis[u]=1;
		for(int v=1;v<=n;v++)
			if(!vis[v])dis[v]=min(dis[v],getDist(u,v));
	}
}

int main(){
	cin>>m;
	for(int i=1;i<=m;i++)cin>>monkey[i];
	cin>>n;
	for(int i=1;i<=n;i++)cin>>x[i]>>y[i];
	Prim(1);
	
	int ans=0;
	for(int i=1;i<=m;i++)
		if(monkey[i]>=mxl)ans++;
	cout<<ans;
	return 0;
}
