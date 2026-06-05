#include<iostream>
#include<cstdio>
#include<cstring>
#include<algorithm>
using namespace std;

const int inf=0x3f3f3f3f;
const int N=305;
int f[N][N][2],d[N],n,m,ans;

bool cmp(int t1,int t2){
	return t1<t2;
}

int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++)scanf("%d",&d[i]);
	sort(d+1,d+1+n,cmp);
	
	for(int k=1;k<=n;k++){
		for(int i=1;i<=n;i++)
			for(int j=1;j<=n;j++)
				f[i][j][0]=f[i][j][1]=inf;
		for(int i=1;i<=n;i++){
			f[i][i][0]=f[i][i][1]=abs(d[i])*k;
		}
		for(int len=1;len<k;len++)
			for(int l=1;l<=n-len+1;l++){
				int r=l+len-1;
				f[l-1][r][0]=min(f[l-1][r][0],f[l][r][0]+(k-(r-l+1))*(d[l]-d[l-1]));
				f[l][r+1][1]=min(f[l][r+1][1],f[l][r][0]+(k-(r-l+1))*(d[r+1]-d[l]));
				f[l-1][r][0]=min(f[l-1][r][0],f[l][r][1]+(k-(r-l+1))*(d[r]-d[l-1]));
				f[l][r+1][1]=min(f[l][r+1][1],f[l][r][1]+(k-(r-l+1))*(d[r+1]-d[r]));
			}
		for(int i=1;i+k-1<=n;i++){
			int j=i+k-1;
			ans=max(ans,k*m-f[i][j][0]);
			ans=max(ans,k*m-f[i][j][1]);
		}
	}
	printf("%d",ans);
	return 0;
}
