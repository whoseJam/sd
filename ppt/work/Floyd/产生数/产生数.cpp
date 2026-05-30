#include<iostream>
#include<cstdio>
#include<cmath>
using namespace std;
int K,map[10][10],F[10];
string N;

void print(__int128 tmp){
	if(tmp==0)return;
	print(tmp/10);
	cout<<int(tmp%10);
}

int main(){
	cin>>N>>K;
	int x,y;
	for(int i=0;i<=9;i++)F[i]=1;
	for(int i=1;i<=K;i++){
		cin>>x>>y;
		map[x][y]=1;
	}
	for(int k=0;k<=9;k++)
		for(int i=0;i<=9;i++)
			for(int j=0;j<=9;j++)
				map[i][j]=((map[i][j])||(map[i][k]&&map[k][j]));
	for(int i=0;i<=9;i++)
		for(int j=0;j<=9;j++)
			if(i!=j&&map[i][j])F[i]++;
	
	__int128 sum=1;
	for(int i=0;i<N.length();i++){
		sum=sum*F[N[i]-'0'];
	}
	print(sum);
	return 0;
}