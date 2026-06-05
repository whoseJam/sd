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
const int N=205;
int n,nn,a[N],mx[N][N],mn[N][N],s[N];

int main(){
	n=read();
	for(int i=1;i<=n;i++)a[i]=a[i+n]=read();
	
	nn=n*2;
	for(int i=1;i<=nn;i++)s[i]=s[i-1]+a[i];
	for(int i=1;i<=nn;i++)mx[i][i]=mn[i][i]=0;
	for(int len=2;len<=nn;len++){
		for(int i=1;i+len-1<=nn;i++){
			int j=i+len-1;
			mn[i][j]=inf;
			mx[i][j]=-inf;
			for(int k=i;k<j;k++){
				mn[i][j]=min(mn[i][k]+mn[k+1][j]+s[j]-s[i-1],mn[i][j]);
				mx[i][j]=max(mx[i][k]+mx[k+1][j]+s[j]-s[i-1],mx[i][j]);
			}
		}
	}
	
	int ansmx=-inf,ansmn=inf;
	for(int i=1;i<=n;i++){
		ansmx=max(ansmx,mx[i][i+n-1]);
		ansmn=min(ansmn,mn[i][i+n-1]);
	}
	cout<<ansmn<<endl;
	cout<<ansmx<<endl;
	return 0;
}
