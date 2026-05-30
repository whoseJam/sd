#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
#define GET getchar()
using namespace std;

using ll=long long;

ll read(){
	ll s=0,f=1;char t=GET;
	while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
	while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
	return s*f;
}

const ll inf=1e16;
const ll N=1005;
double dp[N][N][2],sum[N];
ll n,x0,pos;

struct Ball{
	ll x,y,z;
}b[N];

bool cmp(Ball a,Ball b){
	return a.x<b.x;
}

ll dist(ll i,ll j){
	return abs(b[i].x-b[j].x);
}

int main(){
	n=read();x0=read();
	for(ll i=1;i<=n;i++)b[i].x=read();
	for(ll i=1;i<=n;i++)b[i].y=read();
	for(ll i=1;i<=n;i++)b[i].z=read();
	sort(b+1,b+1+n,cmp);
	for(ll i=1;i<=n;i++)sum[i]=sum[i-1]+b[i].z;
	for(ll i=1;i<=n;i++)
		for(ll j=i;j<=n;j++){
			dp[i][j][0]=dp[i][j][1]=inf;
		}
	for(ll i=1;i<=n;i++){
		dp[i][i][0]=dp[i][i][1]=abs(b[i].x-x0)*sum[n];
	}
	for(ll len=1;len<n;len++){
		for(ll l=1;l<=n-len+1;l++){
			ll r=l+len-1;
			if(l-1>=1){
				dp[l-1][r][0]=min(dp[l-1][r][0],dp[l][r][0]+dist(l,l-1)*(sum[l-1]+sum[n]-sum[r]));
				dp[l-1][r][0]=min(dp[l-1][r][0],dp[l][r][1]+dist(r,l-1)*(sum[l-1]+sum[n]-sum[r]));
			}
			if(r+1<=n){
				dp[l][r+1][1]=min(dp[l][r+1][1],dp[l][r][0]+dist(l,r+1)*(sum[l-1]+sum[n]-sum[r]));
				dp[l][r+1][1]=min(dp[l][r+1][1],dp[l][r][1]+dist(r,r+1)*(sum[l-1]+sum[n]-sum[r]));
			}
		}
	}
	ll ans=0;
	for(ll i=1;i<=n;i++)ans+=b[i].y;
	ans-=min(dp[1][n][0],dp[1][n][1]);
	printf("%.3lf",ans/1000.0);
	return 0;
}
