#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
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

int S1(int l,int r){
	return (l+r)*(r-l+1)/2;
}

int S2(int n){
	return n*(n+1)*(2*n+1)/6;
}

int S2(int l,int r){
	return S2(r)-S2(l-1);
}

int main(){
	int N=read(),M=read();
	int K=min(N,M)-1;
	int sqr=(K+1)*N*M-(N+M)*S1(0,K)+S2(0,K);
	int tot=S1(1,N)*S1(1,M);
	int rct=tot-sqr; 
	cout<<sqr<<' '<<rct<<'\n';
	return 0;
}

