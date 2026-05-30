#include<iostream>
#include<cstdio>
#include<cmath>
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

const int N=100005;
int a[N],L[N],R[N],sum[N],mx[N][20];
int n,q;

void Pre(){
	for(int i=1;i<=n;i++)mx[i][0]=sum[i];
	for(int j=1;(1<<j)<=n;j++)
		for(int i=1;i+(1<<j)-1<=n;i++)
			mx[i][j]=max(mx[i][j-1],mx[i+(1<<j-1)][j-1]);
}

int Askmx(int l,int r){
	int k=log2(r-l+1);
	return max(mx[l][k],mx[r-(1<<k)+1][k]);
}

int Query(int l,int r){
	if(a[l]==a[r])return r-l+1;
	int nl=R[l]-l+1;
	int nr=r-L[r]+1;
	int ans=max(nl,nr);
	if(R[l]+1<=L[r]-1)ans=max(ans,Askmx(R[l]+1,L[r]-1));
	return ans;
}

void Solve(){
	for(int i=1;i<=n;i++)
		a[i]=read();
	for(int l=1,r;l<=n;l=r+1){
		r=l;
		while(r+1<=n&&a[r+1]==a[l])r++;
		for(int i=l;i<=r;i++){
			sum[i]=r-l+1;
			L[i]=l;
			R[i]=r;
		}
	}
	Pre();
	
	for(int i=1,l,r;i<=q;i++){
		l=read();r=read();
		cout<<Query(l,r)<<'\n';
	}
}

int main(){
	while(cin>>n&&n){
		q=read();
		Solve();
	}
	return 0;
}
