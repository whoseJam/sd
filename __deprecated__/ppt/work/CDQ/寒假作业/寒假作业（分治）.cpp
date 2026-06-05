#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
typedef long long ll;
using namespace std;

namespace FastIO{
	const ll L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline ll read(){
		ll s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const ll N=100005;
ll s[N],a[N],tot,n,k,ans;

struct Node{
	ll x,y,id;
}d[N];
ll f[N];

bool cmpX(Node a,Node b){
	return a.x<b.x;
}

bool cmpY(Node a,Node b){
	return a.y<b.y;
}

// [l, r] 小数据点对大数据点的贡献 
void dfs(ll l,ll r){
	if(l==r)return;
	ll mid=(l+r)>>1;
	dfs(l,mid);
	dfs(mid+1,r);
	// [l,mid] -> [mid+1,r]
	ll j=l-1;
	for(ll i=mid+1;i<=r;i++){
		while(j+1<=mid&&d[j+1].y<=d[i].y)j++;
		f[d[i].id]+=(j-l+1);
	}
	sort(d+l,d+r+1,cmpY);
} 

int main(){
	n=read();k=read();
	for(ll i=1;i<=n;i++){
		a[i]=read();
		s[i]=s[i-1]+a[i];
	}
	for(ll i=0;i<=n;i++)
		d[++tot]=(Node){i,s[i]-k*i,i+1};
	sort(d+1,d+1+tot,cmpX);
	dfs(1,tot);
	for(ll i=1;i<=tot;i++)
		ans+=f[i];
	cout<<ans;
	return 0;
}

