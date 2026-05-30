#include<iostream>
#include<cstdio>
using namespace std;

const int N=205;
int n,f[N][N],vis[N][N];

struct Node{
	int head,tail;
}d[N];

int Dp(int l,int r){
	if(l==r)return 0;
	if(vis[l][r])return f[l][r];
	for(int i=l;i<=r-1;i++)
		f[l][r]=max(f[l][r],Dp(l,i)+Dp(i+1,r)+d[l].head*d[i].tail*d[r].tail);
	vis[l][r]=1;
	return f[l][r];
}

int main(){
	cin>>n;
	int tmp;
	for(int i=1;i<=n;i++){
		cin>>tmp;
		d[i].head=tmp;
		if(i!=1)d[i-1].tail=tmp;
	}
	d[n].tail=d[1].head;
	for(int i=1;i<=n;i++)
		d[i+n]=d[i];
	
	int ans=0;
	for(int i=1;i<=n;i++)
		ans=max(ans,Dp(i,i+n-1));
	cout<<ans;
	return 0;
}
