#include<bits/stdc++.h>
using namespace std;

// https://oj.aicoders.cn/problem/2540
// https://www.luogu.com.cn/problem/P3667

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

typedef unsigned long long ull;
const int N=505;
const int M=505;
const ull base=131;
ull Pow[M],sm[N*2][M];
char s[N*2][M];
int n,m;

ull Hash(int idx,int l,int r){
	return sm[idx][r]-sm[idx][l-1]*Pow[r-l+1];
}

bool Check(int len){
	for(int l=1,r;l+len-1<=m;l++){
		r=l+len-1;
		set<ull> S;
		for(int i=1;i<=n;i++)
			S.insert(Hash(i,l,r));
		bool flg=true;
		for(int i=n+1;i<=n*2;i++)
			if(S.find(Hash(i,l,r))!=S.end()){
				flg=false;
				break;
			}
		if(flg)return true;
	}
	return false;
}

int main(){
	n=read();m=read();
	Pow[0]=1;
	for(int i=1;i<=m;i++)Pow[i]=Pow[i-1]*base;
	for(int i=1;i<=n*2;i++){
		scanf("%s",s[i]+1);
		for(int j=1;j<=m;j++)
			sm[i][j]=sm[i][j-1]*base+s[i][j];
	}
	int l=1,r=m,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(Check(mid))r=mid-1;
		else l=mid+1;
	}
	cout<<l<<'\n';
	return 0;
}

