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

const ll M=35;
const ll N=1005;
const ll Mod=1234567891;
ll n,K;

struct Matrix{
	ll rows,cols;
	ll v[M][M];
	void output(){
		cout<<rows<<","<<cols<<'\n';
		for(int i=0;i<rows;i++){
			for(int j=0;j<cols;j++){
				cout<<v[i][j]<<" ";
			}cout<<"\n";
		}
	}
};

Matrix operator *(const Matrix& a,const Matrix& b){
	Matrix ans;
	ans.rows=a.rows;
	ans.cols=b.cols;
	for(int i=0;i<ans.rows;i++){
		for(int j=0;j<ans.cols;j++){
			ans.v[i][j]=0;
			for(int k=0;k<a.cols;k++){
				ans.v[i][j]+=a.v[i][k]*b.v[k][j]%Mod;
			}
			ans.v[i][j]%=Mod;
		}
	}
	return ans;
}

Matrix One(){
	Matrix ans;
	ans.rows=ans.cols=K+2;
	for(ll i=0;i<K+2;i++)
		for(ll j=0;j<K+2;j++)
			if(i==j)ans.v[i][j]=1;
			else ans.v[i][j]=0;
	return ans;
}

Matrix Trans(){
	Matrix ans;
	memset(ans.v,0,sizeof(ans.v));
	ans.rows=ans.cols=K+2;
	for(ll i=1;i<=K;i++){
		ans.v[i][i-1]=K-i+1;
		ans.v[i][i]=i;
	}
	ans.v[K+1][K-1]=1;
	ans.v[K+1][K]=K;
	ans.v[K+1][K+1]=1;
	return ans;
}

Matrix X(){
	Matrix ans;
	ans.rows=K+2;
	ans.cols=1;
	for(ll i=0;i<=K+1;i++)ans.v[i][0]=0;
	ans.v[0][0]=1;
	return ans;
}

Matrix Fpow(Matrix a,ll b){
	Matrix ans=One();
	while(b){
		if(b&1)ans=ans*a;
		b>>=1;a=a*a;
	}
	return ans;
}

void Solve(){
	n=read();K=read();
	Matrix ans=Fpow(Trans(),n)*X();
	cout<<ans.v[K+1][0]<<'\n';
}

int main(){
	ll Case=read();
	while(Case--)Solve(); 
	return 0;
}
/*
1
3 2
*/

