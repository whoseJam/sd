#include<iostream>
#include<cstring>
#include<cstdio>
#include<map>
using namespace std;

namespace FastIO{
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=2005;
int n,m;
char s[N];
bool A[N][N],X[N];

void output(){
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n+1;j++){
			cout<<A[i][j];
		}cout<<"\n";
	}
}

int Gauss(){
	int ans=0;
	for(int i=1;i<=n;i++){
		int pos=-1;
		for(int j=i;j<=m;j++){
			if(A[j][i]){
				pos=j;
				break;
			}
		}
		if(pos==-1)return -1; // multiple solution
		ans=max(ans,pos);
		swap(A[pos],A[i]);
		for(int j=i+1;j<=m;j++){
			if(A[j][i]){
				for(int k=1;k<=n+1;k++){
					A[j][k]^=A[i][k];
				}
			}
		}
	}
	for(int i=n;i>=1;i--){
		for(int j=i+1;j<=n;j++){
			A[i][n+1]^=(A[i][j]*X[j]);
		}
		X[i]=A[i][n+1];
	}
	return ans;
}

int main(){
	n=read();m=read();
	for(int i=1;i<=m;i++){
		scanf("%s",s+1);
		for(int j=1;j<=n;j++)A[i][j]=(s[j]-'0');
		A[i][n+1]=read();
	}
	int x=Gauss();
	if(x==-1)cout<<"Cannot Determine\n";
	else{
		cout<<x<<'\n';
		for(int i=1;i<=n;i++){
			if(X[i])cout<<"?y7M#\n";
			else cout<<"Earth\n";
		}
	}
	return 0;
}

