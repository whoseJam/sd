#include<iostream>
#include<cmath>
using namespace std;
int fa[50001],dis[50001];
int ans=0;

int GetFa(int k){
	if(fa[k]==k)return k;
	int tmp=fa[k];
	fa[k]=GetFa(fa[k]);
	dis[k]=(dis[k]+dis[tmp])%3;
	return fa[k];
}

void Merge(int x,int y,int d){
	int fx=GetFa(x),fy=GetFa(y);
	if(fx==fy){
		if(dis[x]!=(dis[y]+d)%3)ans++;
		return;
	}
	fa[fx]=fy;
	dis[fx]=((dis[y]+d-dis[x])%3+3)%3;
}

int main(){
	int n,k,x,y;
	char temp;
	cin>>n>>k;
	for(int i=1;i<=n;i++)
		fa[i]=i;
	for(int i=1;i<=k;i++){
		cin>>temp>>x>>y;
		if(temp=='2'&&x==y){ans++;continue;}
		if(x>n||y>n){ans++;continue;}
		if(temp=='1')Merge(x,y,0);
		if(temp=='2')Merge(x,y,1);
	}
	cout<<ans;
	return 0;
}
