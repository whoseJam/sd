#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<queue>
#include<cmath>
#define GET getchar()
using namespace std;

inline int read(){
	int s=0,f=1;char t=GET;
	while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
	while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
	return s*f;
}

int sum[2005][2005];
int C[2005][2005];

void Pre(int k){
	C[0][0]=1;
	for(int i=1;i<=2000;i++){
		C[i][0]=1;C[i][i]=1;
		for(int j=1;j<i;j++)
			C[i][j]=(C[i-1][j]+C[i-1][j-1])%k;
	}
}

void PreSum(){
	for(int i=0;i<=2000;i++){
		for(int j=0;j<=2000;j++){
			sum[i][j]=(C[i][j]==0&&j<=i);
			if(i-1>=0)sum[i][j]+=sum[i-1][j];
			if(j-1>=0)sum[i][j]+=sum[i][j-1];
			if(i-1>=0&&j-1>=0)sum[i][j]-=sum[i-1][j-1];
		}
	}
}

int main(){
	int Case=read(),k=read();Pre(k);PreSum();
	while(Case--){
		int n=read(),m=read();
		printf("%d\n",sum[n][m]);
	}
	return 0;
}