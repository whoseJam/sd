#include<iostream>
#include<cstdio>
#include<cmath>
using namespace std;

const int N=200005;
const int M=2000005;
int a[N],st[N],lst[M],len[N],mxf[N][20];
int n,m;

void Table(){
	for(int j=1;(1<<j)<=n;j++)
		for(int i=1;i+(1<<j)-1<=n;i++)
			mxf[i][j]=max(mxf[i][j-1],mxf[i+(1<<j-1)][j-1]);
}

int Find(int ql,int qr){
	int l=ql,r=qr;
	while(l<=r){
		int mid=(l+r)>>1;
		if(st[mid]<=ql)l=mid+1;
		else r=mid-1;
	}
	return r;
}

int maxF(int l,int r){
	if(l>r)return 0;
	int k=log2(r-l+1);
	return max(mxf[l][k],mxf[r-(1<<k)+1][k]);
}

int Ask(int l,int r){
	int M=Find(l,r);
	int len1=M-l+1;
	int len2=maxF(M+1,r);
	return max(len1,len2);
}

int main(){
	cin>>n>>m;
	for(int i=1;i<=n;i++){
		scanf("%d",&a[i]);
		st[i]=max(st[i-1],lst[a[i]+1000000]+1);
		len[i]=i-st[i]+1;
		lst[a[i]+1000000]=i;
		mxf[i][0]=len[i];
	}	
	Table();
	
	for(int i=1,l,r;i<=m;i++){
		scanf("%d%d",&l,&r);l++;r++;
		printf("%d\n",Ask(l,r));
	}
	return 0;
}