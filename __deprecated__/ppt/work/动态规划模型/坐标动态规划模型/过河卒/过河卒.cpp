#include<iostream>
using namespace std;

typedef long long ll;
const ll N=25;
const ll inf=0x3f3f3f3f;
ll dp[N][N],cx,cy,n,m;
ll dx[9]={1,-1,1,-1,2,-2,2,-2,0};
ll dy[9]={2,2,-2,-2,1,1,-1,-1,0};

int main(){
	scanf("%d%d%d%d",&n,&m,&cx,&cy);
	cx++;cy++;n++;m++;
	for(ll i=0;i<9;i++){
		ll tx=cx+dx[i];
		ll ty=cy+dy[i];
		if(1<=tx&&tx<=n&&1<=ty&&ty<=m)
			dp[tx][ty]=-inf;
	}
	if(dp[1][1]!=-inf)dp[1][1]=1;
	for(ll i=1;i<=n;i++){
		for(ll j=1;j<=m;j++){
			if(dp[i][j]==-inf)continue;
			if(i==1&&j==1)continue;
			ll ans=0;
			if(dp[i-1][j]!=-inf)ans+=dp[i-1][j];
			if(dp[i][j-1]!=-inf)ans+=dp[i][j-1];
			dp[i][j]=ans;
		}
	}
	if(dp[n][m]==-inf)cout<<0<<'\n';
	else cout<<dp[n][m]<<'\n';
	return 0;
}
