#include<iostream>
#include<cstring>
#include<cstdio>
#include<map>
using namespace std;

using ll=long long;

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

const ll inf=1e9;

struct Value{
	ll len,cnt[10];
	Value(){
		len=0;
		memset(cnt,0,sizeof(cnt));
	}
	bool operator <(const Value& other)const{
		if(len!=other.len)return len<other.len;
		for(ll i=9;i>=0;i--)
			if(cnt[i]!=other.cnt[i])return cnt[i]<other.cnt[i];
		return false;
	}
	void output(){
		if(len<0){cout<<-1;return;}
		for(ll i=9;i>=0;i--){
			for(ll j=1;j<=cnt[i];j++){
				cout<<i;
			}
		}
	}
};

Value Add(const Value& a,int b){
	Value c;
	c.len=a.len;
	memcpy(c.cnt,a.cnt,sizeof(c.cnt));
	c.len++;
	c.cnt[b]++;
	return c;
}

const ll N=100005;
Value f[N];
ll A[N],n,m;
ll u[10]={6,2,5,5,4,5,6,3,7,6};

int main(){
	n=read();m=read();
	for(ll i=1;i<=m;i++)A[i]=read();
	for(ll i=1;i<=n;i++){
		f[i].len=-inf;
		for(ll v=1,k;v<=m;v++){
			k=A[v];
			if(i-u[k]>=0){
				f[i]=max(f[i],Add(f[i-u[k]],k));
			}
		}
	}
	f[n].output();
	return 0;
}
