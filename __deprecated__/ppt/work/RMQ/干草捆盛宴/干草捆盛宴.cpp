#include<bits/stdc++.h>
using namespace std;
typedef long long ll;

ll read(){
	ll s=0,f=1;char t=getchar();
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

const ll N=100005;
const ll inf=1e15;
ll n,m,F[N],S[N],sum[N],mx[N][20];

ll maxS(ll l,ll r){
	ll k=log2(r-l+1);
	return max(mx[l][k],mx[r-(1<<k)+1][k]);
}

int main(){
	n=read();m=read();
	for(ll i=1;i<=n;i++){
		F[i]=read();S[i]=read();
		mx[i][0]=S[i];
		sum[i]=sum[i-1]+F[i];
	}
	for(ll j=1;(1<<j)<=n;j++)
		for(ll i=1;i+(1<<j)-1<=n;i++)
			mx[i][j]=max(mx[i][j-1],mx[i+(1<<j-1)][j-1]);
	
	ll ans=inf;
	for(ll l=1,r=1;l<=n;l++){
		while(r+1<=n&&sum[r]-sum[l-1]<m)r++;
		if(sum[r]-sum[l-1]<m)break;
		ans=min(ans,maxS(l,r));
	}
	cout<<ans;
	return 0;
}

