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

const ll Mod=1000000007;
const ll N=705;
ll dp[N][N][3][3];
bool vis[N][N][3][3];
char s[N];
ll n,match[N];
ll sta[N],top;

bool colorPairIsValid(ll c1,ll c2){
	if(c1==0&&c2!=0)return true;
	if(c2==0&&c1!=0)return true;
	return false;
}

ll Dfs(ll l,ll r,ll cl,ll cr){
	if(l+1==r)return colorPairIsValid(cl,cr);
	if(vis[l][r][cl][cr])return dp[l][r][cl][cr];
	ll& f=dp[l][r][cl][cr];
	if(match[l]==r){
		if(cl==1&&cr==0){
			for(ll i=0;i<=2;i++)
				for(ll j=0;j<=2;j++){
					if(i==1)continue;
					f=(f+Dfs(l+1,r-1,i,j))%Mod;
				}
		}else if(cl==2&&cr==0){
			for(ll i=0;i<=2;i++)
				for(ll j=0;j<=2;j++){
					if(i==2)continue;
					f=(f+Dfs(l+1,r-1,i,j))%Mod;
				}
		}else if(cl==0&&cr==1){
			for(ll i=0;i<=2;i++)
				for(ll j=0;j<=2;j++){
					if(j==1)continue;
					f=(f+Dfs(l+1,r-1,i,j))%Mod;
				}
		}else if(cl==0&&cr==2){
			for(ll i=0;i<=2;i++)
				for(ll j=0;j<=2;j++){
					if(j==2)continue;
					f=(f+Dfs(l+1,r-1,i,j))%Mod;
				}
		}
	}else{
		ll ans=0;
		ll m=match[l];
		for(ll i=0;i<=2;i++)
			for(ll j=0;j<=2;j++){
				if(!colorPairIsValid(cl,i))continue;
				if(i==j&&i!=0)continue;
				f=(f+Dfs(l,m,cl,i)*Dfs(m+1,r,j,cr))%Mod;
			}
	}
	vis[l][r][cl][cr]=true;
	return dp[l][r][cl][cr];
}

int main(){
	scanf("%s",s+1);n=strlen(s+1);
	for(ll i=1;i<=n;i++){
		if(s[i]=='(')sta[++top]=i;
		if(s[i]==')'){
			match[sta[top]]=i;
			match[i]=sta[top];
			top--;
		}
	}
	ll ans=0;
	for(ll cl=0;cl<=2;cl++)
		for(ll cr=0;cr<=2;cr++){
			ans+=Dfs(1,n,cl,cr);
			ans%=Mod;
		}
	cout<<ans<<endl;
	return 0;
}

