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

const int N=10005;
int n,prt[N],num[N],root,maxx;

int main(){
	cin>>n;
	for(int i=1,x,y;i<n;i++){
		cin>>x>>y;
		prt[y]=x;
		num[x]++;
	}
	for(int i=1;i<=n;i++){
		if(prt[i]==0)root=i;
		if(num[i]>num[maxx])maxx=i;
	}
	cout<<root<<endl;
	cout<<maxx<<endl;
	for(int i=1;i<=n;i++)
		if(prt[i]==maxx)cout<<i<<" ";
	return 0;
}

