#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef unsigned long long ull;
const int N=1000005;
const ull B=13131;
char s[N];
char t[N];
ull Ss[N],St[N],P[N];
int ls,lt;

ull GetHash(ull* S,int l,int r){
	return S[r]-S[l-1]*P[r-l+1];
}

int main(){
	scanf("%s",s+1);ls=strlen(s+1);
	scanf("%s",t+1);lt=strlen(t+1);
	P[0]=1;
	for(int i=1;i<=max(ls,lt);i++)
		P[i]=P[i-1]*B;
	for(int i=1;i<=ls;i++)
		Ss[i]=Ss[i-1]*B+s[i];
	for(int i=1;i<=lt;i++)
		St[i]=St[i-1]*B+t[i];
	
	int lim=min(ls,lt);
	for(int i=lim;i>=1;i--){
		if(GetHash(Ss,ls-i+1,ls)==GetHash(St,1,i)){
			cout<<i<<'\n';
			return 0;
		}
		if(GetHash(St,lt-i+1,lt)==GetHash(Ss,1,i)){
			cout<<i<<'\n';
			return 0;
		}
	}
	cout<<0<<'\n';
	return 0;
}
