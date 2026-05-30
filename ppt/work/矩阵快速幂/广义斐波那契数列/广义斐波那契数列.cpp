#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;
typedef long long ll;

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

ll Mod,n,p,q,a1,a2;

struct Matrix{
	ll rows,cols;
	ll v[2][2];
	void output(){
		cout<<rows<<","<<cols<<'\n';
		for(ll i=0;i<rows;i++){
			for(ll j=0;j<cols;j++){
				cout<<v[i][j]<<" ";
			}cout<<"\n";
		}
	}
};

Matrix operator *(const Matrix& a,const Matrix& b){
	Matrix ans;
	ans.rows=a.rows;
	ans.cols=b.cols;
	for(ll i=0;i<ans.rows;i++){
		for(ll j=0;j<ans.cols;j++){
			ans.v[i][j]=0;
			for(ll k=0;k<a.cols;k++){
				ans.v[i][j]+=a.v[i][k]*b.v[k][j];
				ans.v[i][j]%=Mod;
			}
		}
	}
	return ans;
}

Matrix FibTrans(){
	Matrix ans;
	ans.rows=ans.cols=2;
	ans.v[0][0]=p;ans.v[0][1]=q;
	ans.v[1][0]=1;ans.v[1][1]=0;
	return ans;
}

Matrix One(){
	Matrix ans;
	ans.rows=ans.cols=2;
	ans.v[0][0]=1;ans.v[0][1]=0;
	ans.v[1][0]=0;ans.v[1][1]=1;
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

int main(){
	p=read();q=read();a1=read();a2=read();n=read();Mod=read();
	if(n==1){
		cout<<a1<<'\n';
		return 0;
	}
	Matrix ff;
	ff.rows=2;
	ff.cols=1;
	ff.v[0][0]=a2;
	ff.v[1][0]=a1;
	
	Matrix ans=Fpow(FibTrans(),n-2)*ff;
	cout<<ans.v[0][0]<<'\n';
	return 0;
}

