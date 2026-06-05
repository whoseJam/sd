#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

const int N=55;
const int inf=0x3f3f3f3f;
int f[N][N],n;
string Color;

int main(){
	cin>>Color;Color=' '+Color;n=Color.length()-1;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			f[i][j]=inf;
	for(int i=1;i<=n;i++)f[i][i]=1;
	for(int len=2;len<=n;len++){
		for(int i=1;i+len-1<=n;i++){
			int j=i+len-1;
			if(Color[i]==Color[j])f[i][j]=min(f[i+1][j],f[i][j-1]);
			for(int k=i;k<=j-1;k++)
				f[i][j]=min(f[i][j],f[i][k]+f[k+1][j]);
		}
	}
	cout<<f[1][n];
	return 0;
}
