#include<iostream>
#include<cstring>
#include<cstdio>
#include<map>
using namespace std;

namespace FastIO{
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=105;
const double eps=1e-7;
double A[N][N],X[N];
int n;

double dcmp(double x){
	if(x>eps)return 1;
	return x<-eps?-1:0;
}

bool equal(double a,double b){
	return dcmp(a-b)==0;
}

bool noSolution(){
	for(int i=1;i<=n;i++){
		bool allZero=true;
		for(int j=1;j<=n;j++){
			if(dcmp(A[i][j])!=0){
				allZero=false;
				break;
			}
		}
		if(allZero&&dcmp(A[i][n+1]))return true;
	}
	return false;
}

void Gauss(){
	int r=0;
	for(int i=1;i<=n;i++){
		int pos=-1;
		for(int j=r+1;j<=n;j++){
			if(dcmp(A[j][i])!=0){
				pos=j;
				break;
			}
		}
		
		if(pos==-1)continue;
		swap(A[pos],A[++r]);
		for(int j=r+1;j<=n;j++){
			double c=A[j][i]/A[r][i];
			for(int k=i;k<=n+1;k++){
				A[j][k]-=A[r][k]*c;
			}
		}
	}
	
	if(r<n){
		if(noSolution())cout<<"-1\n";
		else cout<<"0\n";
		return;
	}
	
	for(int i=n;i>=1;i--){
		for(int j=i+1;j<=n;j++){
			A[i][n+1]-=X[j]*A[i][j];
		}
		X[i]=A[i][n+1]/A[i][i];
	}
	for(int i=1;i<=n;i++){
		printf("x%d=%.2lf\n",i,X[i]);
	}
} 

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n+1;j++){
			A[i][j]=read();
		}
	}
	Gauss();
	return 0;
}

