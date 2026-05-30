#include<iostream>
#include<cstring>
#include<queue>
#include<algorithm>
using namespace std;

const int N=55;
const int inf=0x3f3f3f3f;
int n,C,power[N],f[N][N][2];

struct Light{
	int P,pos;
}l[N];

bool cmp(Light t1,Light t2){
	return t1.pos<t2.pos;
}

int dist(int a,int b){
	return abs(l[a].pos-l[b].pos);
}

int main(){
	cin>>n>>C;
	for(int i=1;i<=n;i++)cin>>l[i].pos>>l[i].P;
	sort(l+1,l+1+n,cmp);
	for(int i=1;i<=n;i++)power[i]=power[i-1]+l[i].P;
	for(int i=0;i<=n;i++)
		for(int j=0;j<=n;j++)
			for(int k=0;k<=1;k++)
				f[i][j][k]=inf;
	
	f[C][C][0]=f[C][C][1]=0;
	for(int len=1;len<n;len++){
		for(int i=1;i<=n-len+1;i++){
			int j=i+len-1;
			int stillOn=power[n]-(power[j]-power[i-1]);
			if(f[i][j][1]!=inf){
				if(j!=n)f[i][j+1][1]=min(f[i][j+1][1],f[i][j][1]+dist(j,j+1)*stillOn);
				if(i!=1)f[i-1][j][0]=min(f[i-1][j][0],f[i][j][1]+dist(j,i-1)*stillOn);
			}
			if(f[i][j][0]!=inf){
				if(j!=n)f[i][j+1][1]=min(f[i][j+1][1],f[i][j][0]+dist(i,j+1)*stillOn);
				if(i!=1)f[i-1][j][0]=min(f[i-1][j][0],f[i][j][0]+dist(i,i-1)*stillOn);
			}
		}
	}
	cout<<min(f[1][n][0],f[1][n][1]);
	return 0;
}
