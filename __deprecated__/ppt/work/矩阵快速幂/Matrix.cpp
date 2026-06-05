#include<iostream>
#include<cstring>
#include<cstdio>
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

struct Matrix{
	int rows,cols;
	int v[10][10];
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
				ans.v[i][j]+=a.v[i][k]*b.v[k][j];
			}
		}
	}
	return ans;
}

int main(){
	Matrix a;
	a.rows=2;
	a.cols=3;
	a.v[0][0]=1;a.v[0][1]=2;a.v[0][2]=3;
	a.v[1][0]=3;a.v[1][1]=2;a.v[1][2]=1;
	
	Matrix b;
	b.rows=3;
	b.cols=4;
	b.v[0][0]=1;b.v[0][1]=1;b.v[0][2]=2;b.v[0][3]=2;
	b.v[1][0]=3;b.v[1][1]=3;b.v[1][2]=4;b.v[1][3]=4;
	b.v[2][0]=5;b.v[2][1]=5;b.v[2][2]=6;b.v[2][3]=6;
	
	Matrix c=a*b;
	c.output();
	return 0;
}

