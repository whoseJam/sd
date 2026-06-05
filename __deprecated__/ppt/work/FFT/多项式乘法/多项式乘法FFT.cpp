#include<iostream>
#include<complex>
#include<cstring>
#include<cstdio>
#include<cmath>
#include<map>
#define M_PI (3.14159265358979323846)
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

using Complex=complex<double>;

const int N=4000005;
Complex A[N],B[N],C[N],wk[N];
int rev[N],n,m;

int Make(int len){
	int l=log2(len)+1;len=1<<l;
	for(int i=0;i<len;i++)
		rev[i]=rev[i>>1]>>1|((i&1)<<(l-1));
	return len;
}

void FFT(Complex a[],int len,int flg){
	for(int i=0;i<len;i++)if(rev[i]>i)swap(a[rev[i]],a[i]);
	for(int i=1;i<len;i<<=1){
		Complex wi={cos(flg*(2*M_PI)/(i*2)),sin(flg*(2*M_PI)/(i*2))};
		wk[0]=1;
		for(int k=1;k<i;k++)wk[k]=wk[k-1]*wi;
		for(int j=0;j<len;j+=(i*2))
			for(int k=0;k<i;k++){
				Complex x=a[j+k];
				Complex y=a[i+j+k]*wk[k];
				a[j+k]=x+y;
				a[i+j+k]=x-y;
			}
	}
	if(flg==-1)for(int i=0;i<len;i++)a[i]/=len;
}

int main(){
	n=read();m=read();
	for(int i=0;i<=n;i++)A[i]=read();
	for(int i=0;i<=m;i++)B[i]=read();
	
	int len=Make(n+m+1);
	FFT(A,len,1);FFT(B,len,1);
	for(int i=0;i<len;i++)C[i]=A[i]*B[i];
	FFT(C,len,-1);
	for(int i=0;i<=n+m;i++){
		cout<<(int)(C[i].real()+0.1)<<" ";
	}
	return 0;
}

